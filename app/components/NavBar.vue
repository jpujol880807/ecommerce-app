<template>
  <v-app-bar flat>
   <template v-slot:prepend>
     <v-app-bar-nav-icon></v-app-bar-nav-icon>
   </template>
    <v-app-bar-title>Testing E-COMMERCE</v-app-bar-title>
    <v-spacer></v-spacer>
    <v-text-field density="compact" variant="solo" label="Search Products" append-inner-icon="mdi-magnify" single-line hide-details flat></v-text-field>
    <v-spacer></v-spacer>
    <v-btn prepend-icon="mdi mdi-download-circle-outline" text>
      <template v-slot:prepend>
        <v-icon color="success"></v-icon>
      </template>
      Download App
    </v-btn>
    <v-btn>Sign In / Login</v-btn>
  </v-app-bar>
</template>
