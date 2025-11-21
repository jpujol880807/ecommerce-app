import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import {PasswordService} from '../../domain/users/services/PasswordService';
import {injectable} from 'inversify';

const scryptAsync = promisify(scrypt);

@injectable()
export class ScryptPasswordService implements PasswordService {
    private readonly encryptionKey: string;

    constructor(encryptionKey: string) {
        this.encryptionKey = encryptionKey;
    }

    async hashPassword(password: string): Promise<string> {
        const salt = randomBytes(16).toString('hex');
        const passwordWithPepper = password + this.encryptionKey;
        const derivedKey = (await scryptAsync(passwordWithPepper, salt, 64)) as Buffer;
        return `${salt}:${derivedKey.toString('hex')}`;
    }

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        const [salt, key] = hash.split(':');
        const keyBuffer = Buffer.from(key, 'hex');
        const passwordWithPepper = password + this.encryptionKey;
        const derivedKey = (await scryptAsync(passwordWithPepper, salt, 64)) as Buffer;
        return timingSafeEqual(keyBuffer, derivedKey);
    }
}
