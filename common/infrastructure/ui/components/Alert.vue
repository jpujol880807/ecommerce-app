<template>
  <v-card
      :max-width="400"
      :prepend-icon="icon"
      :text="text"
      :title="title"
      :class="`alert-${dialogType}`"
  >
    <template v-slot:actions>
      <v-btn
          class="ms-auto"
          text="Ok"
          @click="$emit('dialog-close')"
      ></v-btn>
    </template>
  </v-card>
</template>

<script setup lang="ts">
  import {computed} from 'vue';

  const props = defineProps({
    text: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
    },
    dialogType: {
      type: String as PropType<'success' | 'error' | 'info'>,
      default: 'info',
    }
  });

  const icon = computed(() => {
    switch (props.type) {
      case 'success':
        return 'mdi-check-circle';
      case 'error':
        return 'mdi-alert-circle';
      case 'info':
      default:
        return 'mdi-information';
    }
  });
</script>

<style scoped>
.alert-success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.alert-error {
  background-color: #ffebee;
  color: #c62828;
}

.alert-info {
  background-color: #e3f2fd;
  color: #1565c0;
}
</style>
