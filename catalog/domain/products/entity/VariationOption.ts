// TypeScript
export interface VariationOption {
    sku: string;
    optionCode: string;      // e.g. "0"
    label: string;           // display label
    selected: boolean;
    available: boolean;
    images: string[];        // array of image URLs (puede adaptarse a ProductImage si se desea)
    deliveryData: {
        fulfillBy: string | null;
        soldBy: string | null;
        vendorDeliveryDay: string | null;
    };
    availability: {
        stock: boolean;
    };
    productId: string;       // agregado: product_id por requerimiento
}
