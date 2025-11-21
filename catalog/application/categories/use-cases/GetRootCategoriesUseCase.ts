import {injectable, inject} from 'inversify';
import type {CategoriesRepository} from '../../../domain/categories/repository/CategoriesRepository';
import {TYPES} from '~~/common/infrastructure/ioc/types';

@injectable()
export class GetRootCategoriesUseCase {
    // @ts-ignore
    constructor(@inject(TYPES.CategoryRepository) private categoriesRepository: CategoriesRepository) {}

    async execute() {
        return this.categoriesRepository.getRootCategories();
    }
}
