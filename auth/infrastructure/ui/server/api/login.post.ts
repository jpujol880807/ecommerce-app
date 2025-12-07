// TypeScript
import {validateLoginUserInput} from '~~/auth/application/users/validators/LoginUserValidator';
import type {Container} from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import type {LoginUserUseCase} from '~~/auth/application/users/use-cases/LoginUserUseCase';
import {defineEventHandler, readBody, setCookie} from 'h3';
import {handleApiError} from '~~/common/infrastructure/ui/server/utils/error-handler';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const input = validateLoginUserInput(body);

        // soportar valores booleanos y string "true"
        const remember = body.remember === true || body.remember === 'true';

        const container: Container = event.context.$container;
        const loginUserUseCase = container.get<LoginUserUseCase>(TYPES.LoginUserUseCase);
        const user = await loginUserUseCase.execute({ email: input.email, password: input.password });

        // Duraciones en milisegundos / segundos
        const oneHourMs = 1000 * 60 * 60;
        const thirtyDaysMs = 1000 * 60 * 60 * 24 * 30;
        const expiresAt = new Date(Date.now() + (remember ? thirtyDaysMs : oneHourMs));

        // Guardar sesión en servidor (usa la función existente en el proyecto)
        await setUserSession(event, {
            user: {
                id: user.id,
                email: user.email
            },
            lastLoggedIn: new Date(),
            expiresAt
        });

        // Generar objeto de sesión para cliente y contexto
        const session = { userId: user.id, email: user.email, expiresAt: expiresAt.toISOString(), remember };

        // Fijar cookie persistente si "remember" está activado; de lo contrario cookie de corta duración
        setCookie(event, 'app_session', JSON.stringify(session), {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            // maxAge en segundos
            maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60
        });

        event.context.session = session;

        return { message: 'Login successful', session };
    } catch (error) {
        throw handleApiError(error);
    }
});
