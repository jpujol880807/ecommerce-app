<template>
    <NavBar/>
    <NavigationDrawer/>
    <ClientOnly>
      <v-fab
          app
          location="bottom right"
          class="fab"
          size="large"
          color="primary"
          aria-label="Scroll to top"
          icon="mdi-arrow-up"
          @click="gotoTop"
      >
      </v-fab>
    </ClientOnly>
    <v-main>
      <slot></slot>
    </v-main>
    <Footer/>
</template>
<script setup lang="ts">
import NavigationDrawer from '../components/NavigationDrawer.vue';
import NavBar from '../components/NavBar.vue';
import Footer from '../components/Footer.vue';
import { useGoTo } from 'vuetify';

const goTo = useGoTo();

function gotoTop() {
  goTo(0, { duration: 500, easing: 'easeInOutCubic' });
}
</script>

<style scoped>
</style>
