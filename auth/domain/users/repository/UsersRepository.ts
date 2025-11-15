import { User } from '../entity/User';

export interface UsersRepository {
    create(user: {
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
    }): Promise<User | null>;
    getById(id: number): Promise<User | null>;
    getByEmail(email: string): Promise<User | null>;
    update(id: number, updates: Partial<{
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
    }>): Promise<User | null>;
    delete(id: number): Promise<User | null>;
}
