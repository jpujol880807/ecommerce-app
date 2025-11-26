import {Container} from 'inversify';
import {handleApiError} from '~~/common/infrastructure/ui/server/utils/error-handler';
import type {SearchProductsUseCase} from '~~/catalog/application/products/use-cases/SearchProductsUseCase';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {validateSearchProductsInput} from '~~/catalog/application/products/validators/SearchProductsValidator';
import {defineEventHandler, readBody} from 'h3';


export default defineEventHandler(async (event) => {
    try {
        const container: Container = event.context.$container;
        const searchProductsUseCase = container.get<SearchProductsUseCase>(TYPES.SearchProductsUseCase);
        const body = await readBody(event);
        const input = validateSearchProductsInput(body);
        return searchProductsUseCase.execute(input);
    } catch (error) {
        throw handleApiError(error);
    }
});
