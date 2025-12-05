<template>
  <v-container>
    <v-system-bar window>
      <span class="hidden-sm-and-down">
        {{ resultRangeStart }}-{{ resultRangeEnd }} of over {{ searchStore.total.toLocaleString() }} results for
        <strong>"{{ searchStore.query }}"</strong>
      </span>
      <span class="hidden-md-and-up">
        {{ resultRangeStart }}-{{ resultRangeEnd }} of {{ searchStore.total.toLocaleString() }} results
      </span>
      <v-spacer></v-spacer>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
              v-bind="props"
              density="compact"
              rounded
              variant="text"
              class="text-none"
              size="small"
              style="font-size: 0.75rem;"
          >
            Sort By: {{ sortItems.find(item => item.value === searchStore.sortBy)?.title || '' }}
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item
              v-for="(item, index) in sortItems"
              :key="item.value"
              :value="item.value"
              @click="onSortByChanged(item.value)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-dialog
          v-model="dialog"
          transition="dialog-bottom-transition"
          fullscreen
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
              icon="mdi-tune"
              v-bind="activatorProps"
              variant="text"
              class="hidden-lg-and-up"
          >
          </v-btn>
        </template>
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Filters
              <v-icon>mdi-tune</v-icon>
            </v-toolbar-title>
            <v-toolbar-items>
              <v-btn
                  text="Close"
                  variant="text"
                  @click="dialog = false"
              ></v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <SearchFilters @change="onFiltersChanged"/>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-system-bar>
    <v-row>
      <v-col cols="12">
        <v-sheet class="pa-4" elevation="1">
          <v-row>
            <v-col cols="12" md="12" lg="4" xl="2" class="hidden-md-and-down">
              <SearchFilters @change="onFiltersChanged"/>
            </v-col>
            <v-col cols="12" md="12" lg="8" xl="10">
              <v-row>
                <v-row justify="center" v-if="loading">
                  <v-col
                      v-for="n in skeletonCount"
                      :key="n"
                      cols="auto"
                  >
                    <v-card class="mx-auto my-12 pb-4" width="324">
                      <v-skeleton-loader class="mb-2" type="image" height="200"/>
                      <v-skeleton-loader class="mb-1 mx-auto" type="text"/>
                      <v-skeleton-loader class="mx-auto" type="sentences"/>
                      <v-skeleton-loader class="mx-4" type="actions"/>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row v-else justify="center">
                  <v-col cols="12" v-if="error">
                    <v-alert type="error" variant="tonal" class="mb-4">
                      {{ error }}
                    </v-alert>
                  </v-col>
                  <v-col cols="12" v-else-if="!products.length">
                    <v-alert type="info" variant="tonal" class="mt-4">
                      No results found.
                    </v-alert>
                  </v-col>
                  <v-col
                      v-for="p in products"
                      :key="p.id"
                      cols="auto"
                  >
                    <SliderProductCard :product="p"/>
                  </v-col>
                </v-row>

              </v-row>
              <div class="text-center mt-4">
                <v-pagination
                    v-model="searchStore.page"
                    :length="totalPages"
                    rounded="0"
                />
              </div>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>

    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {useSearchStore} from '../stores/search';
import SearchFilters from '../components/SearchFilters.vue';
import SliderProductCard from '../components/SliderProductCard.vue';
import {useRoute, useRouter} from 'vue-router';

definePageMeta({middleware: ['auth']});

const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();
const dialog = ref(false);

const products = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const totalPages = computed(() => Math.max(1, Math.ceil(searchStore.total / searchStore.limit)));
const skeletonCount = searchStore.limit;

const sortItems: { title: string; value: typeof searchStore.sortBy }[] = [
  {title: 'Newest Arrivals', value: 'newest'},
  {title: 'Price: Low to High', value: 'price_asc'},
  {title: 'Price: High to Low', value: 'price_desc'},
  {title: 'Customer Reviews', value: 'rating'},
];

const resultRangeStart = computed(() => {
  if (products.value.length === 0) return 0;
  return (searchStore.page - 1) * searchStore.limit + 1;
});

const resultRangeEnd = computed(() => {
  if (products.value.length === 0) return 0;
  return Math.min(
      (searchStore.page - 1) * searchStore.limit + products.value.length,
      searchStore.total
  );
});

function syncStoreFromUrl() {
  const params = route.query;

  if (params.query) searchStore.query = String(params.query);
  if (params.categoryId) searchStore.categoryId = String(params.categoryId);
  if (params.brandId) searchStore.brandId = String(params.brandId);
  if (params.minRating) searchStore.minRating = Number(params.minRating);
  if (params.minPrice) searchStore.minPrice = Number(params.minPrice);
  if (params.maxPrice) searchStore.maxPrice = Number(params.maxPrice);
  if (params.hasDiscount) searchStore.hasDiscount = params.hasDiscount === 'true';
  if (params.sortBy) searchStore.sortBy = String(params.sortBy) as any;
  if (params.page) searchStore.page = Number(params.page);
  if (params.limit) searchStore.limit = Number(params.limit);
}

function syncUrlFromStore() {
  const query: Record<string, string> = {};

  if (searchStore.query) query.query = searchStore.query;
  if (searchStore.categoryId) query.categoryId = searchStore.categoryId;
  if (searchStore.brandId) query.brandId = searchStore.brandId;
  if (searchStore.minRating) query.minRating = String(searchStore.minRating);
  if (searchStore.minPrice) query.minPrice = String(searchStore.minPrice);
  if (searchStore.maxPrice) query.maxPrice = String(searchStore.maxPrice);
  if (searchStore.hasDiscount === true) {
    query.hasDiscount = 'true';
  }
  if (searchStore.sortBy) query.sortBy = searchStore.sortBy;
  if (searchStore.page > 1) query.page = String(searchStore.page);
  if (searchStore.limit !== 20) query.limit = String(searchStore.limit);

  router.push({query});
}


async function fetchProducts() {
  loading.value = true;
  error.value = null;
  try {
    const body = {
      query: searchStore.query || undefined,
      categoryId: searchStore.categoryId || undefined,
      brandId: searchStore.brandId || undefined,
      minRating: searchStore.minRating || undefined,
      minPrice: searchStore.minPrice || undefined,
      maxPrice: searchStore.maxPrice || undefined,
      hasDiscount: searchStore.hasDiscount || undefined,
      sortBy: searchStore.sortBy || 'newest',
      page: searchStore.page,
      limit: searchStore.limit
    };

    const res = await $fetch('/api/products/search', {method: 'POST', body});
    products.value = res.results || [];
    searchStore.total = res.total || 0;
    searchStore.page = res.page || searchStore.page;
    searchStore.limit = res.limit || searchStore.limit;
  } catch (e: any) {
    error.value = e?.message || 'Error al cargar productos';
  } finally {
    loading.value = false;
  }
}

// Observar cambios en la página
watch(() => searchStore.page, () => {
  syncUrlFromStore();
  fetchProducts();
});

// Si `SearchFilters` emite cambios de filtros
function onFiltersChanged(newFilters: any) {
  for (const key in newFilters) {
    if (key in searchStore && newFilters[key] !== undefined) {
      (searchStore as any)[key] = newFilters[key];
    }
  }
  syncUrlFromStore();
  fetchProducts();
}

function onSortByChanged(newSortBy: typeof searchStore.sortBy) {
  searchStore.sortBy = newSortBy;
  syncUrlFromStore();
  fetchProducts();
}

onMounted(() => {
  syncStoreFromUrl();
  fetchProducts();
});
</script>

<style scoped>
.xs-select .v-input {
  font-size: 0.7em;
  min-width: 120px;
  display: inline-block;
}
</style>
