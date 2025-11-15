import 'dotenv/config';
import config from './environment.config';

export default defineNuxtConfig({
    extends: ['./auth/infrastructure/ui', './catalog/infrastructure/ui', 'common/infrastructure/ui'],
    modules: ['@pinia/nuxt', 'nuxt-auth-utils', 'vuetify-nuxt-module'],
    experimental: {
        decorators: true
    },
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
        ...config
    }
});
