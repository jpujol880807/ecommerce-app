```vue
<template>
  <v-card :class="[customClass, 'product-card mx-auto my-12 pb-4 rounded-lg']" width="324" elevation="2">
    <v-badge
        v-if="hydratedProduct.discountPercentage > 0"
        :content="`${hydratedProduct.discountPercentage}% OFF`"
        class="badge"
        color="error"
        value
    />

    <div class="image-wrap">
      <v-img
          :src="hydratedProduct.primaryImageUrl || '/image/no-image-medium.png'"
          height="324"
          class="product-image"
          cover
      >
      </v-img>

      <v-btn icon class="favorite-btn" :aria-label="`favorite-${hydratedProduct.id}`">
        <v-icon color="white">mdi-heart-outline</v-icon>
      </v-btn>
    </div>

    <v-card-item class="mt-n4">
      <v-card-text class="text-end">
        <b class="product-brand">{{ hydratedProduct.brand?.name || 'Unknown Brand' }}</b>
      </v-card-text>

      <v-card-title class="text-center product-title">{{ hydratedProduct.title }}</v-card-title>

      <v-card-text class="ma-4">
        <div class="product-description">
          {{ hydratedProduct.shortDescription || hydratedProduct.description }}
        </div>

        <v-row class="mx-0 mt-4 justify-center align-center rating-row">
          <v-rating :model-value="hydratedProduct.rating || 0" color="amber" density="compact" half-increments readonly size="small"/>
          <span class="caption grey--Text ml-2">(76 reviews)</span>
        </v-row>

        <v-row align="center" class="mx-0 mt-4 justify-center price-row">
          <span v-if="hydratedProduct.discountPercentage > 0" class="original-price mr-2">
            {{ formatMoney(hydratedProduct.listPriceCents) }}
          </span>
          <div class="current-price">
            <span class="price-amount">{{ formatMoney(hydratedProduct.priceCents) }}</span>
          </div>
        </v-row>
      </v-card-text>

      <v-card-actions class="card-actions">
        <v-btn color="primary" block :disabled="hydratedProduct.priceCents <= 0" elevation="6" class="add-btn">
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
  }).format((value || 0) / 100);
}
</script>

<style scoped>
.product-card {
  transition: transform 320ms cubic-bezier(.2,.9,.3,1), box-shadow 320ms;
  will-change: transform;
  overflow: visible;
  border-radius: 12px;

  /* Use theme surface so dark/light follows vuetify theme */
  box-shadow: 0 6px 18px rgba(12,17,43,0.06);
}
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 50px rgba(12,17,43,0.12);
}

/* Image and overlays */
.image-wrap {
  position: relative;
  overflow: hidden;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  background-color: transparent;
}
.product-image {
  transition: transform 420ms cubic-bezier(.2,.9,.3,1);
}
.product-card:hover .product-image {
  transform: scale(1.06);
}

/* Favorite button overlay */
.favorite-btn {
  position: absolute;
  right: 12px;
  top: 12px;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  min-width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: transform 180ms ease, background 180ms;
}
.favorite-btn:hover {
  transform: translateY(-4px);
  background: rgba(0,0,0,0.6);
}

/* Animated badge */
.badge {
  position: absolute;
  top: 18px;
  left: 20px;
  z-index: 10;
  transform: rotate(-6deg);
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(12,17,43,0.12);
  animation: badgePop 720ms cubic-bezier(.2,.9,.3,1);
}
@keyframes badgePop {
  0% { transform: scale(0.9) rotate(-6deg); opacity: 0; }
  60% { transform: scale(1.06) rotate(-4deg); opacity: 1; }
  100% { transform: scale(1) rotate(-6deg); opacity: 1; }
}

/* Text styles - use correct theme variables (kebab-case) */
.product-brand {
  color: var(--v-theme-on-surface, #0F1724);
  font-size: 0.9rem;
}
.product-title {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--v-theme-on-surface, #0F1724);
}

/* Truncated description - fallback color if theme var not available */
.product-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 44px;
  font-size: 0.95rem;
}

/* Ratings & price */
.rating-row { gap: 6px; }

.price-row { align-items: center; }

.original-price {
  text-decoration: line-through;
  font-size: 0.9rem;
}
.current-price .price-amount {
  color: var(--v-theme-primary, #6C63FF);
  font-weight: 800;
  font-size: 1.25rem;
}

/* Actions */
.card-actions { padding: 0 16px 12px 16px; }
.add-btn {
  border-radius: 10px;
  text-transform: none;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(108,99,255,0.12);
  transition: transform 180ms ease, box-shadow 180ms;
}
.add-btn:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(108,99,255,0.16); }

/* Responsive tweaks */
@media (max-width: 600px) {
  .product-card { width: 280px; }
  .product-image { height: 180px; }
  .product-title { font-size: 1rem; }
}
</style>
