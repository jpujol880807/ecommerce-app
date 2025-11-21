<template>
  <v-card :class="[customClass, 'mx-auto my-12 pb-4']" max-width="374">
    <v-badge
        v-if="hydratedProduct.hasDiscount()"
        color="red"
        :content="`${hydratedProduct.discountPercentage}% OFF`"
        class="badge"
    >
    </v-badge>
    <v-img v-if="hydratedProduct.getPrimaryImage()?.urlMedium" :src="hydratedProduct.getPrimaryImage()?.urlMedium || ''" height="200" class="ma-4"></v-img>
    <div v-else class="d-flex align-center justify-center ma-4" style="height: 200px;">
      <v-icon size="200">mdi mdi-image-off-outline</v-icon>
    </div>
    <v-card-item class="mt-n4">
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
          <span v-if="hydratedProduct.hasDiscount()" class="text-decoration-line-through green--text mr-2">
            {{ formatMoney(hydratedProduct.getListPrice()) }}
          </span>
          <div class="text-gray">
            <span class="text-h6 green--text mr-2">{{ formatMoney(hydratedProduct.getPrice()) }}</span>
          </div>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="green" block :disabled="!hydratedProduct.isAvailable()">
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

const props = defineProps<{
  product: any;
  customClass?: string;
}>();

const hydratedProduct = computed<Product>(() => Product.fromJSON(props.product));

function formatMoney(value: number, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}
</script>

<style scoped>
.product-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
