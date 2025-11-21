<template>
  <v-toolbar color="transparent">
    <v-toolbar-title style="min-width: 200px;">Popular Products</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon="mdi mdi-chevron-left" @click="this.$refs.slidePopularProductGroup.scrollTo('prev')"></v-btn>
    <v-btn icon="mdi mdi-chevron-right" @click="this.$refs.slidePopularProductGroup.scrollTo('next')"></v-btn>
  </v-toolbar>
  <v-col cols="12" sm="12" class="mt-n10">
    <v-slide-group
        ref="slidePopularProductGroup"
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

<script setup>
import SliderProductCard from "./SliderProductCard.vue";
import { Product } from '~~/catalog/domain/products/entity/Product';

const { data, pending, error } = await useFetch('/api/products/populars', {
  params: { limit: 10 }
});

const populars = computed(() => {
  if (!data.value?.data) return [];
  return data.value.data.map(item => Object.assign(new Product(
      item.id,
      item.title,
      item.slug,
      item.sku,
      item.brandId,
      item.shortDescription,
      item.description,
      item.priceCents,
      item.listPriceCents,
      item.shippingCents,
      item.discountPercentage,
      item.stockCount,
      item.isInStock,
      item.status,
      item.isCollection,
      item.isDigital,
      item.weightKg,
      item.dimensions,
      item.isbn,
      item.ean,
      item.parentAsin,
      item.productUrl,
      item.vendorUrl,
      item.reviewsUrl,
      item.fulfilledBy,
      item.soldBy,
      item.merchantReturns,
      item.rating,
      item.metadata,
      new Date(item.createdAt),
      new Date(item.updatedAt)
  ), { images: item.images || [], variations: item.variations || [], categories: item.categories || [] }));
});
</script>

