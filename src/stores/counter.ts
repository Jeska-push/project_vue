import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { IProductBig, IProduct, ISize } from '@/types/product'
import { getProduct, getProducts, getColors } from '@/api/product'
import { postBaskets, putBaskets, getBaskets } from '@/api/baskets'

export const useCounterStore = defineStore('counter', () => {
  const productId = ref('')
  const products = ref<IProduct[]>([])
  const colors = ref([])
  const productsAll = ref<IProduct[]>([])
  const filteredComputed = ref<IProduct[]>([])
  const size = ref<ISize[]>([])
  const product = ref<IProductBig[]>([[]])
  const currentProduct = ref<IProductBig[]>([])
  const sizeInput = ref({})
  const idColor = ref('')
  const src = ref('')
  const currentColor = ref('')
  const seasons = ref([])
  const materials = ref([])
  const codeColor = ref('')
  const colorName = ref('')
  const sizeId = ref('')
  const obj = ref({})
  const productsBasket = ref<IProduct[]>([])
  const pictures = ref([
    {
      id: 1,
      src: [
        {
          isDynamic: true,
          url: '/src/assets/img/product-square-1.jpg'
        },
        {
          isDynamic: false,
          url: '/src/assets/img/product-square-1.jpg'
        }
      ]
    },
    {
      id: 5,
      src: [
        {
          isDynamic: true,
          url: '/src/assets/img/product-square-3.jpg'
        },
        {
          isDynamic: false,
          url: '/src/assets/img/product-square-5.jpg'
        }
      ]
    },
    {
      id: 3,
      src: [
        {
          isDynamic: true,
          url: '/src/assets/img/product-square-4.jpg'
        },
        {
          isDynamic: false,
          url: '/src/assets/img/product-square-6.jpg'
        }
      ]
    }
  ])

  watch(
    () => productsBasket.value,
    () => {
      if (productsBasket.value) {
        localStorage.setItem('basket', JSON.stringify(productsBasket.value))
      }
    },
    { deep: true }
  )

  async function loadProduct(id: any) {
    const response = await getProduct(id)
    product.value = response.product
    size.value = product.value.sizes
    seasons.value = response.product.seasons
    materials.value = response.product.materials
    sizeInput.value = size.value[0].title
    return {
      size,
      colors,
      seasons,
      product
    }
  }
  const loadProducts = async () => {
    const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/products`)
    const response = await fetchResponse.json()
    productsAll.value = response.items

    productsAll.value.forEach((item) => {
      item.colors.forEach((el) => {
        el.color.active = false
      })
      item.colors[0].color.active = true
    })
    const res = response.items
    productsAll.value = res
    return res
  }

  const inBasket = (quantity: number, sizeInput: string, object: object) => {
    const item = productsAll.value.filter((el: IProduct) => el.id == productId.value)
    size.value.forEach((el: any) => {
      if (el.title === sizeInput) {
        sizeId.value = el.id
      }
    })
    productsAll.value.forEach((item) => {

      if (item.id === Number(productId.value)) {
        item.colors.forEach((i) => {
          if (i.color.active === true) {
            colorName.value = i.color.title
            src.value = `/src/assets/img_2x/product-${productId.value}-${colorName.value}@2x.jpg`
          }
        })
      }
    })

    item[0].colors.forEach((elem) => {
      codeColor.value = elem.color.title

      if (colorName.value === elem.color.title) {
        if (elem.color.title == 'Red') {
          elem.color.slug = 'Красный'
        }

        if (elem.color.title == 'Blue') {
          console.log('1111')

          elem.color.slug = 'Синий'
        }
        if (elem.color.title == 'Green') {
          elem.color.slug = 'Зеленый'
        }
        if (elem.color.title == 'Yellow') {
          elem.color.slug = 'Желтый'
        }
        if (elem.color.title == 'Purple') {
          elem.color.slug = 'Фиолетовый'
        }
        if (elem.color.title == 'Pink') {
          elem.color.slug = 'Розовый'
        }
        if (elem.color.title == 'black') {
          elem.color.slug = 'Черный'
        }
        if (elem.color.title == 'white') {
          elem.color.slug = 'Белый'
        }

        obj.value = {
          productId: item[0].id,
          colorId: elem.color.id,
          quantity: quantity,
          sizeId: sizeId.value
        }

        /////////// Сохранение  товара  в корзину //////////
        const postBask = async () => {
          console.log(object)
          if (object !== 0) {
            await putBaskets(object)
          } else {
            await postBaskets(obj.value)
            productsBasket.value = await getBaskets()
          }
        }
        postBask()
      }
    })
  }
  return {
    productId,
    product,
    products,
    productsAll,
    size,
    sizeInput,
    colors,
    currentColor,
    currentProduct,
    colorName,
    idColor,
    src,
    filteredComputed,
    loadProduct,
    loadProducts,
    inBasket,
    pictures,
    seasons,
    materials
  }
})
