import container from '~~/common/infrastructure/ioc/container';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        event.context.$container = container;
    });
});
