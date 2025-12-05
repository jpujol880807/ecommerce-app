import { Container } from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {isDomainException} from '~~/common/domain/exceptions/DomainException';
import {defineEventHandler, getRouterParam} from 'h3';
import type {
    GetImmediateChildrenUseCase
} from '~~/catalog/application/categories/use-cases/GetImmediateChildrenUseCase';


export default defineEventHandler(async (event) => {
    // 1. Get the ID from the route parameters
    const id = getRouterParam(event, 'id');

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Category ID is required',
        });
    }

    // 2. Resolve dependencies from the container
    const container: Container = event.context.$container;
    const getImmediateChildrenUseCase = container.get<GetImmediateChildrenUseCase>(
        TYPES.GetImmediateChildrenUseCase
    );

    try {
        // 3. Execute logic
        const children = await getImmediateChildrenUseCase.execute(id);
        return { children };
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
