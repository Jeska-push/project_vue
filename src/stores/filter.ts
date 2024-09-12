import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IProduct } from '@/types/product'
export const useFilterStore = defineStore('filter', () => {
  const stuffes = [
    {
      id: 1,
      value: 'лен'
    },
    {
      id: 2,
      value: 'хлопок'
    },
    {
      id: 3,
      value: 'шерсть'
    },
    {
      id: 4,
      value: 'шелк'
    }
  ]

  const collection = [
    {
      id: 1,
      value: 'Зима'
    },
    {
      id: 2,
      value: 'Весна'
    },
    {
      id: 3,
      value: 'Лето'
    },
    {
      id: 4,
      value: 'Осень'
    }
  ]

  const colorAll = ref([
    {
      id: 1,
      bg: 'background-color:#73B6EA'
    },
    {
      id: 2,
      bg: 'background-color:#8BE000'
    },
    {
      id: 3,
      bg: 'background-color:#222'
    }
  ])
  const categoryProducts = ref([
    {
      id: 1,
      value: 'Футболки'
    },
    {
      id: 2,
      value: 'Бюстгалтеры'
    },
    {
      id: 3,
      value: 'Носки'
    }
  ])
  const flagFilter = ref(true)
  const quantityFilters = ref(0)
  const products = ref<IProduct[]>([])
  return { stuffes, collection, colorAll, categoryProducts, flagFilter, quantityFilters, products }
})
