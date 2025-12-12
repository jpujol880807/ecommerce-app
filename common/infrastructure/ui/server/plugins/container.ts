import container from '../../../ioc/container';
import {DatabaseFactory} from '../../../db/drizzle/DatabaseFactory';
import {TYPES} from '../../../ioc/types';
import {AlgoliaFactory} from '../../../search/algolia/AlgoliaFactory';
import {ScryptPasswordService} from '~~/auth/infrastructure/services/ScryptPasswordService';
import type {PasswordService} from '~~/auth/domain/users/services/PasswordService';

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
