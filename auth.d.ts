declare module '#auth-utils' {
    interface User {
        id: number;
        email: string;
    }

    interface UserSession {
        lastLoggedIn: Date;
    }
}

export {}
