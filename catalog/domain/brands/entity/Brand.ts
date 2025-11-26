export class Brand {
    readonly id?: string;
    public readonly name: string;
    public readonly slug: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(props: {
        id?: string;
        name: string;
        slug?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.id = props.id;
        this.name = props.name;
        this.slug = props.slug ?? Brand.generateSlug(props.name);
        this.createdAt = props.createdAt ?? new Date();
        this.updatedAt = props.updatedAt ?? new Date();
    }

    static generateSlug(name: string) {
        return name
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}
