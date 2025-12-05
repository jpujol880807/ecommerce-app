import { ProductVariation } from './ProductVariation';
import { ProductImage } from './ProductImage';
import { Category } from '../../categories/entity/Category';

export class Product {
    public categories: Category[] = [];
    public variations: ProductVariation[] = [];
    public images: ProductImage[] = [];

    constructor(
        public id: string,
        public title: string,
        public slug: string,
        public sku: string,
        public brandId: string | null,
        public brandName: string | null,
        public shortDescription: string | null,
        public description: string | null,
        public priceCents: number = 0,
        public listPriceCents: number = 0,
        public shippingCents: number = 0,
        public discountPercentage: number = 0,
        public stockCount: number = 0,
        public isInStock: boolean = true,
        public status: 'new' | 'used' | 'refurbished' = 'new',
        public isCollection: boolean = false,
        public isDigital: boolean = false,
        public weightKg: number | null = null,
        public dimensions: string | null = null,
        public isbn: string | null = null,
        public ean: string | null = null,
        public parentAsin: string | null = null,
        public productUrl: string | null = null,
        public vendorUrl: string | null = null,
        public reviewsUrl: string | null = null,
        public fulfilledBy: string | null = null,
        public soldBy: string | null = null,
        public merchantReturns: boolean = false,
        public rating: number | null = null,
        public metadata: Record<string, any> = {},
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {}

    addVariation(variation: ProductVariation): void {
        this.variations.push(variation);
    }

    addImage(image: ProductImage): void {
        this.images.push(image);
    }

    addCategory(category: Category): void {
        this.categories.push(category);
    }

    getPrimaryImage(): ProductImage | undefined {
        return this.images.find(img => img.position === 0) || this.images[0];
    }

    /**
     * Obtiene el precio en formato decimal (dólares/euros)
     */
    getPrice(): number {
        return this.priceCents / 100;
    }

    /**
     * Obtiene el precio de lista en formato decimal
     */
    getListPrice(): number {
        return this.listPriceCents / 100;
    }

    /**
     * Calcula el ahorro en formato decimal
     */
    getSavings(): number {
        return (this.listPriceCents - this.priceCents) / 100;
    }

    /**
     * Verifica si el producto tiene descuento
     */
    hasDiscount(): boolean {
        return this.listPriceCents > this.priceCents;
    }

    /**
     * Verifica si el producto está disponible
     */
    isAvailable(): boolean {
        return this.isInStock && this.stockCount > 0;
    }

    /**
     * Verifica si el producto tiene envío gratis
     */
    hasFreeShipping(): boolean {
        return this.shippingCents === 0;
    }

    static fromJSON(data: any): Product {
        const product = new Product(
            data.id,
            data.title,
            data.slug,
            data.sku,
            data.brandId,
            data.brandName,
            data.shortDescription,
            data.description,
            data.priceCents,
            data.listPriceCents,
            data.shippingCents,
            data.discountPercentage,
            data.stockCount,
            data.isInStock,
            data.status,
            data.isCollection,
            data.isDigital,
            data.weightKg,
            data.dimensions,
            data.isbn,
            data.ean,
            data.parentAsin,
            data.productUrl,
            data.vendorUrl,
            data.reviewsUrl,
            data.fulfilledBy,
            data.soldBy,
            data.merchantReturns,
            data.rating,
            data.metadata,
            data.createdAt ? new Date(data.createdAt) : new Date(),
            data.updatedAt ? new Date(data.updatedAt) : new Date()
        );

        product.images = data.images.map((i: any) => ProductImage.fromJSON(i)) || [];
        product.variations = data.variations || [];
        product.categories = data.categories || [];

        return product;
    }

}

