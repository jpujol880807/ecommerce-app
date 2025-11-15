import 'reflect-metadata';
import container from '~~/common/infrastructure/ioc/container';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('container', container);
});
