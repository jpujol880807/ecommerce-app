import {TYPES} from '~~/common/infrastructure/ioc/types';
import {Container} from 'inversify';
import type {GetDealsOfTheDayUseCase} from '~~/catalog/application/products/use-cases/GetDealsOfTheDayUseCase';
import {defineEventHandler, getQuery} from 'h3';

export default defineEventHandler(async (event) => {
    const container: Container = event.context.$container;
    const getProductDealsUseCase = container.get<GetDealsOfTheDayUseCase>(TYPES.GetDealsOfTheDayUseCase);
    const query = getQuery(event);
    const limitParam = query.limit as string | undefined;
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const products = await getProductDealsUseCase.execute({ limit });

    return {
        data: products,
    };
});
