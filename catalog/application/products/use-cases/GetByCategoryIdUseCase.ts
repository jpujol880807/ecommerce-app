import {injectable, inject} from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import type {ProductsRepository} from '../../../domain/products/repository/ProductsRepository';

@injectable()
export class GetByCategoryIdUseCase {
    // @ts-ignore
    constructor(@inject(TYPES.ProductsRepository) private productsRepository: ProductsRepository) {}

    execute(input: {categoryId: string; limit?: number; offset?: number}) {
        return this.productsRepository.getByCategoryId(input.categoryId, input.limit, input.offset);
    }
}
