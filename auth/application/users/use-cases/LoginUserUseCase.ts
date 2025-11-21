import {injectable, inject} from 'inversify';
import type {UsersRepository} from '~~/auth/domain/users/repository/UsersRepository';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {
    InvalidCredentialsException,
    InvalidPasswordException
} from '~~/auth/domain/users/exceptions/UserExceptions';
import type {PasswordService} from '~~/auth/domain/users/services/PasswordService';

@injectable()
export class LoginUserUseCase {
    private usersRepository: UsersRepository;
    constructor(
        // @ts-ignore
        @inject(TYPES.UsersRepository) usersRepository: UsersRepository,
        // @ts-ignore
        @inject(TYPES.PasswordService) private passwordService: PasswordService
    ) {
        this.usersRepository = usersRepository;
    }
    async execute(input: { email: string, password: string }): Promise<{ id: number; email: string }> {
        const { email, password } = input;
        const user = await this.usersRepository.getByEmail(email);
        if (!user) {
            throw new InvalidCredentialsException();
        }
        const isPasswordValid = await this.passwordService.verifyPassword(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new InvalidPasswordException();
        }
        return { id: user.id!!, email: user.email };
    }
}
