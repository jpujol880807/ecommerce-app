<template>
  <v-navigation-drawer v-model="drawerStore.open" permanent width="320">
    <v-list>
      <v-list-item title="Categories" subtitle="Browse Catalog"></v-list-item>
      <v-divider></v-divider>

      <v-list v-if="loading" slim>
        <v-skeleton-loader type="list-item@3"></v-skeleton-loader>
      </v-list>

      <v-list v-else density="compact" nav>
        <!-- Iterate over root category trees -->
        <RecursiveCategoryList
            v-for="tree in categoryTrees"
            :key="tree.category.id"
            :node="tree"
        />
      </v-list>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RecursiveCategoryList from './RecursiveCategoryList.vue';
import {Category, type CategoryTree} from '~~/catalog/domain/categories/entity/Category';
import {useDrawerStore} from '../stores/drawer';
const drawerStore = useDrawerStore();

const loading = ref(false);
const categoryTrees = ref<CategoryTree[]>([]);

// 1. Fetch Root Categories
// 2. For each root, fetch its full SubTree
const fetchCategories = async () => {
  loading.value = true;
  try {
    // First, get the top-level roots
    const { categories: roots } = await $fetch<{ categories: Category[] }>('/api/categories');

    // Then, fetch the full tree for each root to populate the drawer
    const treePromises = roots.map(root =>
        $fetch<{ tree: CategoryTree }>(`/api/categories/${root.id}/tree`)
    );

    const results = await Promise.all(treePromises);
    categoryTrees.value = results.map(r => r.tree);

  } catch (error) {
    console.error('Failed to load category tree', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
