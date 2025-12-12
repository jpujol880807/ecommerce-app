import {md3} from 'vuetify/blueprints'

export default defineNuxtConfig({
    extends: ['common/infrastructure/ui', './auth/infrastructure/ui', './catalog/infrastructure/ui'],
    modules: ['@pinia/nuxt', 'nuxt-auth-utils', 'vuetify-nuxt-module','pinia-plugin-persistedstate/nuxt'],
    srcDir: 'common/infrastructure/ui/',
    components: [
        'common/infrastructure/ui/app/components',
        'auth/infrastructure/ui/app/components',
        'catalog/infrastructure/ui/app/components'
    ],
    serverDir: 'common/infrastructure/ui/server/',
    vite: {
        esbuild: {
            tsconfigRaw: {
                compilerOptions: {
                    experimentalDecorators: true,
                    //@ts-ignore
                    emitDecoratorMetadata: true,
                }
            }
        }
    },
    nitro: {
        esbuild: {
            options: {
                tsconfigRaw: {
                    compilerOptions: {
                        experimentalDecorators: true,
                        //@ts-ignore
                        emitDecoratorMetadata: true,
                    }
                }
            }
        }
    },
    typescript: {
        tsConfig: { compilerOptions: { baseUrl: ".", }, },
        sharedTsConfig: {
            compilerOptions: {
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                esModuleInterop: true
            }
        }
    },
    runtimeConfig: {
        session: {
            password: '',
            name: 'ecommerce_session',
            cookie: {
                maxAge:  60 * 24 * 7
            }
        },
        env: process.env.NODE_ENV!! || 'development' as string,
        sqliteDBURL: process.env.TURSO_DATABASE_URL!! as string || 'file:database/sqlite/database.sqlite',
        sqliteDBAuthToken: process.env.TURSO_AUTH_TOKEN!! as string || '',
        nuxtSessionPassword: process.env.NUXT_SESSION_PASSWORD!! as string || '',
        algoliaAppId: process.env.ALGOLIA_APP_ID!! as string || '',
        algoliaWriteApiKey: process.env.ALGOLIA_WRITE_API_KEY!! as string || '',
        algoliaSearchApiKey: process.env.ALGOLIA_SEARCH_API_KEY!! as string || '',
    },
    vuetifyOptions: {
        blueprint: md3
    },
    vuetify: {
        vuetifyOptions: './vuetify.config.ts'
    }
});
