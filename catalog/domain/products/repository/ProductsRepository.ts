// typescript
import { Product } from '../../products/entity/Product';

export interface ProductsRepository {
    getById(id: string): Promise<Product | null>;
    getBySku(sku: string): Promise<Product | null>;
    getBySlug(slug: string): Promise<Product | null>;

    getByCategoryId(categoryId: string, limit?: number, offset?: number): Promise<Product[]>;
    getByBrandId(brandId: string, limit?: number, offset?: number): Promise<Product[]>;
    getAll(limit?: number, offset?: number): Promise<Product[]>;
    search(query: string, limit?: number, offset?: number): Promise<Product[]>;

    create(productData: Partial<Product>): Promise<Product>;
    update(id: string, updates: Partial<Product>): Promise<Product | null>;
    delete(id: string): Promise<Product | null>;

    getMostExpensivePerCategory(limitPerCategory?: number): Promise<Product[]>;
    getGreatestDiscountPerCategory(limitPerCategory?: number): Promise<Product[]>;
    getGreatestDiscounts(limit?: number): Promise<Product[]>;
}
