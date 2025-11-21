// typescript
import {ProductImage} from "./ProductImage";

export class VariationOption {
    public images: ProductImage[] = [];
    constructor(
        public id: string,
        public variationId: string,
        public value: string, // e.g. "Red", "XL"
        public sku?: string,
        public priceDelta?: number, // diferencia de precio respecto al producto base
        public stock?: number,
        public metaData?: Record<string, any>,
        public createdAt?: Date,
        public updatedAt?: Date
    ) {}

    addImage(image: ProductImage): void {
        this.images.push(image);
    }

    getPrimaryImage(): ProductImage | undefined {
        return this.images.find(img => img.position === 0) || this.images[0];
    }
}
