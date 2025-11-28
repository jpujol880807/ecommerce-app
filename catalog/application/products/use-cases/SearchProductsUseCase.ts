import {injectable, inject} from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import type {SearchProductsCriteria} from '../../../domain/products/repository/ProductsRepository';
import type {SearchProductService} from '~~/catalog/domain/products/services/SearchProductService';

@injectable()
export class SearchProductsUseCase {

    // @ts-ignore
    constructor(@inject(TYPES.SearchProductsService) private searchProductsService: SearchProductService) {}

    async execute(criteria: SearchProductsCriteria) {
        return this.searchProductsService.search(criteria);
    }
}
