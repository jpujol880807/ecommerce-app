import { defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.warnHandler = (msg, vm, trace) => {
        if (msg.includes('Extraneous non-props attributes')) {
            // Ignore this specific warning
            return;
        }
        // Log other warnings
        console.warn(`[Vue warn]: ${msg}${trace}`);
    };
});
