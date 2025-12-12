// common/infrastructure/ui/stores/drawer.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDrawerStore = defineStore('drawer', () => {
    const open = ref(false);

    function toggle(value?: boolean) {
        if (typeof value === 'boolean') open.value = value;
        else open.value = !open.value;
    }

    function set(value: boolean) {
        open.value = value;
    }

    return { open, toggle, set };
});
