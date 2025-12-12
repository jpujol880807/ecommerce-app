import { defineNuxtConfig } from 'nuxt/config';
export default defineNuxtConfig({
    pages: true,
    components: true,
    typescript: {
        includeWorkspace: true,
        sharedTsConfig: {
            compilerOptions: {
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                esModuleInterop: true
            }
        }
    },
    $meta: {
        name: 'Auth',
    }
});
