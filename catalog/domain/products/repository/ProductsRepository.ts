// typescript
import { Product } from '../../products/entity/Product';

export interface SearchProductsCriteria {
    query?: string;
    categoryId?: string;
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
    hasDiscount?: boolean;
    brandId?: string;
    sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
    page: number;
    limit: number;
}

export interface ProductsRepository {
    getById(id: string): Promise<Product | null>;
    getBySku(sku: string): Promise<Product | null>;
    getBySlug(slug: string): Promise<Product | null>;

    getByCategoryId(categoryId: string, limit?: number, offset?: number): Promise<Product[]>;
    getByBrandId(brandId: string, limit?: number, offset?: number): Promise<Product[]>;
    getAll(limit?: number, offset?: number): Promise<Product[]>;
    create(productData: Partial<Product>): Promise<Product>;
    update(id: string, updates: Partial<Product>): Promise<Product | null>;
    delete(id: string): Promise<Product | null>;

    getMostExpensivePerCategory(limitPerCategory?: number): Promise<Product[]>;
    getGreatestDiscountPerCategory(limitPerCategory?: number): Promise<Product[]>;
    getGreatestDiscounts(limit?: number): Promise<Product[]>;
    search(criteria: SearchProductsCriteria): Promise<{ products: Product[]; total: number; page: number; limit: number }>;
}
