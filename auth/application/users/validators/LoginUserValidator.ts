import {z} from 'zod/v4';
import {InvalidLoginDataException} from '~~/auth/domain/users/exceptions/UserExceptions';

export const LoginUserValidator = z.object({
    email: z.email().trim(),
    password: z.string().min(6).max(20),
});

export type LoginUserInput = z.infer<typeof LoginUserValidator>;

export function validateLoginUserInput(input: unknown): LoginUserInput {
    try {
        return LoginUserValidator.parse(input);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationErrors: Record<string, string[]> = {};

            error.issues.forEach((err) => {
                const field = err.path.join('.');
                if (!validationErrors[field]) {
                    validationErrors[field] = [];
                }
                validationErrors[field].push(err.message);
            });
            throw new InvalidLoginDataException('Invalid authentication data. Please review your input', validationErrors);
        }
        throw error;
    }
}
