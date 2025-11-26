import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSearchStore = defineStore('search', () => {
    const query = ref('');
    const categoryId = ref<string | null>(null);
    const minRating = ref<number | null>(null);
    const minPrice = ref<number | null>(null);
    const maxPrice = ref<number | null>(null);
    const hasDiscount = ref<boolean | null>(null);
    const brandId = ref<string | null>(null);
    const sortBy = ref<'price_asc' | 'price_desc' | 'rating' | 'newest' | null>(null);
    const page = ref(1);
    const limit = ref(20);
    const total = ref(0);

    function resetFilters() {
        query.value = '';
        categoryId.value = null;
        minRating.value = null;
        minPrice.value = null;
        maxPrice.value = null;
        hasDiscount.value = null;
        brandId.value = null;
        sortBy.value = null;
        page.value = 1;
        limit.value = 20;
    }
    return {
        query,
        categoryId,
        minRating,
        minPrice,
        maxPrice,
        hasDiscount,
        brandId,
        sortBy,
        page,
        limit,
        total
    }
});
