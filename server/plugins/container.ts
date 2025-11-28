import container from '~~/common/infrastructure/ioc/container';
import {DatabaseFactory} from '~~/common/infrastructure/db/drizzle/DatabaseFactory';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {ScryptPasswordService} from '~~/auth/infrastructure/services/ScryptPasswordService';
import {PasswordService} from '~~/auth/domain/users/services/PasswordService';
import {defineNitroPlugin, useRuntimeConfig} from '#imports';
import {AlgoliaFactory} from '~~/common/infrastructure/search/algolia/AlgoliaFactory';

export default defineNitroPlugin((nitroApp) => {
    const config = useRuntimeConfig();
    const databaseFactory = new DatabaseFactory(
        config.sqliteDBURL as string,
        config.sqliteDBAuthToken as string,
        (config.env as string) ?? process.env.NODE_ENV
    );
    container.bind<DatabaseFactory>(TYPES.SqliteDatabaseConnection).toConstantValue(databaseFactory);

    const passwordService = new ScryptPasswordService(config.nuxtSessionPassword);
    container.bind<PasswordService>(TYPES.PasswordService).toConstantValue(passwordService);

    const searchFactory = new AlgoliaFactory(
        config.algoliaAppId as string,
        config.algoliaWriteApiKey as string
    );
    container.bind<AlgoliaFactory>(TYPES.SearchClientFactory).toConstantValue(searchFactory);

    nitroApp.hooks.hook('request', (event) => {
        event.context.$container = container;
    });
});
