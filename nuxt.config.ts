// nuxt.config.ts
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'], // Ensures Vuetify is transpiled correctly
  },
  css: [
    'vuetify/styles', // Already imported in the plugin, but good to have here too if needed
    '@mdi/font/css/materialdesignicons.css',
  ],
  modules: [
    // This is the recommended way to use vite-plugin-vuetify with Nuxt 3/4
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
  ],
  // You no longer need to explicitly add the plugin to a 'plugins' array in nuxt.config.ts,
  // as Nuxt 4 automatically registers files in the plugins directory.
});
