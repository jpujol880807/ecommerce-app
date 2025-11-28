import type {SearchProductsCriteria} from '../repository/ProductsRepository';
import {SearchProductResult} from '../entity/SearchProductResult';

export interface SearchProductService {
    search(criteria: SearchProductsCriteria): Promise<{ results: SearchProductResult[]; total: number; totalPages: number; page: number }>;
}
