<template>
  <v-row style="background-color: #080A21;">
    <v-col cols="12" sm="4" lg="3">
      <v-card class="mx-auto my-12 pb-4" max-width="374" flat color="#080A21">
        <v-card-item class="top-day">
          <v-card-title class="text-center" style="min-width: 170px;">Deals of the day</v-card-title>
        </v-card-item>
        <v-card-text>
          <div class="text-center">
            <h1>08:32:29</h1>
          </div>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn icon="mdi mdi-chevron-left" @click="scrollTo('prev')"></v-btn>
          <v-btn icon="mdi mdi-chevron-right" @click="scrollTo('next')"></v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" sm="8" lg="9" class="mt-n10">
      <v-slide-group
          ref="slide-deals-product-group"
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
              v-for="deal in deals"
              :key="deal.id"
              class="ma-4"
          >
            <SliderProductCard :product="deal" custom-class="mr-4"/>
          </v-slide-group-item>
        </template>
      </v-slide-group>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useTemplateRef, computed } from 'vue';
import SliderProductCard from './SliderProductCard.vue';
import {useFetch} from '#imports';

const slideFeaturedProductGroup = useTemplateRef('slide-deals-product-group');

function scrollTo(direction: 'next' | 'prev') {
  if (slideFeaturedProductGroup.value) {
    slideFeaturedProductGroup.value.scrollTo(direction);
  }
}

const { data, pending, error } = await useFetch('/api/products/deals');

const deals = computed(() => {
  if (!data.value?.data) return [];
  return data.value.data;
});
</script>
