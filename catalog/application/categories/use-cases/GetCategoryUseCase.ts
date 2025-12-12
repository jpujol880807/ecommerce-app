import {injectable, inject} from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import type {CategoriesRepository} from '../../../domain/categories/repository/CategoriesRepository';

@injectable()
export class GetCategoryUseCase {
    // @ts-ignore
    constructor(@inject(TYPES.CategoryRepository) private categoriesRepository: CategoriesRepository) {}

    async execute(slug: string) {
        return this.categoriesRepository.getBySlug(slug);
    }
}
