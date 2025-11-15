import type { CreateUserUseCase } from '~~/auth/application/users/use-cases/CreateUserUseCase';
import { isDomainException } from '~~/common/domain/exceptions/DomainException';
import { TYPES } from '~~/common/infrastructure/ioc/types';
import type {Container} from 'inversify';
import {validateCreateUserInput} from '~~/auth/application/users/validators/CreateUserValidator';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const input = validateCreateUserInput(body);

        const container: Container = event.context.$container;
        const createUserUseCase = container.get<CreateUserUseCase>(TYPES.CreateUserUseCase);

        const newUser = await createUserUseCase.execute(input);

        await setUserSession(event, {
            user: { id: newUser.id, email: newUser.email },
            lastLoggedIn: new Date(),
        });

        return {
            message: 'Registration successful',
            user: { id: newUser.id, email: newUser.email },
        };
    } catch (error) {
        if (isDomainException(error)) {
            throw createError({
                statusCode: error.statusCode,
                message: error.message,
                data: error.toJSON(),
            });
        }
        if (error instanceof Error) {
            throw createError({ statusCode: 500, message: error.message });
        }
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});
