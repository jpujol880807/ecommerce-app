<template>
  <div class="text-center">
    <v-skeleton-loader v-if="loading" type="heading"></v-skeleton-loader>
    <v-breadcrumbs :items="items" divider=">">
      <template #item="{ item, index }">
        <v-breadcrumbs-item
            :key="index"
            :href="item.href"
        >
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{ slug: string }>();

const loading = ref(true);
const pathData = ref<Array<{ name: string; slug: string }>>([]);

const loadPath = async (s: string) => {
  try {
    loading.value = true;
    const data = await $fetch(`/api/categories/${s}/path`);
    pathData.value = data.path || [];
  } catch (e) {
    console.error('Error fetching path:', e);
    pathData.value = [];
  } finally {
    loading.value = false;
  }
};

watch(
    () => props.slug,
    (newSlug) => {
      if (newSlug) loadPath(newSlug);
    },
    { immediate: true }
);

const items = computed(() =>
    pathData.value.map(cat => ({
      title: cat.name,
      href: `/categories/${cat.slug}`
    }))
);
</script>

<style scoped>
/* estilos locales si se necesitan */
</style>

