<template>
  <v-toolbar color="transparent">
    <v-toolbar-title style="min-width: 200px;">Featured Products</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon="mdi mdi-chevron-left" @click="this.$refs.slideFeaturedProductGroup.scrollTo('prev')"></v-btn>
    <v-btn icon="mdi mdi-chevron-right" @click="this.$refs.slideFeaturedProductGroup.scrollTo('next')"></v-btn>
  </v-toolbar>
  <v-col cols="12" sm="12" class="mt-n10">
    <v-slide-group
        ref="slideFeaturedProductGroup"
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
            v-for="feature in featured"
            :key="feature.id"
            class="ma-4"
        >
          <SliderProductCard :product="feature" custom-class="mr-4"/>
        </v-slide-group-item>
      </template>
    </v-slide-group>
  </v-col>
</template>

<script setup>
import SliderProductCard from "./SliderProductCard.vue";

const { data, pending, error } = await useFetch('/api/products/featured');

const featured = computed(() => {
  if (!data.value?.data) return [];
  return data.value.data;
});
</script>
