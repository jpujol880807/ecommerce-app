import {TYPES} from '~~/common/infrastructure/ioc/types';
import type {CategoriesRepository} from '../../../domain/categories/repository/CategoriesRepository';
import {injectable, inject} from 'inversify';

@injectable()
export class GetCategorySubtreeUseCase {
    // @ts-ignore
    constructor(@inject(TYPES.CategoryRepository) private categoriesRepository: CategoriesRepository) {}

    async execute(input: { categoryId: string }) {
        return this.categoriesRepository.getSubTree(input.categoryId);
    }
}
