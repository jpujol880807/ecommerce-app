import {z} from 'zod/v4';
import {InvalidSearchBrandsInputException} from '../../../domain/brands/exceptions/BrandExceptions';

export const SearchBrandsValidator = z.object({
    query: z.string().min(0, 'Search query must be at least 1 character').max(100, 'Search query must not exceed 100 characters').trim().default(''),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
});

export type SearchBrandsInput = z.infer<typeof SearchBrandsValidator>;

export function validateSearchBrandsInput(input: unknown): SearchBrandsInput {
    try {
        return SearchBrandsValidator.parse(input);
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
            throw new InvalidSearchBrandsInputException('Invalid Search Input Data. Please review your input', validationErrors);
        }
        throw error;
    }

}
