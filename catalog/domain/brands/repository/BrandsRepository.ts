import {Brand} from '../entity/Brand';

export interface SearchBrandsCriteria {
    query?: string;
    page: number;
    limit: number;
}
export interface BrandsRepository {
    search(criteria: SearchBrandsCriteria): Promise<{ brands: Brand[]; total: number; pages: number ; limit: number }>;
}
