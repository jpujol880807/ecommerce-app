import {LibSQLDatabase} from 'drizzle-orm/libsql';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {DatabaseFactory} from '~~/common/infrastructure/db/drizzle/DatabaseFactory';
import {injectable, inject} from 'inversify';
import {Brand} from '../../domain/brands/entity/Brand';
import {brands} from '~~/common/infrastructure/db/drizzle/schema';
import {count, eq, like} from 'drizzle-orm';
import type {BrandsRepository, SearchBrandsCriteria} from '~~/catalog/domain/brands/repository/BrandsRepository';

@injectable()
export class SqliteBrandsRepository implements BrandsRepository {
    private db: LibSQLDatabase<any>;
    // @ts-ignore
    constructor(@inject(TYPES.SqliteDatabaseConnection) private dbConnection: DatabaseFactory) {
        this.db = dbConnection.getDatabase();
    }

    async search(criteria: SearchBrandsCriteria): Promise<{ brands: Brand[], total: number, pages: number, limit: number }> {
        const results = await this.db
            .select()
            .from(brands)
            .where(like(brands.name, `%${criteria.query}%`))
            .limit(criteria.limit)
            .offset((criteria.page - 1) * criteria.limit);

        const brandResults = results.map(row => new Brand(row));

        const totalResults = await this.db
            .select({count: count()})
            .from(brands)
            .where(like(brands.name, `%${criteria.query}%`));

        const total = totalResults.length ? totalResults[0]!!.count : 0;
        const pages = Math.ceil(total / criteria.limit);
        return {
            brands: brandResults,
            total: total,
            pages: pages,
            limit: criteria.limit,
        };
    }

    async findById(id: string): Promise<Brand | null> {
        const result = await this.db
            .select()
            .from(brands)
            .where(eq(brands.id, id))
            .limit(1);

        if (result.length === 0) {
            return null;
        }

        return new Brand(result[0]!!);
    }
}
