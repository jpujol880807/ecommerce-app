import 'reflect-metadata';
import container from '~~/common/infrastructure/ioc/container';
import {defineNuxtPlugin} from '#imports';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('container', container);
});
