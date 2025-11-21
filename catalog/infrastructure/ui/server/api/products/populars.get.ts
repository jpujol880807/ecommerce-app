import {TYPES} from '~~/common/infrastructure/ioc/types';
import {GetPopularProductsUseCase} from '~~/catalog/application/products/use-cases/GetPopularProductsUseCase';
import {Container} from 'inversify';

export default defineEventHandler(async (event) => {
    const container: Container = event.context.$container;
    const getPopularProductsUseCase = container.get<GetPopularProductsUseCase>(TYPES.GetPopularProductsUseCase);
    const query = getQuery(event);
    const limitParam = query.limit as string | undefined;
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const products = await getPopularProductsUseCase.execute({ limit });

    return {
        data: products,
    };
});
