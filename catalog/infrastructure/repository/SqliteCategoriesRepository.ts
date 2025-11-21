import { injectable, inject } from 'inversify';
import {eq, and, sql} from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import type {CategoriesRepository} from '../../domain/categories/repository/CategoriesRepository';
import {DatabaseFactory} from '~~/common/infrastructure/db/drizzle/DatabaseFactory';
import {Category, CategoryTree} from '../../domain/categories/entity/Category';
import {categories, categoryClosure} from '~~/common/infrastructure/db/drizzle/schema';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {inArray} from 'drizzle-orm/sql/expressions/conditions';
import {CategoryNotFoundException} from '~~/catalog/domain/categories/exceptions/CategoryExceptions';

@injectable()
export class SqliteCategoriesRepository implements CategoriesRepository {
    private db: LibSQLDatabase<any>;

    // @ts-ignore
    constructor(@inject(TYPES.SqliteDatabaseConnection) dbFactory: DatabaseFactory) {
        this.db = dbFactory.getDatabase();
    }

    async create(
        payload: { name: string; slug?: string; meta?: Record<string, any>; parentId?: string | null; }
    ) {
        return await this.db.transaction(async (tx) => {
            const insertRes = await tx
                .insert(categories)
                .values({
                    name: payload.name,
                    slug: payload.slug ?? payload.name.toLowerCase().replace(/\s+/g, '-'),
                    meta: payload.meta ? JSON.stringify(payload.meta) : undefined,
                })
                .returning(this.getFields());
            if (!insertRes.length) {
                throw new Error('Failed to create category');
            }
            const newId = insertRes[0]!!.id as string;
            const newCategory = new Category(insertRes[0]!!);

            const closureInserts: Array<{ ancestor: string; descendant: string; depth: number }> = [
                { ancestor: newId, descendant: newId, depth: 0 },
            ];

            if (payload.parentId) {
                const parentAncestors = await tx
                    .select()
                    .from(categoryClosure)
                    .where(eq(categoryClosure.descendant, payload.parentId));

                for (const pa of parentAncestors) {
                    closureInserts.push({
                        ancestor: (pa as any).ancestor,
                        descendant: newId,
                        depth: Number((pa as any).depth) + 1,
                    });
                }
            }

            // insertar en batch en category_closure
            await tx.insert(categoryClosure).values(closureInserts);

            return newCategory;
        });
    }

    async getPath(id: string): Promise<Category[]> {
        const rows = await this.db
            .select()
            .from(categoryClosure)
            .innerJoin(categories, eq(categoryClosure.ancestor, categories.id))
            .where(eq(categoryClosure.descendant, id));

        const normalized = (rows as any[]).map(r => ({
            closure: r.category_closure ?? r.categoryClosure ?? r,
            cat: r.categories ?? r.categories_table ?? r.categories
        }));

        // Ordenar de raíz -> hoja: depth más grande primero
        normalized.sort((a, b) => Number(b.closure.depth ?? 0) - Number(a.closure.depth ?? 0));

        return normalized.map(({ cat }) => {
            const parsedMeta = cat.meta ? JSON.parse(cat.meta) : {};
            return new Category({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                meta: parsedMeta,
                createdAt: cat.created_at,
                updatedAt: cat.updated_at
            });
        });
    }



    private getFields() {
        return {
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            meta: this.getMeta(),
            createdAt: categories.created_at,
            updatedAt: categories.updated_at
        };
    }

    private fromDbRecord(record: any): Category {
        return {
            id: record.id,
            name: record.name,
            slug: record.slug,
            meta: this.getMeta(),
            createdAt: record.created_at,
            updatedAt: record.updated_at
        }
    }

    private getMeta() {
        return categories.meta ? JSON.parse(categories.meta as unknown as string) : null;
    }

    async getById(id: string): Promise<Category | null> {
        const results = await this.db
            .select()
            .from(categories)
            .where(eq(categories.id, id))

        return results.length ? new Category(this.fromDbRecord(results[0]!!)) : null;
    }

    async getBySlug(slug: string): Promise<Category | null> {
        const results = await this.db
            .select()
            .from(categories)
            .where(eq(categories.slug, slug));

        return results.length ? new Category(this.fromDbRecord(results[0]!!)) : null;
    }

    async getByParentId(parentId: string | null): Promise<Category[]> {
        let results;

        if (parentId) {
            // Find direct children (depth = 1) of the given parent
            const rows = await this.db
                .select()
                .from(categoryClosure)
                .innerJoin(categories, eq(categoryClosure.descendant, categories.id))
                .where(
                    and (
                        eq(categoryClosure.ancestor, parentId),
                        eq(categoryClosure.depth, 1)
                    )
                );

            results = rows.map((r: any) => r.categories);
        } else {
            // Root categories: those that only have themselves as ancestor (depth = 0)
            const allCategories = await this.db.select().from(categories);
            const rootIds = new Set<string>();

            for (const cat of allCategories) {
                const ancestors = await this.db
                    .select()
                    .from(categoryClosure)
                    .where(
                        and(
                            eq(categoryClosure.descendant, cat.id),
                            eq(categoryClosure.depth, 0)
                        )
                    );

                if (ancestors.length === 1) {
                    rootIds.add(cat.id);
                }
            }

            results = allCategories.filter(cat => rootIds.has(cat.id));
        }

        return results.map(cat => new Category({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            meta: cat.meta ? JSON.parse(cat.meta) : {},
            createdAt: cat.created_at,
            updatedAt: cat.updated_at
        }));
    }
    async getRootCategories(): Promise<Category[]> {
        // Selecciona sólo las categorías cuyo id no aparece como `descendant` con depth > 0
        const rows = await this.db
            .select()
            .from(categories)
            .where(
                sql`NOT EXISTS (
                SELECT 1 FROM ${categoryClosure} AS cc
                WHERE cc.descendant = ${categories.id}
                  AND cc.depth > 0
            )`);

        return (rows as any[]).map(cat => new Category({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            meta: cat.meta ? JSON.parse(cat.meta) : {},
            createdAt: cat.created_at,
            updatedAt: cat.updated_at
        }));
    }



    async update(id: string, updates: Partial<{
        name: string;
        slug: string;
        parentId: string | null;
        meta: Record<string, any>;
    }>): Promise<Category | null> {
        return await this.db.transaction(async (tx) => {
            const updateData: any = {};

            if (updates.name !== undefined) updateData.name = updates.name;
            if (updates.slug !== undefined) updateData.slug = updates.slug;
            if (updates.meta !== undefined) updateData.meta = JSON.stringify(updates.meta);

            // Update category fields
            const results = await tx
                .update(categories)
                .set(updateData)
                .where(eq(categories.id, id))
                .returning(this.getFields());

            if (!results.length) return null;

            // If parentId changed, rebuild closure paths
            if (updates.parentId !== undefined) {
                // Delete all existing paths except self-reference
                await tx
                    .delete(categoryClosure)
                    .where(
                        and (
                            eq(categoryClosure.descendant, id),
                            sql`${categoryClosure.depth} > 0`
                        )
                    );

                if (updates.parentId) {
                    // Get all ancestors of new parent
                    const parentAncestors = await tx
                        .select()
                        .from(categoryClosure)
                        .where(eq(categoryClosure.descendant, updates.parentId));

                    // Insert new paths
                    const newPaths = parentAncestors.map((pa: any) => ({
                        ancestor: pa.ancestor,
                        descendant: id,
                        depth: Number(pa.depth) + 1
                    }));

                    await tx.insert(categoryClosure).values(newPaths);
                }
            }

            const result = results[0]!!;
            return new Category(result);
        });
    }

    async delete(id: string): Promise<Category | null> {
        const results = await this.db
            .delete(categories)
            .where(eq(categories.id, id))
            .returning(this.getFields());

        if (!results.length) return null;

        const result = results[0]!!;
        return new Category(result);
    }

    async getAll(): Promise<Category[]> {
        const results = await this.db.select().from(categories);

        return results.map(cat => new Category({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            meta: cat.meta ? JSON.parse(cat.meta) : {},
            createdAt: cat.created_at,
            updatedAt: cat.updated_at
        }));
    }

    async getSubTree(categoryId: string): Promise<CategoryTree> {
        const nodesRows = await this.db
            .select({
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
                meta: categories.meta,
                createdAt: categories.created_at,
                updatedAt: categories.updated_at,
                depth: categoryClosure.depth,
            })
            .from(categoryClosure)
            .innerJoin(categories, eq(categoryClosure.descendant, categories.id))
            .where(eq(categoryClosure.ancestor, categoryId));

        if (!nodesRows.length) {
            throw new CategoryNotFoundException(categoryId);
        }

        const nodeIds = nodesRows.map(r => r.id);

        const edges = await this.db
            .select({
                ancestor: categoryClosure.ancestor,
                descendant: categoryClosure.descendant,
            })
            .from(categoryClosure)
            .where(
                and(
                    eq(categoryClosure.depth, 1),
                    inArray(categoryClosure.ancestor, nodeIds),
                    inArray(categoryClosure.descendant, nodeIds),
                )
            );

        // 3) Construir mapa id -> nodo del árbol
        const map = new Map<string, CategoryTree>();
        for (const r of nodesRows) {
            const meta = r.meta ? JSON.parse(r.meta as unknown as string) : {};
            map.set(r.id, new CategoryTree(
                new Category({
                    id: r.id,
                    name: r.name,
                    slug: r.slug,
                    meta,
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt,
                }),
                []
            ));
        }

        // 4) Conectar padre→hijo
        for (const e of edges) {
            const parent = map.get(e.ancestor);
            const child = map.get(e.descendant);
            if (parent && child) parent.children.push(child);
        }

        // 5) Devolver la raíz del subárbol
        const root = map.get(categoryId);
        if (!root) {
            throw new CategoryNotFoundException(categoryId);
        }
        return root;
    }
}
