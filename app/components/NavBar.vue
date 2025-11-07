<template>
  <v-app-bar scroll-behavior="elevate fade-image inverted">
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title class="hidden-sm-and-down">Testing E-COMMERCE</v-app-bar-title>
    <v-spacer></v-spacer>
    <v-text-field density="compact" variant="solo" label="Search Products" append-inner-icon="mdi-magnify" single-line
                  hide-details flat min-width="220"></v-text-field>
    <v-spacer></v-spacer>
    <v-icon class="mr-1">{{ themeStore.darkMode ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
    <v-switch
        class="ma-0 pa-0 mr-2"
        v-model="themeStore.darkMode"
        hide-details
    ></v-switch>
    <v-btn class="hidden-sm-and-down">Sign In / Login</v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();
</script>
