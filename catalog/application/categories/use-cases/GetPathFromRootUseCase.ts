import {injectable, inject} from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';

@injectable()
export class GetPathFromRootUseCase {
    // @ts-ignore
    constructor(@inject(TYPES.CategoryRepository) private categoriesRepository: CategoriesRepository) {}

    async execute(categoryId: string) {
        return this.categoriesRepository.getPathFromRoot(categoryId);
    }
}
