<template>
  <v-card :class="[customClass, 'mx-auto my-12 pb-4']" max-width="374">
    <v-badge
        color="red"
        content="10% OFF"
        value
        class="badge"
    >
    </v-badge>
    <v-img :src="product.img" height="200" class="ma-4"></v-img>
    <v-card-item class="mt-n4">
      <v-card-title class="text-center">{{ product.title }}</v-card-title>
      <v-card-text class="ma-4 text-center">
        <div class="text-center product-description">
          {{ product.bio }}
        </div>
        <v-row class="mx-0 mt-4 justify-center">
          <v-rating :model-value="4.5" color="amber" density="compact" half-increments readonly size="small">
          </v-rating>
          <span class="caption grey--text">(76 reviews)</span>
        </v-row>
        <v-row align="center" class="mx-0 mt-4 justify-center">
          <span class="text-decoration-line-through green--text mr-2">
            {{formatMoney(parseFloat(product.price.replace(/[^0-9.-]+/g,"")) * 1.1)}}
          </span>
          <div class="text-gray">
            <span class="text-h6 green--text mr-2">{{product.price}}</span>
          </div>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="green" block>
          <v-icon left>mdi-cart</v-icon>
          Add To Cart
        </v-btn>
      </v-card-actions>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  product: {
    img: string;
    title: string;
    price: string;
    bio: string;
  };
  customClass?: string;
}>();

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

