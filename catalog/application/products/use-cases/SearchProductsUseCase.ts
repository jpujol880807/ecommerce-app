import {injectable, inject} from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import type {ProductsRepository, SearchProductsCriteria} from '../../../domain/products/repository/ProductsRepository';

@injectable()
export class SearchProductsUseCase {
    // @ts-ignore
    constructor(@inject(TYPES.ProductsRepository) private productsRepository: ProductsRepository) {}

    async execute(criteria: SearchProductsCriteria) {
        return this.productsRepository.search(criteria);
    }
}
