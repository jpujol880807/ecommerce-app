import {Container} from 'inversify';
import {defineEventHandler} from 'h3';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {FindBrandByIdUseCase} from '~~/catalog/application/brands/use-cases/FindBrandByIdUseCase';

export default defineEventHandler(async (event) => {
    const {id} = event.context.params as { id: string };
    const container: Container = event.context.$container;
    const getBrandByIdUseCase = container.get<FindBrandByIdUseCase>(TYPES.FindBrandByIdUseCase);
    return getBrandByIdUseCase.execute(id);
});
