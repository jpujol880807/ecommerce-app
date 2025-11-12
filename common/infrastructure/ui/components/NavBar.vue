<template>
  <v-app-bar scroll-behavior="elevate fade-image inverted">
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title class="hidden-sm-and-down" @click="navigateTo('/')">Testing E-COMMERCE</v-app-bar-title>
    <v-spacer></v-spacer>
    <v-text-field density="compact" variant="solo" label="Search Products" append-inner-icon="mdi-magnify" single-line
                  hide-details flat min-width="200"></v-text-field>
    <v-spacer></v-spacer>
    <v-icon class="mr-1">{{ themeStore.darkMode ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
    <v-switch
        class="ma-0 pa-0 mr-2"
        v-model="themeStore.darkMode"
        hide-details
    ></v-switch>
    <v-btn class="hidden-sm-and-down" to="/login" v-if="!loggedIn">Sign In / Login</v-btn>
    <v-menu v-else>
      <template v-slot:activator="{ props }">
        <v-btn icon class="ml-2">
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
import { useThemeStore } from '../stores/theme';
const {loggedIn, clear} = useUserSession();

const themeStore = useThemeStore();
async function logout() {
  await clear();
  await navigateTo('/login');
}
</script>
