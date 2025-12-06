<template>
  <v-container>
    <v-row>
      <v-col class="text-center" cols="12">
        <v-skeleton-loader v-if="loadingPath" type="heading"></v-skeleton-loader>
        <v-breadcrumbs v-else :items="breadcrumbs" divider=">">
          <template #item="{ item, index }">
            <v-breadcrumbs-item
                :key="index"
                :href="item.href"
                :disabled="index === breadcrumbs.length - 1"
            >
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
        <v-skeleton-loader v-if="loadingCategory" type="heading"></v-skeleton-loader>
        <h1 v-else-if="category">{{ category.name }}</h1>
      </v-col>
      <v-col cols="12">
        <v-skeleton-loader v-if="loadingCategory" type="image" height="400px"></v-skeleton-loader>
        <v-carousel v-else-if="category && category.images.length" hide-delimiters>
          <v-carousel-item
              v-for="(image, i) in category.images"
              :key="i"
              cover
          >
            <v-img :src="image.urlLarge" height="400px"></v-img>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-slide-group center-active active-class="border-primary" min-width="100%">
          <template v-if="loadingSubcategories">
            <v-slide-group-item
                v-for="n in 4"
                :key="`skeleton-subcategories-${n}`"
                class="ma-4"
            >
              <v-card class="mx-auto my-12 pb-4" width="324">
                <div class="d-flex align-center justify-center ma-4" style="height: 200px;">
                  <v-skeleton-loader class="mb-2 rounded-circle" type="image" height="200"/>
                </div>
                <v-skeleton-loader class="mb-1 mx-auto" type="text"/>
              </v-card>
            </v-slide-group-item>
          </template>
          <template v-else>
            <v-slide-group-item
                class="ma-4"
                v-for="subcategory in subcategories"
                :key="subcategory.id"
            >
              <v-card :href="`/categories/${subcategory.slug}`" class="mx-auto mr-4 my-4 bg-transparent" width="324" :border="false"
                      elevation="0">
                <div class="d-flex align-center justify-center ma-4" style="height: 200px;">
                  <v-avatar
                      size="200px"
                  >
                    <v-img v-if="subcategory.images.length" :src="subcategory.images[0].urlMedium" height="200px"></v-img>
                  </v-avatar>
                </div>
                <v-card-title class="text-center">{{ subcategory.name }}</v-card-title>
              </v-card>
            </v-slide-group-item>
          </template>
        </v-slide-group>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-row justify="center" v-if="loadingProducts">
        <v-col
            v-for="n in skeletonCount"
            :key="`products-skeleton${n}`"
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
      <v-col cols="12" v-if="!products.length">
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
  </v-container>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {Category} from '../../../../domain/categories/entity/Category';
import SliderProductCard from '../../components/SliderProductCard.vue';
import {SearchProductResult} from '../../../../domain/products/entity/SearchProductResult';
import {Product} from '../../../../domain/products/entity/Product';

const route = useRoute();
const slug = route.params.id as string;
const loadingCategory = ref(true);
const loadingPath = ref(true);
const category = ref<Category | null>(null);
const path = ref<Category[]>([]);
const immediateSubcategoriesData = ref(null);
const products = ref([]);
const loadingSubcategories = ref(true);
const loadingProducts = ref(true);
const skeletonCount = ref(20);


const getCategory = async (slug: string) => {
  try {
    const {data: categoryData} = await useFetch(`/api/categories/${slug}`);
    loadingCategory.value = false;
    category.value = categoryData.value?.category || null;
  } catch (e) {
    console.error('Error fetching category:', e);
    loadingCategory.value = false;
    category.value = null;
  }
};

const getPathData = async (slug: string) => {
  try {
    const {data: pathData} = await useFetch(`/api/categories/${slug}/path`);
    path.value = pathData.value?.path || [];
  } catch (e) {
    console.error('Error fetching path data:', e);
    path.value = null;
  } finally {
    loadingPath.value = false;
  }
}

await Promise.all([getCategory(slug as string), getPathData(slug as string)]);

const getSubcategories = async (categoryId: string) => {
  try {
    loadingSubcategories.value = true;
    immediateSubcategoriesData.value = null;
    const {data: subCategoriesData} = await useFetch(`/api/categories/${categoryId}/1-children`);
    immediateSubcategoriesData.value = subCategoriesData.value;
  } catch (e) {
    console.error('Error fetching subcategories:', e);
    immediateSubcategoriesData.value = null;
    loadingSubcategories.value = false;
  } finally {
    loadingSubcategories.value = false;
  }
};

const getProducts = async (categoryId: string) => {
  try {
    loadingProducts.value = true;
    const {data: productData} = await useFetch(`/api/categories/${categoryId}/products`);
    products.value = productData.value?.products.map(p => SearchProductResult.fromProduct(Product.fromJSON(p))) || [];
  } catch (e) {
    console.error('Error fetching products:', e);
    products.value = [];
  }
  finally {
    loadingProducts.value = false;
  }
};

// Obtener subcategorías cuando tengamos el ID de la categoría
watch(
    () => category.value?.id,
    async (categoryId) => {
      if (categoryId) {
        await Promise.all([getProducts(categoryId), getSubcategories(categoryId)]);
      }
    },
    {immediate: true}
);

const breadcrumbs = computed(() => {
  const items = path.value.map(cat => ({
    title: cat.name,
    href: `/categories/${cat.slug}`
  }));
  return items;
});

const subcategories = computed<Category[]>(() => {
  return immediateSubcategoriesData.value?.children || [];
});
</script>

<style scoped>
</style>
