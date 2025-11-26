import container from '~~/common/infrastructure/ioc/container';
import {DatabaseFactory} from '~~/common/infrastructure/db/drizzle/DatabaseFactory';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {ScryptPasswordService} from '~~/auth/infrastructure/services/ScryptPasswordService';
import {PasswordService} from '~~/auth/domain/users/services/PasswordService';
import {defineNitroPlugin, useRuntimeConfig} from '#imports';

export default defineNitroPlugin((nitroApp) => {
    const config = useRuntimeConfig();
    const factory = new DatabaseFactory(
        config.sqliteDBURL as string,
        config.sqliteDBAuthToken as string,
        (config.env as string) ?? process.env.NODE_ENV
    );
    const passwordService = new ScryptPasswordService(config.nuxtSessionPassword);

    container.bind<DatabaseFactory>(TYPES.SqliteDatabaseConnection).toConstantValue(factory);
    container.bind<PasswordService>(TYPES.PasswordService).toConstantValue(passwordService);
    nitroApp.hooks.hook('request', (event) => {
        event.context.$container = container;
    });
});
