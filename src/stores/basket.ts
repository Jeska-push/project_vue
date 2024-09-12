import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { IObj } from '@/types/product'


export const useBasketStore = defineStore('basket', () => {
  const currentProduct = ref({})
  const codeColor = ref('')
  const arr = ref([])
  const array = ref([])
  const flag = true
  const key = ref(false)
  const summa = ref(0)
  const objectData = ref({})
  const obj = ref({})
  const deliveryTypeId = ref(0)
  const payType = ref('')
  const orderId = ref(0)
  const result = ref(false)
  const summaInLocalStorage = localStorage.getItem('summa')

  if (summaInLocalStorage) {
    summa.value = JSON.parse(summaInLocalStorage)
  }
  const arrInLocalStorage = localStorage.getItem('arr')

  if (arrInLocalStorage) {
    arr.value = JSON.parse(arrInLocalStorage)
  }

  function calcSumma() {
    summa.value = 0
    arr.value.forEach((el: IObj) => {
      const sum = Number(el.quantity) * Number(el.price)
      summa.value = Number(summa.value) + Number(sum)
    })

    return summa.value
  }

  watch(
    () => summa.value,
    () => {
      localStorage.setItem('summa', JSON.stringify(summa.value))
    },
    { deep: true }
  )
  watch(
    () => arr.value,
    () => {
      localStorage.setItem('arr', JSON.stringify(arr.value))
    },
    { deep: true }
  )

  return {
    currentProduct,
    codeColor,
    arr,
    array,
    key,
    summa,
    objectData,
    obj,
    deliveryTypeId,
    calcSumma,
    flag,
    orderId,
    result,
    payType
  }
})
