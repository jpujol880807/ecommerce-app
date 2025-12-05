import {Container} from 'inversify';
import {GetPathFromRootUseCase} from '~~/catalog/application/categories/use-cases/GetPathFromRootUseCase';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {defineEventHandler, getRouterParam} from 'h3';
import {isDomainException} from '~~/common/domain/exceptions/DomainException';


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
    const getPathFromRootUseCase = container.get<GetPathFromRootUseCase>(
        TYPES.GetPathFromRootUseCase
    );

    try {
        // 3. Execute logic
        const path = await getPathFromRootUseCase.execute(categoryId);
        return { path };
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
