import {SearchBrandUseCase} from '~~/catalog/application/brands/use-cases/SearchBrandUseCase';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {validateSearchBrandsInput} from '~~/catalog/application/brands/validators/SearchBrandsValidator';
import {handleApiError} from '~~/common/infrastructure/ui/server/utils/error-handler';
import {Container} from 'inversify';
import {defineEventHandler} from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const container: Container = event.context.$container;
        const searchBrandUseCase = container.get<SearchBrandUseCase>(TYPES.SearchBrandsUseCase);
        const body = await readBody(event);
        const input = validateSearchBrandsInput(body);
        return searchBrandUseCase.execute(input);
    } catch (error) {
        throw handleApiError(error);
    }
});
