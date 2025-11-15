export class User {
    readonly id?: number;
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;

    constructor(props: {
        id?: number;
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
    }) {
        if (!props.email) throw new Error('Email es requerido');
        this.id = props.id;
        this.email = props.email.toLowerCase();
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.passwordHash = props.passwordHash;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
