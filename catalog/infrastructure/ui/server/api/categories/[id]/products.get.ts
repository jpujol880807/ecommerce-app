import { Container } from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {isDomainException} from '~~/common/domain/exceptions/DomainException';
import {defineEventHandler, getRouterParam} from 'h3';
import type {GetByCategoryIdUseCase} from '~~/catalog/application/products/use-cases/GetByCategoryIdUseCase';


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
    const getByCategoryId = container.get<GetByCategoryIdUseCase>(
        TYPES.GetByCategoryIdUseCase
    );

    try {
        // 3. Execute logic
        const products = await getByCategoryId.execute({categoryId: id, limit: 15});
        return { products };
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
