<template>
  <v-app-bar scroll-behavior="elevate fade-image inverted" extended extension-height="10">
    <template v-slot:prepend>
      <v-app-bar-nav-icon class="mt-4" @click="drawerStore.toggle()"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title class="text-no-wrap mt-4 hidden-sm-and-down" @click="navigateTo('/')" >Testing E-COMMERCE</v-app-bar-title>
    <v-spacer></v-spacer>
    <v-text-field
        density="compact"
        variant="solo"
        label="Search Products"
        append-inner-icon="mdi-magnify"
        single-line
        rounded hide-details min-width="250px"
        class="mt-4"
        @click:append-inner="search"
        v-model="searchQuery"
        @keydown.enter="search"
    ></v-text-field>
    <v-spacer></v-spacer>
    <v-btn class="hidden-sm-and-down" to="/login" v-if="!loggedIn">Sign In / Login</v-btn>
    <v-menu v-else :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn icon class="ml-2 mt-4">
          <v-icon size="large" v-bind="props">mdi-account-circle</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <template v-slot:prepend>
            <v-icon class="mr-n2" size="small">mdi-account-edit</v-icon>
          </template>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <template v-slot:append>
            <v-icon class="mr-4">{{ themeStore.darkMode ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
          </template>
          <v-switch
              class="ma-0 pa-0 mr-2"
              v-model="themeStore.darkMode"
              label="Theme"
              hide-details
          ></v-switch>
        </v-list-item>
        <v-list-item @click="logout">
          <template v-slot:prepend>
            <v-icon class="mr-n2" size="small">mdi-exit-to-app</v-icon>
          </template>
          <v-list-item-title>Log out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { navigateTo } from '#app';
import { useRoute } from 'vue-router';
import { useThemeStore } from '../stores/theme';
import { useDrawerStore } from '../stores/drawer';
import {useUserSession} from '#imports';

const {loggedIn, clear} = useUserSession();
const themeStore = useThemeStore();
const drawerStore = useDrawerStore();
const route = useRoute();
const searchQuery = ref('');

async function logout() {
  await clear();
  await navigateTo('/login');
}

async function search() {
  await navigateTo({
    path: '/search',
    query: { query: searchQuery.value },
  }, { external: true});
}

onMounted(() => {
  if (route.query.query) {
    searchQuery.value = String(route.query.query);
  }
});

watch(() => route.query.query, (newQuery) => {
  if (newQuery) {
    searchQuery.value = String(newQuery);
  } else {
    searchQuery.value = '';
  }
});
</script>

