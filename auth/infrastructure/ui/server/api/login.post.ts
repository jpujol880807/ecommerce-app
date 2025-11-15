import {validateLoginUserInput} from '~~/auth/application/users/validators/LoginUserValidator';
import type {Container} from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import type {LoginUserUseCase} from '~~/auth/application/users/use-cases/LoginUserUseCase';
import {isDomainException} from '~~/common/domain/exceptions/DomainException';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const input = validateLoginUserInput(body);
        const container: Container = event.context.$container;
        const loginUserUseCase = container.get<LoginUserUseCase>(TYPES.LoginUserUseCase);
        const user = await loginUserUseCase.execute({ email: input.email, password: input.password });
        await setUserSession(event, {
            user: {
                id: user.id,
                email: user.email
            },
            lastLoggedIn: new Date()
        });
        // Generate session or token (example: using a simple session)
        const session = {userId: user.id, email: user.email};
        event.context.session = session;

        // Return success response
        return {message: 'Login successful', session};
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
