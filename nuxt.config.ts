// nuxt.config.ts
export default defineNuxtConfig({
    modules: ['@pinia/nuxt', 'nuxt-auth-utils', 'vuetify-nuxt-module'],
    runtimeConfig: {
        session: {
            password: '',
            name: 'ecommerce_session',
            cookie: {
                maxAge:  60 * 24 * 7
            }
        }
    }
});
