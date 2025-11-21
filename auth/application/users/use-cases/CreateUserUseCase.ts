import type {UsersRepository} from '~~/auth/domain/users/repository/UsersRepository';
import {injectable, inject} from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {UserAlreadyExistsException, UserCreationFailedException} from '~~/auth/domain/users/exceptions/UserExceptions';
import type {User} from '~~/auth/domain/users/entity/User';
import type {PasswordService} from '~~/auth/domain/users/services/PasswordService';

@injectable()
export class CreateUserUseCase {
    private usersRepository: UsersRepository;
    // @ts-ignore
    constructor(
        // @ts-ignore
        @inject(TYPES.UsersRepository) usersRepository: UsersRepository,
        // @ts-ignore
        @inject(TYPES.PasswordService) private passwordService: PasswordService
    ) {
        this.usersRepository = usersRepository;
    }

    async execute(input: {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
    }): Promise<User> {
        const existingUser = await this.usersRepository.getByEmail(input.email);
        if (existingUser) {
            throw new UserAlreadyExistsException(input.email);
        }

        const passwordHash = await this.passwordService.hashPassword(input.password);
        const newUser = await this.usersRepository.create({
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            passwordHash: passwordHash,
        });

        if (!newUser) {
            throw new UserCreationFailedException();
        }

        return newUser;
    }
}
