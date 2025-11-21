export class Category {
    readonly id?: string;
    public readonly name: string;
    public readonly meta?: Record<string, any>;
    public readonly slug: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    constructor(props: {
        id?: string;
        name: string;
        slug?: string;
        description?: string;
        meta?: Record<string, any>;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.id = props.id;
        this.name = props.name;
        this.slug = props.slug ? props.slug : Category.generateSlug(props.name);
        this.meta = props.meta;
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

export class CategoryTree {
    public readonly category: Category;
    public readonly children: CategoryTree[];

    constructor(category: Category, children: CategoryTree[] = []) {
        this.category = category;
        this.children = children;
    }

    addChild(child: CategoryTree) {
        this.children.push(child);
    }
}
