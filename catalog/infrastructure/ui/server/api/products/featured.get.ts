import {TYPES} from '~~/common/infrastructure/ioc/types';
import {GetFeaturedProductsUseCase} from '~~/catalog/application/products/use-cases/GetFeaturedProductsUseCase';
import {Container} from 'inversify';

export default defineEventHandler(async (event) => {
    const container: Container = event.context.$container;
    const getFeaturedProductsUseCase = container.get<GetFeaturedProductsUseCase>(TYPES.GetFeaturedProductsUseCase);
    const query = getQuery(event);
    const limitParam = query.limit as string | undefined;
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const products = await getFeaturedProductsUseCase.execute({ limit });

    return {
        data: products,
    };
});
