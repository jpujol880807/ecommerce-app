import {z} from 'zod/v4';
import {InvalidSearchProductsInputException} from '../../../domain/products/exceptions/SearchProductExceptions';

export const SearchProductsValidator = z.object({
    query: z.string().min(0, 'Search query must be at least 1 character').max(100, 'Search query must not exceed 100 characters').trim().default(''),
    categoryId: z.string().optional(),
    minRating: z.number().min(0).max(5).optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    hasDiscount: z.boolean().optional(),
    brandId: z.string().optional(),
    sortBy: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
})

export function validateSearchProductsInput(input: unknown) {
    try {
        return SearchProductsValidator.parse(input);
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
            throw new InvalidSearchProductsInputException('Invalid Search Input Data. Please review your input', validationErrors);
        }
        throw error;
    }
}
