<template>
  <v-container>
    <v-row>
      <v-col class="text-center" cols="12">
        <v-breadcrumbs :items="breadcrumbs" divider=">">
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
        <v-skeleton-loader v-if="categoryPending" type="heading"></v-skeleton-loader>
        <h1 v-else-if="category">{{ category.name }}</h1>
      </v-col>
      <v-col cols="12">
        <v-skeleton-loader v-if="categoryPending" type="image" height="400px"></v-skeleton-loader>
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
    <v-row v-if="subcategories.length">
      <v-col cols="12">
        <v-slide-group>
          <v-slide-group-item
              class="ma-4"
              v-for="subcategory in subcategories"
              :key="subcategory.id"
          >
            <v-card :href="`/categories/${subcategory.slug}`" class="mx-auto mr-4 my-4" width="324" :border="false"
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
        </v-slide-group>
      </v-col>
    </v-row>
    <v-row justify="center">
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

// Realizar las peticiones iniciales en paralelo sin await de nivel superior
const {data: categoryData, pending: categoryDataPending, error: categoryDataError} = await useFetch(`/api/categories/${slug}`);
const {data: pathData} = await useFetch(`/api/categories/${slug}/path`);

// Ref para las subcategorías
const immediateSubcategoriesData = ref(null);
const products = ref([]);

const category = computed<Category | null>(() => {
  return categoryData.value?.category || null;
});

const categoryPending = computed(() => {
  return categoryDataPending.value;
});

const getSubcategories = async (categoryId: string) => {
  const {data: subCategoriesData} = await useFetch(`/api/categories/${categoryId}/1-children`);
  immediateSubcategoriesData.value = subCategoriesData.value;
};

const getProducts = async (categoryId: string) => {
  const {data: productData} = await useFetch(`/api/categories/${categoryId}/products`);
  products.value = productData.value?.products.map(p => SearchProductResult.fromProduct(Product.fromJSON(p))) || [];
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

const subcategories = computed<Category[]>(() => {
  return immediateSubcategoriesData.value?.children || [];
});

const breadcrumbs = computed(() => {
  if (!pathData.value?.path) return [];
  return pathData.value.path.map((item: any) => ({
    title: item.name,
    href: `/categories/${item.slug}`,
  }));
});
</script>

<style scoped>
</style>
