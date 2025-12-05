<template>
  <v-sheet class="pa-4" rounded="lg">
    <!-- Deals & Discounts -->
    <section class="mb-6">
      <h3 class="text-subtitle-1 font-weight-bold mb-2">Deals & Discounts</h3>
      <v-checkbox
          v-model="filters.deals"
          label="All Discounts"
          hide-details
          density="compact"
          color="primary"
          class="my-n1"
      />
    </section>

    <v-divider class="mb-4" />

    <!-- Free Shipping -->
    <section class="mb-6">
      <h3 class="text-subtitle-1 font-weight-bold mb-2">Delivery</h3>
      <v-checkbox
          v-model="filters.freeShipping"
          label="Free Shipping"
          hide-details
          density="compact"
          color="primary"
          class="my-2"
      />
    </section>

    <v-divider class="mb-4" />

    <!-- Customer Reviews -->
    <section class="mb-6">
      <h3 class="text-subtitle-1 font-weight-bold mb-2">Customer Reviews</h3>
      <div
          v-for="rating in [4, 3, 2, 1]"
          :key="rating"
          class="d-flex align-center cursor-pointer rating-row mb-1"
          @click="search.minRating = rating"
      >
        <v-rating
            :model-value="rating"
            color="orange-darken-1"
            density="compact"
            half-increments
            readonly
            size="small"
        />
        <span class="text-body-2 ml-2 text-medium-emphasis">& Up</span>
      </div>
    </section>

    <v-divider class="mb-4" />

    <!-- Price -->
    <section class="mb-6">
      <h3 class="text-subtitle-1 font-weight-bold mb-2">Price</h3>
      <div class="d-flex align-center gap-2 mb-2">
        <v-text-field
            v-model.number="tempMinPrice"
            prefix="$"
            placeholder="Min"
            density="compact"
            variant="outlined"
            hide-details
            class="price-input"
        />
        <span class="mx-2 text-medium-emphasis">-</span>
        <v-text-field
            v-model.number="tempMaxPrice"
            prefix="$"
            placeholder="Max"
            density="compact"
            variant="outlined"
            hide-details
            class="price-input"
        />
        <v-btn
            variant="outlined"
            size="small"
            class="ml-2"
            icon="mdi-chevron-right"
            @click="applyPriceFilter"
        />
      </div>
    </section>

    <v-divider class="mb-4" />

    <!-- Brands (single-select) -->
    <section class="mb-6">
      <h3 class="text-subtitle-1 font-weight-bold mb-2">Brands</h3>

      <v-text-field
          v-model="brandQuery"
          placeholder="Search brands..."
          density="compact"
          variant="outlined"
          hide-details
          clearable
          append-inner-icon="mdi-magnify"
          :loading="brandLoading"
          class="mb-2"
      />

      <div class="d-flex align-center mb-2" v-if="search.brandId">
        <v-chip size="x-small" class="mr-2" color="primary" variant="tonal">
          Selected
        </v-chip>
        <v-btn size="x-small" variant="text" @click="search.brandId = null">Clear</v-btn>
      </div>

      <v-alert v-if="brandError" type="error" dense class="mb-2">
        {{ brandError }}
      </v-alert>

      <div v-if="!availableBrands.length && !brandLoading" class="text-body-2 text-medium-emphasis mb-2">
        No brands found.
      </div>

      <v-radio-group v-model="search.brandId">
        <v-radio
            v-for="brand in availableBrands"
            :key="brand.id"
            :label="brand.name"
            :value="brand.id"
            color="primary"
            class="my-n1"
        />
      </v-radio-group>
    </section>

    <v-divider class="mb-4" />

    <!-- Colors -->
    <section class="mb-6">
      <h3 class="text-subtitle-1 font-weight-bold mb-3">Color</h3>
      <div class="d-flex flex-wrap gap-2">
        <div
            v-for="color in availableColors"
            :key="color.name"
            class="color-swatch cursor-pointer"
            :class="{ 'active': filters.selectedColor === color.name }"
            :style="{ backgroundColor: color.hex }"
            @click="filters.selectedColor = filters.selectedColor === color.name ? null : color.name"
            :title="color.name"
        >
          <v-icon
              v-if="filters.selectedColor === color.name"
              icon="mdi-check"
              size="x-small"
              :color="isLightColor(color.hex) ? 'black' : 'white'"
          />
        </div>
      </div>
    </section>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, reactive, watch, watchEffect, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore } from '../stores/search'

const emit = defineEmits<{
  (e: 'change', payload: Record<string, any>): void
}>()

// --- Store ---
const search = useSearchStore()

// --- Route ---
const route = useRoute()

// --- Local UI state ---
const filters = reactive({
  deals: false,
  freeShipping: false,
  selectedFeatures: [] as string[],
  selectedColor: null as string | null,
})

// Brands search state
const brandQuery = ref('')
const availableBrands = ref<{ id: string; name: string }[]>([])
const brandLoading = ref(false)
const brandError = ref<string | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const availableColors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Blue', hex: '#2196F3' },
  { name: 'Red', hex: '#F44336' },
  { name: 'Green', hex: '#4CAF50' },
  { name: 'Silver', hex: '#C0C0C0' },
]

// --- Helpers ---
const parseBool = (v: any) => v === true || v === 'true' || v === '1' || v === 1
const toNumberOrNull = (v: any) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const normalizePayload = () => ({
  minPrice: search.minPrice ?? undefined,
  maxPrice: search.maxPrice ?? undefined,
  minRating: search.minRating ?? undefined,
  hasDiscount: search.hasDiscount ?? undefined,
  freeShipping: filters.freeShipping || undefined,
  brandId: search.brandId ?? undefined,
  selectedBrands: search.brandId ? [search.brandId] : undefined,
  selectedColor: filters.selectedColor ?? undefined,
  selectedFeatures: filters.selectedFeatures.length ? filters.selectedFeatures : undefined,
})

const emitChange = () => emit('change', normalizePayload())

// --- UI actions ---
// En lugar de bindear directamente a search.minPrice y search.maxPrice
const tempMinPrice = ref<number | null>(null)
const tempMaxPrice = ref<number | null>(null)

// Modificar la función applyPriceFilter para actualizar el store
const applyPriceFilter = () => {
  search.minPrice = tempMinPrice.value
  search.maxPrice = tempMaxPrice.value
  emitChange()
}

const isLightColor = (hex: string) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 186
}

// --- Brands fetch ---
async function fetchBrands(query = '') {
  brandLoading.value = true
  brandError.value = null
  try {
    const res: any = await $fetch('/api/brands/search', {
      method: 'POST',
      body: { query }
    })
    availableBrands.value = Array.isArray(res) ? res : (res.brands ?? [])
  } catch (err: any) {
    brandError.value = err?.message || 'Error fetching brands'
    availableBrands.value = []
  } finally {
    brandLoading.value = false
  }
}

async function ensureSelectedBrandPresent() {
  if (!search.brandId) return
  const exists = availableBrands.value.find(b => b.id === search.brandId)
  if (exists) return
  // intentar obtener la marca por id; endpoint puede variar según API
  try {
    const single: any = await $fetch(`/api/brands/${search.brandId}`)
    if (single && single.id) {
      // evitar duplicados
      if (!availableBrands.value.find(b => b.id === single.id)) {
        availableBrands.value.unshift({ id: single.id, name: single.name ?? single.title ?? 'Selected' })
      }
    }
  } catch {
    // si falla, insertar placeholder para que el radio muestre una selección conocida
    availableBrands.value.unshift({ id: search.brandId, name: 'Selected brand' })
  }
}

const isSyncing = ref(false);
// --- Sync from URL query into store/local state ---
async function syncFromQuery(q: Record<string, any>) {
  isSyncing.value = true
  // mapear query -> store / local
  if (q.minPrice !== undefined) {
    const price = toNumberOrNull(q.minPrice)
    search.minPrice = price
    tempMinPrice.value = price
  }
  if (q.maxPrice !== undefined) {
    const price = toNumberOrNull(q.maxPrice)
    search.maxPrice = price
    tempMaxPrice.value = price
  }
  if (q.minRating !== undefined) search.minRating = toNumberOrNull(q.minRating)
  if (q.brandId !== undefined) search.brandId = String(q.brandId) || null
  if (q.hasDiscount !== undefined) {
    const b = parseBool(q.hasDiscount)
    search.hasDiscount = b ? true : null
    filters.deals = b
  }
  if (q.freeShipping !== undefined) filters.freeShipping = parseBool(q.freeShipping)
  if (q.color !== undefined) filters.selectedColor = String(q.color) || null
  if (q.features !== undefined) {
    if (Array.isArray(q.features)) filters.selectedFeatures = q.features.map(String)
    else filters.selectedFeatures = String(q.features).split(',').map(s => s.trim()).filter(Boolean)
  }

  // cargar marcas y asegurar la seleccion visible
  await fetchBrands('')
  await ensureSelectedBrandPresent()

  isSyncing.value = false;
  emitChange()
}

// Debounced watcher for brandQuery
watch(brandQuery, (q) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fetchBrands(q.trim())
  }, 300)
})

// Sync deals/todaysDeals into store.hasDiscount
watch(() => filters.deals, () => {
  const val = filters.deals;
  search.hasDiscount = val ? true : null
})

// Emit cuando filtros (store o locales) cambian
watchEffect(() => {
  if (isSyncing.value) return;
  void search.brandId
  void search.minPrice
  void search.maxPrice
  void search.minRating
  void search.hasDiscount
  void filters.deals
  void filters.freeShipping
  void filters.selectedColor
  void filters.selectedFeatures
  emitChange()
})

// React a cambios en la query de la ruta (p.ej. navegación con parámetros)
watch(() => route.query, (newQ) => {
  // convertir a objeto plano
  syncFromQuery(Object.fromEntries(Object.entries(newQ)))
}, { deep: true })

// Emit initial filtros y cargar marcas al montar
onMounted(() => {
  syncFromQuery(Object.fromEntries(Object.entries(route.query)))
})
</script>

<style scoped>
.cursor-pointer { cursor: pointer; }
.rating-row:hover :deep(.v-rating__item) { opacity: 0.7; }
.price-input { max-width: 80px; }
.gap-2 { gap: 8px; }
.color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, border-color 0.2s;
}
.color-swatch:hover { transform: scale(1.1); }
.color-swatch.active {
  border: 2px solid #2196F3;
  transform: scale(1.1);
}
</style>
