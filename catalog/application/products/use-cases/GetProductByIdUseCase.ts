import {inject, injectable} from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import type {ProductsRepository} from '../../../domain/products/repository/ProductsRepository';

@injectable()
export class GetProductByIdUseCase {
    // @ts-ignore
    constructor(@inject(TYPES.ProductsRepository) private productsRepository: ProductsRepository) {}

    async execute(productId: string) {
        return this.productsRepository.getById(productId);
    }
}
