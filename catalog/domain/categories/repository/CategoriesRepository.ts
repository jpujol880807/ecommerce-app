import {Category, CategoryTree} from '../entity/Category';

export interface CategoriesRepository {
    create(payload: {
        name: string;
        slug?: string;
        meta?: Record<string, any>;
        parentId?: string | null;
    }): Promise<Category | null>;

    getById(id: string): Promise<Category | null>;

    getBySlug(slug: string): Promise<Category | null>;

    getByParentId(parentId: string | null): Promise<Category[]>;

    getRootCategories(): Promise<Category[]>;

    update(id: string, updates: Partial<{
        name: string;
        slug: string;
        parentId: string | null;
        position: number;
        meta: Record<string, any>;
    }>): Promise<Category | null>;

    delete(id: string): Promise<Category | null>;

    getAll(): Promise<Category[]>;

    getSubTree(categoryId: string): Promise<CategoryTree>;
}
