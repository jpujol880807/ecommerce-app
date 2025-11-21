<template>
  <v-app>
    <NavBar/>
    <NavigationDrawer/>
    <v-main>
      <slot></slot>
    </v-main>
    <Footer/>
  </v-app>
</template>
<script setup lang="ts">
import NavigationDrawer from '../components/NavigationDrawer.vue';
</script>
