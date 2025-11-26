import {BrandsRepository, SearchBrandsCriteria} from '../../../domain/brands/repository/BrandsRepository';
import {inject, injectable} from 'inversify';
import {TYPES} from '../../../../common/infrastructure/ioc/types';

@injectable()
export class SearchBrandUseCase {
    //@ts-ignore
    constructor(@inject(TYPES.BrandsRepository) private brandsRepository: BrandsRepository) {}
    async execute(criteria: SearchBrandsCriteria) {
        return this.brandsRepository.search(criteria);
    }
}
