// nuxt.config.ts
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify';

export default defineNuxtConfig({
    build: {
        transpile: ['vuetify'],
    },
    css: [
        'vuetify/styles',
        "@mdi/font/css/materialdesignicons.min.css",
    ],
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({ autoImport: true }))
            })
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
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
        ssr: {
            noExternal: ['vuetify']
        }
    },
});
