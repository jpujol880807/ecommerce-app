<template>
  <v-toolbar color="transparent">
    <v-toolbar-title style="min-width: 200px;">Popular Products</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon="mdi mdi-chevron-left" @click="scrollTo('prev')"></v-btn>
    <v-btn icon="mdi mdi-chevron-right" @click="scrollTo('next')"></v-btn>
  </v-toolbar>
  <v-col cols="12" sm="12" class="mt-n10">
    <v-slide-group
        ref="slide-populars-product-group"
        center-active
        active-class="border-primary"
        min-width="100%"
        :show-arrows="false"
    >
      <template v-if="pending">
        <v-slide-group-item
            v-for="n in 4"
            :key="`skeleton-${n}`"
            class="ma-4"
        >
          <v-card width="300" class="mr-4">
            <v-skeleton-loader type="image, article, actions"></v-skeleton-loader>
          </v-card>
        </v-slide-group-item>
      </template>
      <template v-else>
        <v-slide-group-item
            v-for="popular in populars"
            :key="popular.id"
            class="ma-4"
        >
          <SliderProductCard :product="popular" custom-class="mr-4"/>
        </v-slide-group-item>
      </template>
    </v-slide-group>
  </v-col>
</template>

<script setup lang="ts">
import { useTemplateRef, computed } from 'vue';
import SliderProductCard from './SliderProductCard.vue';
import {useFetch} from '#imports';

const slideFeaturedProductGroup = useTemplateRef('slide-populars-product-group');

function scrollTo(direction: 'next' | 'prev') {
  if (slideFeaturedProductGroup.value) {
    slideFeaturedProductGroup.value.scrollTo(direction);
  }
}

const { data, pending, error } = await useFetch('/api/products/populars');

const populars = computed(() => {
  if (!data.value?.data) return [];
  return data.value.data;
});
</script>

