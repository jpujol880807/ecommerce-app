import {Container} from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {SqliteUsersRepository} from '~~/auth/infrastructure/repository/SqliteUsersRepository';
import type {UsersRepository} from '~~/auth/domain/users/repository/UsersRepository';
import {CreateUserUseCase} from '~~/auth/application/users/use-cases/CreateUserUseCase';
import {LoginUserUseCase} from '~~/auth/application/users/use-cases/LoginUserUseCase';
import type {CategoriesRepository} from '~~/catalog/domain/categories/repository/CategoriesRepository';
import {SqliteCategoriesRepository} from '~~/catalog/infrastructure/repository/SqliteCategoriesRepository';
import {GetRootCategoriesUseCase} from '~~/catalog/application/categories/use-cases/GetRootCategoriesUseCase';
import {GetCategorySubtreeUseCase} from '~~/catalog/application/categories/use-cases/GetCategorySubtreeUseCase';
import type {ProductsRepository} from '~~/catalog/domain/products/repository/ProductsRepository';
import {SqliteProductsRepository} from '~~/catalog/infrastructure/repository/SqliteProductsRepository';
import {GetDealsOfTheDayUseCase} from '~~/catalog/application/products/use-cases/GetDealsOfTheDayUseCase';
import {GetFeaturedProductsUseCase} from '~~/catalog/application/products/use-cases/GetFeaturedProductsUseCase';
import {GetPopularProductsUseCase} from '~~/catalog/application/products/use-cases/GetPopularProductsUseCase';
import {SearchProductsUseCase} from '~~/catalog/application/products/use-cases/SearchProductsUseCase';
import type {BrandsRepository} from '~~/catalog/domain/brands/repository/BrandsRepository';
import {SqliteBrandsRepository} from '~~/catalog/infrastructure/repository/SqliteBrandsRepository';
import {SearchBrandUseCase} from '~~/catalog/application/brands/use-cases/SearchBrandUseCase';
import {FindBrandByIdUseCase} from '~~/catalog/application/brands/use-cases/FindBrandByIdUseCase';
import type {SearchProductService} from '~~/catalog/domain/products/services/SearchProductService';
import {AlgoliaProductSearchService} from '~~/catalog/infrastructure/services/AlgoliaProductSearchService';

const container = new Container({defaultScope: 'Singleton'});

/**
 * 1 - Auth bindings
 */

container.bind<UsersRepository>(TYPES.UsersRepository).to(SqliteUsersRepository);
container.bind<CreateUserUseCase>(TYPES.CreateUserUseCase).to(CreateUserUseCase);
container.bind<LoginUserUseCase>(TYPES.LoginUserUseCase).to(LoginUserUseCase);

/**
 * 2 - Catalog bindings
 */

// 2.1 - Category bindings
container.bind<CategoriesRepository>(TYPES.CategoryRepository).to(SqliteCategoriesRepository);
container.bind<GetRootCategoriesUseCase>(TYPES.GetRootCategoriesUseCase).to(GetRootCategoriesUseCase);
container.bind<GetCategorySubtreeUseCase>(TYPES.GetCategoryTreeUseCase).to(GetCategorySubtreeUseCase);
// 2.2 Product bindings
container.bind<ProductsRepository>(TYPES.ProductsRepository).to(SqliteProductsRepository);
container.bind<GetDealsOfTheDayUseCase>(TYPES.GetDealsOfTheDayUseCase).to(GetDealsOfTheDayUseCase);
container.bind<GetFeaturedProductsUseCase>(TYPES.GetFeaturedProductsUseCase).to(GetFeaturedProductsUseCase);
container.bind<GetPopularProductsUseCase>(TYPES.GetPopularProductsUseCase).to(GetPopularProductsUseCase);
container.bind<SearchProductsUseCase>(TYPES.SearchProductsUseCase).to(SearchProductsUseCase);
// Brands bindings
container.bind<BrandsRepository>(TYPES.BrandsRepository).to(SqliteBrandsRepository);
container.bind<SearchBrandUseCase>(TYPES.SearchBrandsUseCase).to(SearchBrandUseCase);
container.bind<FindBrandByIdUseCase>(TYPES.FindBrandByIdUseCase).to(FindBrandByIdUseCase);
container.bind<SearchProductService>(TYPES.SearchProductsService).to(AlgoliaProductSearchService);
export default container;
