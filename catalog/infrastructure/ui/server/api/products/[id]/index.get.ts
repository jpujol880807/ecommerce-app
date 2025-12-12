import {createError, defineEventHandler, getRouterParam} from 'h3';
import {Container} from 'inversify';
import {isDomainException} from '~~/common/domain/exceptions/DomainException';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {GetProductByIdUseCase} from '~~/catalog/application/products/use-cases/GetProductByIdUseCase';

export default defineEventHandler(async (event) => {
    // 1. Resolve dependencies from the container
    const container: Container = event.context.$container;
    const getProductByIdUseCase = container.get<GetProductByIdUseCase>(
        TYPES.GetProductByIdUseCase
    );

    const id = getRouterParam(event, 'id');

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Product Id is required',
        });
    }

    try {
        // 2. Execute logic
        const product = await getProductByIdUseCase.execute(id);
        return { product};
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
