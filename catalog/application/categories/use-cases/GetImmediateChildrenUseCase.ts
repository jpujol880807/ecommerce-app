import {injectable, inject} from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import type {CategoriesRepository} from '../../../domain/categories/repository/CategoriesRepository';
import {Category} from '../../../domain/categories/entity/Category';

@injectable()
export class GetImmediateChildrenUseCase {
    // @ts-ignore
    constructor(@inject(TYPES.CategoryRepository) private categoriesRepository: CategoriesRepository) {}

    async execute(categoryId: string):Promise<Category[]> {
        return this.categoriesRepository.getImmediateChildren(categoryId);
    }
}
