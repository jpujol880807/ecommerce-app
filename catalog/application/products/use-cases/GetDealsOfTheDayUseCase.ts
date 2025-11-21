import {inject, injectable} from 'inversify';
import {TYPES} from '../../../../common/infrastructure/ioc/types';
import {ProductsRepository} from '../../../domain/products/repository/ProductsRepository';

@injectable()
export class GetDealsOfTheDayUseCase {
    // @ts-ignore
    constructor(@inject(TYPES.ProductsRepository) private productsRepository: ProductsRepository) {}

    async execute(input: {limit?: number}) {
        return this.productsRepository.getGreatestDiscounts(input.limit || 10);
    }
}
