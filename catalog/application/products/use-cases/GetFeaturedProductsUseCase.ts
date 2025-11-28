import {injectable, inject} from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import type {ProductsRepository} from '../../../domain/products/repository/ProductsRepository';

@injectable()
export class GetFeaturedProductsUseCase {
    // @ts-ignore
    constructor(@inject(TYPES.ProductsRepository) private productsRepository: ProductsRepository) {}

    execute(input: {limit?: number}) {
        return this.productsRepository.getGreatestDiscountPerCategory(input.limit || 5);
    }
}
