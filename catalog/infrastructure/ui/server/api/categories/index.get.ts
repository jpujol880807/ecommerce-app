import {Container} from 'inversify';
import {GetRootCategoriesUseCase} from '~~/catalog/application/categories/use-cases/GetRootCategoriesUseCase';
import {TYPES} from '~~/common/infrastructure/ioc/types';

export default defineEventHandler(async (event) => {
    const container:Container = event.context.$container;
    const getRootCategoriesUseCase = container.get<GetRootCategoriesUseCase>(
        TYPES.GetRootCategoriesUseCase
    );
    const categories = await getRootCategoriesUseCase.execute();
    return {categories};
})
