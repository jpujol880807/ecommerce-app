// typescript
import { VariationOption } from './VariationOption';

export class ProductVariation {
    public options: VariationOption[] = [];

    constructor(
        public id: string,
        public productId: string,
        public sku: string,
        public inventoryCount: number = 0,
        public isAvailable: boolean = true,
        public isSelected: boolean = false,
        public weightGrams?: number,
        public barcode?: string,
        public fulfilledBy?: string,
        public soldBy?: string,
        public vendorDeliveryDay?: string,
        public isActive: boolean = true,
        public metaData: Record<string, any> = {},
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {}
}
