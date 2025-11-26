import { Container } from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {GetCategorySubtreeUseCase} from '~~/catalog/application/categories/use-cases/GetCategorySubtreeUseCase';
import {isDomainException} from '~~/common/domain/exceptions/DomainException';
import {defineEventHandler, getRouterParam} from 'h3';


export default defineEventHandler(async (event) => {
    // 1. Get the ID from the route parameters
    const categoryId = getRouterParam(event, 'id');

    if (!categoryId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Category ID is required',
        });
    }

    // 2. Resolve dependencies from the container
    const container: Container = event.context.$container;
    const getCategoryTreeUseCase = container.get<GetCategorySubtreeUseCase>(
        TYPES.GetCategoryTreeUseCase
    );

    try {
        // 3. Execute logic
        const tree = await getCategoryTreeUseCase.execute({categoryId});
        return { tree };
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
