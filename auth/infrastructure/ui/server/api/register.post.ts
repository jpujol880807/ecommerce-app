import type { CreateUserUseCase } from '~~/auth/application/users/use-cases/CreateUserUseCase';
import { TYPES } from '~~/common/infrastructure/ioc/types';
import type {Container} from 'inversify';
import {validateCreateUserInput} from '~~/auth/application/users/validators/CreateUserValidator';
import {defineEventHandler, readBody} from 'h3';
import {handleApiError} from '~~/common/infrastructure/ui/server/utils/error-handler';

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
        throw handleApiError(error);
    }
});
