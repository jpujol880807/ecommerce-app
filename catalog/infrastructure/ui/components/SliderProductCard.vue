<template>
  <v-card :class="[customClass, 'mx-auto my-12 pb-4 rounded-lg']" width="324" >
    <v-badge
        v-if="hydratedProduct.discountPercentage > 0"
        color="red"
        :content="`${hydratedProduct.discountPercentage}% OFF`"
        class="badge"
    >
    </v-badge>
    <v-img
        :src="hydratedProduct.primaryImageUrl || '/image/no-image-medium.png'"
        height="200"
        class="ma-4 text-right"
    >
      <v-btn :icon="'mdi-heart-outline'"></v-btn>
    </v-img>
    <v-card-item class="mt-n4">
      <v-card-text class="text-end"><b class="product-description">{{ hydratedProduct.brand?.name ? hydratedProduct.brand.name : 'Unknown Brand'}}</b></v-card-text>
      <v-card-title class="text-center">{{ hydratedProduct.title }}</v-card-title>
      <v-card-text class="ma-4 text-center">
        <div class="text-center product-description">
          {{ hydratedProduct.shortDescription || hydratedProduct.description }}
        </div>
        <v-row class="mx-0 mt-4 justify-center">
          <v-rating :model-value="hydratedProduct.rating || 0" color="amber" density="compact" half-increments readonly size="small">
          </v-rating>
          <span class="caption grey--text">(76 reviews)</span>
        </v-row>
        <v-row align="center" class="mx-0 mt-4 justify-center">
          <span v-if="hydratedProduct.discountPercentage > 0" class="text-decoration-line-through green--text mr-2">
            {{ formatMoney(hydratedProduct.listPriceCents) }}
          </span>
          <div class="text-gray">
            <span class="text-h6 green--text mr-2">{{ formatMoney(hydratedProduct.priceCents) }}</span>
          </div>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="green" block :disabled="hydratedProduct.priceCents <= 0">
          <v-icon left>mdi-cart</v-icon>
          Add To Cart
        </v-btn>
      </v-card-actions>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {Product} from '~~/catalog/domain/products/entity/Product';
import {SearchProductResult} from '~~/catalog/domain/products/entity/SearchProductResult';

const props = defineProps<{
  product: any;
  customClass?: string;
}>();

const hydratedProduct = computed<SearchProductResult>(() => new SearchProductResult(props.product));

function formatMoney(value: number, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value/100);
}
</script>

<style scoped>
.product-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 40px;
}
.badge {
  position: absolute;
  top: 30px;
  left: 40px;
  z-index: 10;
}
.text-decoration-line-through {
  text-decoration: line-through;
}
</style>
