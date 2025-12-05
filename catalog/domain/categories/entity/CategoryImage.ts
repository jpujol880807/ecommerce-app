export class CategoryImage {
    constructor(
        public id: string,
        public categoryId: string,
        public urlSmall: string | null,
        public urlMedium: string | null,
        public urlLarge: string | null,
        public urlOriginal: string,
        public alt: string | null,
        public position: number = 0,
        public createdAt: Date
    ) {}
}
