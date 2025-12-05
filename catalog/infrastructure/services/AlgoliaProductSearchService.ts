import {inject, injectable} from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {AlgoliaFactory} from '~~/common/infrastructure/search/algolia/AlgoliaFactory';
import type {SearchClient} from 'algoliasearch';
import type {SearchProductsCriteria} from '../../domain/products/repository/ProductsRepository';
import {SearchProductResult} from '../../domain/products/entity/SearchProductResult';
import type {SearchProductService} from '../../domain/products/services/SearchProductService';

interface AlgoliaSearchResult {
    objectID: string;
    title: string;
    slug: string;
    short_description: string;
    description: string;
    price_cents: string;
    list_price_cents: string;
    discount_percentage: string;
    rating: string;
    is_in_stock: string;
    stock_count: string;
    brand_id: string;
    brand_name: string;
    primary_image_url: string;
    categories: { id: string; name: string; slug: string }[];
    created_at: string;
    updated_at: string;
    status: string;
}


@injectable()
export class AlgoliaProductSearchService implements SearchProductService {
    private indexName = 'ecommerce_app_products';
    private client: SearchClient;

    // @ts-ignore
    constructor(@inject(TYPES.SearchClientFactory) clientFactory: AlgoliaFactory) {
        this.client = clientFactory.getClient();
    }

    async search(criteria: SearchProductsCriteria): Promise <{ results: SearchProductResult[]; total: number; totalPages: number; page: number }> {
        const searchParams: Record<string, any> = {
            hitsPerPage: criteria.limit || 10,
            page: criteria.page ? Math.floor(criteria.page / (criteria.limit || 10)) : 0,
        };

        const filters = ['price_cents > 0'];
        if (criteria.brandId) filters.push(`brand_id:${criteria.brandId}`);
        if (criteria.minPrice) filters.push(`price_cents >= ${criteria.minPrice * 100}`);
        if (criteria.maxPrice) filters.push(`price_cents <= ${criteria.maxPrice * 100}`);
        if (criteria.categoryId) filters.push(`categories.id:${criteria.categoryId}`);
        if (criteria.minRating) filters.push(`rating >= ${criteria.minRating}`);
        if (criteria.hasDiscount) filters.push(`discount_percentage > 0`);

        if (filters.length > 0) {
            searchParams.filters = filters.join(' AND ');
        }

        let indexName = this.indexName;
        if (criteria.sortBy) {
            const sortMap: Record<string, string> = {
                'price_asc': 'ecommerce_app_products_price_asc',
                'price_desc': 'ecommerce_app_products_price_desc',
                'rating_desc': 'ecommerce_app_products_rating_desc',
                'newest': 'ecommerce_app_products_created_at_desc',
            };
            indexName = sortMap[criteria.sortBy] || this.indexName;
        }

        const result = await this.client.search<AlgoliaSearchResult>({
            requests: [{
                indexName: indexName,
                query: criteria.query || '',
                ...searchParams
            }]
        });

        const searchResponse = result.results[0];

        if (!searchResponse || !('hits' in searchResponse!!)) {
            throw new Error('Unexpected Algolia response format');
        }

        const hits = searchResponse.hits;
        const nbHits = searchResponse.nbHits;
        const nbPages = searchResponse.nbPages;
        const page = searchResponse.page;

        return {
            results: hits.map(hit => new SearchProductResult({
                id: hit.objectID,
                title: hit.title,
                slug: hit.slug,
                shortDescription: hit.short_description,
                description: hit.description,
                priceCents: parseInt(hit.price_cents, 10),
                listPriceCents: parseInt(hit.list_price_cents, 10),
                discountPercentage: parseFloat(hit.discount_percentage),
                rating: hit.rating ? parseFloat(hit.rating) : null,
                primaryImageUrl: hit.primary_image_url,
                isInStock: hit.is_in_stock === 'true',
                status: hit.status,
                brand: hit.brand_id ? {
                    id: hit.brand_id,
                    name: hit.brand_name,
                } : null,
                categories: hit.categories.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                })),
                createdAt: new Date(parseInt(hit.created_at, 10)),
                updatedAt: new Date(parseInt(hit.updated_at, 10)),
            })),
            total: nbHits || 0,
            totalPages: nbPages || 0,
            page: page || 0,
        };
    }
}
