// plugins/vuetify.ts
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        ssr: true, // Essential for Server-Side Rendering in Nuxt
        components,
        directives,
    });
    nuxtApp.vueApp.use(vuetify);
});
