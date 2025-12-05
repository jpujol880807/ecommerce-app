import { Container } from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {isDomainException} from '~~/common/domain/exceptions/DomainException';
import {defineEventHandler, getRouterParam} from 'h3';
import {GetCategoryUseCase} from '~~/catalog/application/categories/use-cases/GetCategoryUseCase';


export default defineEventHandler(async (event) => {
    // 1. Get the ID from the route parameters
    const slug = getRouterParam(event, 'id');

    if (!slug) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Category ID is required',
        });
    }

    // 2. Resolve dependencies from the container
    const container: Container = event.context.$container;
    const getCategoryUseCase = container.get<GetCategoryUseCase>(
        TYPES.GetCategoryUseCase
    );

    try {
        // 3. Execute logic
        const category = await getCategoryUseCase.execute(slug);
        return { category };
    } catch (error: any) {
        // Handle not found or other specific domain errors
        if (isDomainException(error)) {
            throw createError({
                statusCode: error.statusCode,
                message: error.message,
                data: error.toJSON(),
            });
        }
        throw error;
    }
});
