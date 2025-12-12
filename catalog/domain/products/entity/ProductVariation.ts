// TypeScript
import type { VariationOption } from './VariationOption';

export class ProductVariation {
    public options: VariationOption[] = [];

    constructor(
        public variationLabel: string,
        public variationCode: string,
        public variationDisplayType: string = 'select',
        public variationAction: string = 'scrap'
    ) {}

    addOption(option: VariationOption): void {
        this.options.push(option);
    }

    static fromJSON(json: any): ProductVariation {
        const variation = new ProductVariation(
            json.variationLabel,
            json.variationCode,
            json.variationDisplayType,
            json.variationAction
        );

        if (Array.isArray(json.options)) {
            json.options.forEach((opt: any) => {
                variation.addOption({
                    sku: opt.sku,
                    optionCode: opt.optionCode,
                    label: opt.label,
                    selected: opt.selected,
                    available: opt.available,
                    images: opt.images || [],
                    deliveryData: {
                        fulfillBy: opt.deliveryData?.fulfillBy || null,
                        soldBy: opt.deliveryData?.soldBy || null,
                        vendorDeliveryDay: opt.deliveryData?.vendorDeliveryDay || null,
                    },
                    availability: {
                        stock: opt.availability?.stock || false,
                    },
                    productId: opt.productId,
                });
            });
        }

        return variation;
    }
}
