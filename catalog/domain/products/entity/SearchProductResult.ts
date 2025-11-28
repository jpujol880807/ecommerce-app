import type {Product} from '~~/catalog/domain/products/entity/Product';

export class SearchProductResult {
    hasDiscount() {
        throw new Error('Method not implemented.');
    }
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    priceCents: number;
    listPriceCents: number;
    discountPercentage: number;
    rating: number | null;
    primaryImageUrl: string | null;
    isInStock: boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    brand: {
        id: string;
        name: string;
    } | null;
    categories: {
        id: string;
        name: string;
        slug: string;
    }[];
    constructor(data: {
        id: string;
        title: string;
        slug: string;
        description: string;
        shortDescription: string;
        priceCents: number;
        listPriceCents: number;
        discountPercentage: number;
        rating: number | null;
        primaryImageUrl: string | null;
        isInStock: boolean;
        status: string;
        brand: {
            id: string;
            name: string;
        } | null;
        categories: {
            id: string;
            name: string;
            slug: string;
        }[];
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.id = data.id;
        this.title = data.title;
        this.slug = data.slug;
        this.description = data.description;
        this.shortDescription = data.shortDescription;
        this.priceCents = data.priceCents;
        this.listPriceCents = data.listPriceCents;
        this.discountPercentage = data.discountPercentage;
        this.rating = data.rating;
        this.primaryImageUrl = data.primaryImageUrl;
        this.brand = data.brand;
        this.categories = data.categories;
        this.status = data.status;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.isInStock = data.isInStock;
    }

    static fromProduct(product: Product) {
        return new SearchProductResult({
            id: product.id,
            title: product.title,
            slug: product.slug,
            description: product.description || '',
            shortDescription: product.shortDescription || '',
            priceCents: product.priceCents,
            listPriceCents: product.listPriceCents,
            discountPercentage: product.discountPercentage,
            rating: product.rating,
            primaryImageUrl: product.images.length > 0 ? product.images[0]!!.getUrl('medium') : null,
            isInStock: product.isInStock,
            status: product.status,
            brand: product.brandId ? {
                id: product.brandId,
                name: product.brandName || ''// El nombre de la marca debería ser obtenido de otra fuente si es necesario
            } : null,
            categories: product.categories.map(cat => ({
                id: cat.id || '',
                name: cat.name,
                slug: cat.slug
            })),
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        });
    }
}
