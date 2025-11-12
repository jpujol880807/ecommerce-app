import {z, ZodError} from 'zod/v4';
import {SqliteUsersRepository} from '../../../../../common/infrastructure/db/repository/SqliteUsersRepository';

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(20),
});

const usersRepository = new SqliteUsersRepository();
export default defineEventHandler(async (event) => {
    try {
        const {email, password} = await readValidatedBody(event, loginSchema.parse);
        const user = await usersRepository.getUserByEmail(email);
        if (!user) {
            throw createError({statusCode: 401, message: 'User not found with provided email'});
        }
        const isPasswordValid = await verifyPassword(user.passwordHash, password);
        if (!isPasswordValid) {
            throw createError({statusCode: 401, message: 'Invalid password please try again'});
        }
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
        const errorData = (error as any).data;
        if (errorData instanceof ZodError) {
           const {fieldErrors, formErrors} = z.flattenError(errorData);
           throw createError({statusCode: 422, message: 'The data provided is not valid. Please try again', data: {fieldErrors, formErrors}});
        }
        if (error instanceof Error) {
            throw createError({statusCode: 500, message: error.message});
        }
        throw createError({statusCode: 500, message: 'Internal Server Error'});
    }
});
