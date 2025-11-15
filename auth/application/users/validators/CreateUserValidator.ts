import { z, ZodError } from 'zod/v4';
import {InvalidUserCreationDataException} from '~~/auth/domain/users/exceptions/UserExceptions';

export const CreateUserValidator = z.object({
    email: z
        .email()
        .trim(),
    firstName: z
        .string()
        .min(2, 'First name must be at least 2 characters')
        .max(20, 'First name must not exceed 20 characters')
        .trim(),
    lastName: z
        .string()
        .min(2, 'Last name must be at least 2 characters')
        .max(20, 'Last name must not exceed 20 characters')
        .trim(),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must not exceed 20 characters')
});

export type CreateUserInput = z.infer<typeof CreateUserValidator>;

export function validateCreateUserInput(input: unknown): CreateUserInput {
    try {
        return CreateUserValidator.parse(input);
    } catch (error) {
        if (error instanceof ZodError) {
            const validationErrors: Record<string, string[]> = {};

            error.issues.forEach((err) => {
                const field = err.path.join('.');
                if (!validationErrors[field]) {
                    validationErrors[field] = [];
                }
                validationErrors[field].push(err.message);
            });

            throw new InvalidUserCreationDataException(
                'Incorrect data provided. Please review your input.',
                validationErrors
            );
        }
        throw error;
    }
}
