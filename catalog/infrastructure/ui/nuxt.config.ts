import { defineNuxtConfig } from 'nuxt/config';
export default defineNuxtConfig({
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
        name: 'Catalog',
    }
})
