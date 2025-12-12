<template>
  <v-container min-width="85%" class="py-8">
    <v-row>
      <v-col cols="12">
        <CategoryBreadcrumbs :slug="categorySlug"/>
      </v-col>
    </v-row>

    <v-row>
      <!-- Image Gallery / Skeleton -->
      <v-col cols="12" md="5" sm="5" xs="12" class="pr-md-10">
        <div v-if="loading" class="main-image-wrapper">
          <v-skeleton-loader type="image" height="500" />
          <div class="thumb-strip" style="margin-top:16px;">
            <v-row dense>
              <v-col cols="3" v-for="n in 4" :key="n">
                <v-skeleton-loader type="image" height="72" />
              </v-col>
            </v-row>
          </div>
        </div>

        <div v-else class="main-image-wrapper">
          <v-carousel
              v-if="carouselImages.length"
              v-model="carouselIndex"
              height="500"
              show-arrows-on-hover
              continuous
              hide-delimiters
          >
            <v-carousel-item v-for="(src, i) in carouselImages" :key="i">
              <v-img :src="src" height="500" class="main-image" cover/>
            </v-carousel-item>
          </v-carousel>
          <div class="floating-actions">
            <v-btn icon class="action-btn" elevation="2">
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
            <v-btn icon class="action-btn" elevation="2">
              <v-icon>mdi-heart-outline</v-icon>
            </v-btn>
          </div>

          <div class="thumb-strip">
            <v-slide-group show-arrows class="thumb-scroll">
              <v-slide-group-item v-for="(entry, i) in imageEntries" :key="entry.originalIndex">
                <div
                    class="thumb-item"
                    :class="{ 'thumb-selected': carouselImages[carouselIndex] === entry.large }"
                    @click="selectThumbnailByPosition(i)"
                    @mouseover="selectThumbnailByPosition(i)"
                >
                  <v-img :src="entry.thumb" height="72" width="72" class="thumbnail" cover/>
                </div>
              </v-slide-group-item>
            </v-slide-group>
          </div>
        </div>
      </v-col>

      <!-- Product Info (skeleton or real) -->
      <v-col cols="12" md="7" sm="7" xs="12">
        <div v-if="error">
          <v-alert type="error">{{ error }}</v-alert>
        </div>

        <!-- SKELETON -->
        <div v-else-if="loading">
          <v-card class="info-card py-xs-0" flat>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-skeleton-loader type="heading" width="30%" class="mb-2" />
                  <v-skeleton-loader type="text" width="80%" class="mb-4" />
                  <div class="d-flex align-center mb-2">
                    <v-skeleton-loader type="text" width="120" height="18" class="mr-2" />
                    <v-skeleton-loader type="text" width="40" height="18" />
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <v-skeleton-loader type="text" width="40%" height="28" class="mb-2" />
                  <v-skeleton-loader type="text" width="30%" height="20" />
                </v-col>

                <!-- Variations skeletons -->
                <v-col cols="12">
                  <v-row dense>
                    <v-col cols="12" v-for="n in 2" :key="'var-'+n">
                      <div class="mb-2">
                        <v-skeleton-loader type="text" width="20%" />
                      </div>
                      <v-skeleton-loader type="text" width="100%" height="40" class="mb-3" />
                    </v-col>
                  </v-row>
                </v-col>

                <!-- Quantity -->
                <v-col cols="12" md="4" class="pr-0">
                  <div class="mb-2"><v-skeleton-loader type="text" width="30%" /></div>
                  <v-skeleton-loader type="text" width="60%" height="40" />
                </v-col>

                <!-- CTA buttons skeleton -->
                <v-col cols="12" class="mt-4">
                  <v-skeleton-loader type="button" width="100%" height="44" class="mb-3" />
                  <v-skeleton-loader type="button" width="100%" height="44" />
                </v-col>

                <!-- Description skeleton -->
                <v-col cols="12" class="mt-6">
                  <v-skeleton-loader type="text" width="40%" class="mb-2" />
                  <v-skeleton-loader type="text" width="100%" />
                  <v-skeleton-loader type="text" width="95%" />
                  <v-skeleton-loader type="text" width="90%" />
                </v-col>

                <!-- Reviews skeleton -->
                <v-col cols="12" class="mt-6">
                  <v-skeleton-loader type="text" width="20%" class="mb-2" />
                  <v-skeleton-loader type="text" width="100%" />
                  <v-skeleton-loader type="text" width="100%" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- REAL PRODUCT -->
        <div v-else-if="product">
          <v-card class="info-card py-xs-0" flat>
            <v-card-text>
              <v-row>

                <!-- Title + brand + SKU -->
                <v-col cols="12">
                  <h3 class="brand" v-if="product.brandName">{{ productBrandName }}</h3>
                  <v-row class="meta-line" align="center" no-gutters>
                    <v-col cols="12">
                      <h1 class="product-title">{{ productTitle }}</h1>
                    </v-col>
                    <v-col cols="12" class="grey--text text--darken-1 d-flex align-center">
                      <v-rating
                          :model-value="productRating"
                          readonly
                          length="5"
                          half-increments
                          size="18"
                          color="amber"
                          background-color="grey lighten-3"
                      />
                      <span class="ml-2">({{ productRating.toFixed(1) }})</span>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- Price block (left) and savings chip (right) -->
                <v-col cols="12" md="6">
                  <div class="current-price">${{ price.toFixed(2) }}
                    <v-chip v-if="hasDiscount" class="savings-chip">
                      Save ${{ (listPrice - price).toFixed(2) }}
                    </v-chip>
                  </div>
                  <div v-if="hasDiscount" class="list-price mt-1">${{ listPrice.toFixed(2) }}</div>
                </v-col>

                <!-- Variations rendered as selects -->
                <v-col cols="12">
                  <v-row dense>
                    <v-col cols="12" v-for="(variation, vi) in product.variations" :key="variation.variationCode">
                      <div class="mb-2"><strong>{{ variation.variationLabel }}:</strong>
                        <span class="ml-2">
                          {{
                            (variationSelections[variation.variationCode]
                                    ? (variation.options.find(o => o.optionCode === variationSelections[variation.variationCode])?.label)
                                    : (variation.options.find(o => o.selected)?.label || variation.options[0]?.label)
                            ) || 'Select'
                          }}
                        </span>
                      </div>

                      <v-select
                          :items="variation.options.map(o => ({ value: o.optionCode, label: o.label, meta: o }))"
                          v-model="variationSelections[variation.variationCode]"
                          item-title="label"
                          item-value="value"
                          dense
                          hide-details
                          outlined
                      />
                    </v-col>
                  </v-row>
                </v-col>

                <!-- Quantity control -->
                <v-col cols="12" md="4" class="pr-0">
                  <div class="mb-2"><strong>Quantity</strong></div>
                  <v-text-field
                      type="number"
                      v-model="quantity"
                      min="1"
                      :max="product.stockCount || 9999"
                      hide-details
                      dense
                      outlined
                  />
                </v-col>

                <!-- CTA buttons full width -->
                <v-col cols="12" class="mt-4">
                  <v-btn
                      large
                      block
                      class="btn-add bg-primary"
                      :disabled="!inStock"
                      @click="onAddToCart"
                  >
                    ADD TO CART
                  </v-btn>

                  <v-btn
                      large
                      block
                      class="btn-buy mt-3 bg-success"
                      :disabled="!inStock"
                      @click="onBuyNow"
                  >
                    Buy with shop Pay
                  </v-btn>

                  <div class="text-center mt-2">
                    <a class="grey--text text--darken-1" href="#">More payment options</a>
                  </div>
                </v-col>

                <!-- Description / details -->
                <v-col cols="12" class="mt-6">
                  <h3 class="recommended-title">{{ productTitle }}</h3>
                  <div class="description-snippet" v-html="product.description || product.shortDescription || 'No description available.'"></div>
                </v-col>

                <!-- Reviews placeholder -->
                <v-col cols="12" class="mt-6">
                  <h3>Reviews</h3>
                  <div class="grey--text">No reviews yet.</div>
                </v-col>

              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {Product} from '~~/catalog/domain/products/entity/Product';
import {definePageMeta} from '#imports';

definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const id = ref('');

const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// carousel index (position in imageEntries)
const carouselIndex = ref(0);

const selectedVariationId = ref<string | null>(null);
const quantity = ref<number>(1);
const variationSelections = ref<Record<string, string>>({});

const productTitle = computed(() => product.value?.title ?? '');
const productBrandName = computed(() => product.value?.brandName ?? '');
const productSku = computed(() => product.value?.sku ?? '');
const categorySlug = computed(() => {
  const productCategories = product.value?.categories || [];
  return productCategories.length ? productCategories[0]!!.slug : '';
});

// Prefer using instance method if present, otherwise try common property names
const mediumFor = (img: any): string | undefined => {
  if (!img) return undefined;
  if (typeof img.getUrl === 'function') {
    return img.getUrl('medium') || img.getUrl('small') || img.getUrl('original') || undefined;
  }
  return img.urlMedium || img.url_medium || img.urlSmall || img.url_small || img.urlOriginal || img.url_original || undefined;
};

const largeFor = (img: any): string | undefined => {
  if (!img) return undefined;
  if (typeof img.getUrl === 'function') {
    return img.getUrl('original') || img.getUrl('large') || img.getUrl('medium') || img.getUrl('small') || undefined;
  }
  return img.urlOriginal || img.url_original || img.urlLarge || img.url_large || img.urlMedium || img.url_medium || img.urlSmall || img.url_small || undefined;
};

const thumbFor = (img: any): string | undefined => {
  if (!img) return undefined;
  if (typeof img.getUrl === 'function') {
    return img.getUrl('small') || img.getUrl('medium') || img.getUrl('original') || undefined;
  }
  return img.urlSmall || img.url_small || img.urlMedium || img.url_medium || img.urlOriginal || img.url_original || undefined;
};

// imageEntries mantiene correspondencia entre imagen original y las URLs usadas en carousel/thumbnail
const imageEntries = computed(() => {
  const imgs = product.value?.images || [];
  return imgs
      .map((img: any, idx: number) => ({
        originalIndex: idx,
        large: largeFor(img),
        thumb: thumbFor(img) || largeFor(img),
      }))
      .filter((e: any) => !!e.large) // quitar entradas sin URL grande
      .map((e: any) => ({originalIndex: e.originalIndex, large: e.large as string, thumb: e.thumb as string}));
});

const carouselImages = computed(() => imageEntries.value.map((e: any) => e.large));
const thumbImages = computed(() => imageEntries.value.map((e: any) => e.thumb));

const fetchProduct = async () => {
  try {
    loading.value = true;
    error.value = null;
    const productData = await $fetch<{ product: any }>(`/api/products/${id.value}`);
    if (!productData) throw new Error(`Failed to fetch product with id: ${id.value}`);
    const data = productData?.product;
    product.value = Product.fromJSON(data);

    // establecer índice por defecto en el carousel (preferir primary image)
    const primary = product.value.getPrimaryImage();
    const primaryLarge = largeFor(primary);
    const entries = imageEntries.value;
    const pos = entries.findIndex((e: any) => e.large === primaryLarge);
    carouselIndex.value = pos >= 0 ? pos : 0;

    // default variation if exists
    variationSelections.value = {};
    if (product.value.variations && product.value.variations.length) {
      for (const v of product.value.variations as any[]) {
        const chosen = (v.options || []).find((o: any) => o.selected) || (v.options || [])[0];
        variationSelections.value[v.variationCode] = chosen ? chosen.optionCode : '';
      }
    }
  } catch (err: any) {
    error.value = err?.message || 'Unknown error';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const routeId = route.params.id;
  if (routeId) {
    id.value = String(routeId);
    fetchProduct();
  }
});

watch(() => route.params.id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    id.value = String(newId);
    await fetchProduct();
  }
}, {immediate: true});

// computed helpers (price logic unchanged)
const price = computed(() => {
  if (!product.value) return 0;
  const variation = (product.value.variations || []).find((v: any) => v.id === selectedVariationId.value) as any;
  const cents = variation?.priceCents ?? product.value.priceCents;
  return (cents || 0) / 100;
});
const listPrice = computed(() => {
  if (!product.value) return 0;
  const variation = (product.value.variations || []).find((v: any) => v.id === selectedVariationId.value) as any;
  const cents = variation?.listPriceCents ?? product.value.listPriceCents;
  return (cents || 0) / 100;
});
const hasDiscount = computed(() => listPrice.value > price.value);
const inStock = computed(() => !!product.value && product.value.isAvailable());

// produce items for v-select with a readable label
const variationItems = computed(() => {
  if (!product.value) return [];
  return (product.value.variations || []).map((v: any) => ({
    id: v.id,
    label: v.sku || v.id || (v.title ?? 'Variation')
  }));
});

const productRating = computed(() => {
  const p: any = product.value || {};
  // soportar varios nombres que la API/entidad pueda usar
  const raw = p.rating ?? p.averageRating ?? p.ratingValue ?? p.reviewsAverage ?? 0;
  const n = Number(raw) || 0;
  // normalizar entre 0 y 5
  return Math.min(Math.max(n, 0), 5);
});

const selectThumbnailByPosition = (pos: number) => {
  if (pos < 0 || pos >= imageEntries.value.length) return;
  carouselIndex.value = pos;
};

const onAddToCart = () => {
  console.info('Add to cart', {
    productId: product.value?.id,
    variationId: selectedVariationId.value,
    quantity: quantity.value,
  });
};

const onBuyNow = () => {
  console.info('Buy now', {productId: product.value?.id});
};
</script>

<style scoped>
:root {
  --accent: #6f4cff;
  --muted: #667085;
  --card-bg: #ffffff;
}

/* Layout */
.product-page {
  background: #f7f8fb;
  min-height: 100vh;
}

/* Left column image card */
.image-card {
  padding: 20px;
  background: transparent;
  border-radius: 12px;
}

.main-image-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(180deg, #f0f3f8 0%, #ffffff 100%);
}

/* arrows */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  color: rgba(0, 0, 0, 0.7);
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.nav-left {
  left: 12px;
}

.nav-right {
  right: 12px;
}

/* floating actions (share/like) */
.floating-actions {
  position: absolute;
  right: 12px;
  top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.95);
  color: rgba(0, 0, 0, 0.6);
}

/* thumbnails */
.thumb-strip {
  margin-top: 16px;
  padding-top: 8px;
}

.thumb-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.thumb-item {
  flex: 0 0 auto;
  border-radius: 8px;
  padding: 4px;
  transition: transform .12s ease, box-shadow .12s ease;
  cursor: pointer;
  background: transparent;
}

.thumb-item:hover {
  transform: translateY(-6px);
}

.thumb-selected {
  box-shadow: 0 6px 18px rgba(12, 17, 43, 0.08);
  border-radius: 10px;
  outline: 3px solid rgba(111, 76, 255, 0.12);
}

/* Right column info card */
.info-column {
  display: flex;
  justify-content: center;
}

.info-card {
  width: 100%;
  padding-right: 28px;
  padding-left: 28px;
  background: var(--card-bg);
  border-radius: 12px;
  position: sticky;
  top: 72px;
}

/* product typography */
.product-title {
  font-size: 26px;
  font-weight: 800;
  margin: 8px 0 12px;

  /* multi-line ellipsis (primary for WebKit) */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  /* overflow handling */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;

  /* ensure consistent height for exactly 2 lines */
  line-height: 1.2em;
  max-height: calc(1.2em * 2);
  word-break: break-word;
}

.meta-line {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 6px;
  color: var(--muted);
}

.price-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 8px 0 16px;
}

.price-block {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.current-price {
  font-size: 24px;
  font-weight: 800;
  color: var(--accent);
}

.list-price {
  color: #8b8b9a;
  text-decoration: line-through;
  font-weight: 600;
}

.savings-chip {
  background: rgba(111, 76, 255, 0.08);
  color: var(--accent);
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 700;
}

/* description */
.description-snippet {
  color: #4b5563;
  margin: 18px 0;
  line-height: 1.45;
}

/* options and CTA */
.options-row {
  margin-top: 8px;
  gap: 8px;
}

.variation-col {
  padding-right: 8px;
}

.qty-col {
  padding-right: 8px;
}

.cta-col {
  gap: 8px;
}

.btn-add {
  text-transform: none;
  font-weight: 700;
}

.btn-buy {
  color: var(--accent);
  border-color: rgba(111, 76, 255, 0.12);
  text-transform: none;
  font-weight: 700;
}

/* extras */
.extras {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.return-box {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
}

.social-share {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
}

/* recommended title */
.recommended-title {
  font-size: 22px;
  font-weight: 800;
  margin: 36px 0 12px;
}
</style>
