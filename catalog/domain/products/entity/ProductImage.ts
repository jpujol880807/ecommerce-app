export class ProductImage {
    constructor(
        public id: string,
        public productId: string,
        public productVariantId: string | null,
        public urlSmall: string | null,
        public urlMedium: string | null,
        public urlLarge: string | null,
        public urlOriginal: string,
        public alt: string | null,
        public position: number = 0,
        public createdAt: Date
    ) {}

    /**
     * Obtiene la URL apropiada según el tamaño solicitado
     */
    getUrl(size: 'small' | 'medium' | 'large' | 'original' = 'large'): string {
        switch (size) {
            case 'small':
                return this.urlSmall || this.urlOriginal;
            case 'medium':
                return this.urlMedium || this.urlOriginal;
            case 'large':
                return this.urlLarge || this.urlOriginal;
            default:
                return this.urlOriginal;
        }
    }

    /**
     * Verifica si la imagen tiene todas las variantes de tamaño
     */
    hasAllSizes(): boolean {
        return !!(this.urlSmall && this.urlMedium && this.urlLarge);
    }
}
