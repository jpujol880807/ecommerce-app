import {Brand} from '../../../domain/brands/entity/Brand';
import type {BrandsRepository} from '../../../domain/brands/repository/BrandsRepository';
import {inject, injectable} from 'inversify';
import {TYPES} from '../../../../common/infrastructure/ioc/types';

@injectable()
export class FindBrandByIdUseCase {
    // @ts-ignore
    constructor(@inject(TYPES.BrandsRepository) private brandsRepository: BrandsRepository) {}

    async execute(id: string): Promise<Brand | null> {
        return this.brandsRepository.findById(id);
    }
}
