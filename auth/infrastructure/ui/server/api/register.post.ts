import {z, ZodError} from 'zod/v4';
import { SqliteUsersRepository } from '../../../../../common/infrastructure/db/repository/SqliteUsersRepository';

const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(20),
    firstName: z.string().min(2).max(20),
    lastName: z.string().min(2).max(20),
});

const usersRepository = new SqliteUsersRepository();

export default defineEventHandler(async (event) => {
    try {
        // Validate request body
        const { email, password, firstName, lastName } = await readValidatedBody(event, registerSchema.parse);

        // Check if user already exists
        const existingUser = await usersRepository.getUserByEmail(email);
        if (existingUser) {
            throw createError({ statusCode: 400, message: 'User with this email already exists' });
        }

        // Hash the password
        const passwordHash = await hashPassword(password);

        // Create the user
        const newUser = await usersRepository.createUser({
            email,
            firstName,
            lastName,
            passwordHash,
        });
        if (!newUser) {
            throw createError({ statusCode: 500, message: 'Failed to create user' });
        }

        await setUserSession(event, {
            user: {
                id: newUser.id,
                email: newUser.email
            },
            lastLoggedIn: new Date()
        });
        // Return success response
        return { message: 'Registration successful', user: { id: newUser.id, email: newUser.email } };
    } catch (error) {
        const errorData = (error as any).data;
        if (errorData instanceof ZodError) {
            const {fieldErrors, formErrors} = z.flattenError(errorData);
            throw createError({statusCode: 422, message: 'The data provided is not valid. Please try again', data: {fieldErrors, formErrors}});
        }
        if (error instanceof Error) {
            throw createError({ statusCode: 500, message: error.message });
        }
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});
