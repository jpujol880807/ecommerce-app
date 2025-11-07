// nuxt.config.ts
import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
    build: {
        transpile: ['vuetify'],
    },
    css: [
        'vuetify/styles',
        '@mdi/font/css/materialdesignicons.css',
    ],
    modules: [
        async (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                if (config.plugins) {
                    config.plugins.push(
                        vuetify({
                            autoImport: true
                        })
                    );
                }
            });
        },
        '@pinia/nuxt',
        'nuxt-auth-utils'
    ],
    runtimeConfig: {
        session: {
            password: '',
            name: 'ecommerce_session',
            cookie: {
                maxAge:  60 * 24 * 7
            }
        }
    },
});
