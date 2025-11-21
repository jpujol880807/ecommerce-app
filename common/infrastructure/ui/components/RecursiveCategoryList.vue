<template>
  <v-list-group v-if="node.children && node.children.length > 0" :value="node.category.id">
    <template v-slot:activator="{ props }">
      <v-list-item
        v-bind="props"
        :title="node.category.name"
        :rounded="node.children.length ? '' : 'xl'"
        density="compact"
      ></v-list-item>
    </template>

    <!-- Recursive call for children -->
    <RecursiveCategoryList
      v-for="child in node.children"
      :key="child.category.id"
      :node="child"
    />
  </v-list-group>

  <!-- Leaf node (no children) -->
  <v-list-item
    v-else
    :title="node.category.name"
    :value="node.category.id"
    rounded="xl"
    :to="`/category/${node.category.slug}`"
    link
    density="compact"
  ></v-list-item>
</template>

<script setup lang="ts">
import {CategoryTree} from '~~/catalog/domain/categories/entity/Category';

defineProps<{
  node: CategoryTree
}>();
</script>
