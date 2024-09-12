<template>
  <div class="product__item product" v-if="product" :id="product.id">
    <div class="product__pic">
      <img :src="product.color.gallery[0].file.url" width="120" height="120" alt="Название товара">
    </div>
    <h3 class="product__title product__unit">
      {{ product.product.title }}
    </h3>
    <p class="product__info product__info--color product__unit">
      Цвет:
      <span>
        <i v-if="product.color.color.id !== 27" :style="`background-color: ${product.color.color.code}`"></i>
      </span>
      <span>
        <i v-if="product.color.color.id === 27" class="bor"
          :style="`background-color: ${product.color.color.code}`"></i>
      </span>
      <span class="color-ru">{{ res }}</span>
    </p>
    <span class="product__code">
      Артикул: {{ product.id }}
    </span>
    <div class="product__counter form__counter">
      <button type="button" @click="minus($event)" aria-label="Убрать один товар">
        -
      </button>

      <input type="text" :value="product.quantity" name="count">
      <button type="button" @click="plus($event)" aria-label="Добавить один товар">
        +
      </button>
    </div>
    <b class="product__price">
      {{ product.price * product.quantity }}
    </b>
    <button class="product__del button-del" @click="ProductDelete($event, product)" type="button"
      aria-label="Удалить товар из корзины">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="20px" height="20px" :data-id="product.id">
        <path :data-id="product.id"
          d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" />
      </svg>
    </button>
  </div>
</template>


<script setup lang="ts">
import { useBasketStore } from "@/stores/basket"
import { useCounterStore } from "@/stores/counter"
import { ref, toRefs, watch } from 'vue'
import type { IProduct, IObj, IProductBig } from "@/types/product"
import { getBaskets, deleteBaskets } from '@/api/baskets'

const counter = useCounterStore();
const basket = useBasketStore();
const summa = ref(0)
const products = ref<IProduct[]>([]);
const currentProductId = ref(0)
const currentProduct = ref<IProductBig[]>([]);
const quantity = ref('')
const sizeInput = ref('')
const object = ref({})
const res = ref('')
const productsBasket = ref<IProduct[]>([])

const props = defineProps<{
  product: any,
  productsBasket: IProduct
}>()

const { product } = toRefs(props)
productsBasket.value = props.productsBasket

watch(() => currentProduct.value, () => {
  localStorage.setItem('currentProduct', JSON.stringify(currentProduct.value))
}, { deep: true })


watch(() => productsBasket.value, () => {
  if (productsBasket.value) {
    localStorage.setItem('basket', JSON.stringify(productsBasket.value));
  }
}, { deep: true })

const getloadProducts = async () => {
  const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/products`)
  const response = await fetchResponse.json()
  products.value = response.items
  products.value.forEach((item: any) => {
    item.colors.forEach((el: any) => {
      el.color.active = false
    })
    item.colors[0].color.active = true
  })
  const res = response.items
  products.value = res
  return res
}
getloadProducts()

sizeInput.value = counter.sizeInput;
////////////////  Кнопки + и -    ////////////////////
const plus = async (event: any) => {
  summa.value = 0
  productsBasket.value.forEach((el: any) => {
    if (el.id == event.target.parentNode.parentNode.id) {
      el.quantity = el.quantity + 1
      quantity.value = el.quantity
    }
  })
  const sum = Number(quantity.value) * Number(product.value.price)
  summa.value = summa.value + sum
  basket.summa = summa.value
  basket.arr = productsBasket.value

  object.value = {
    basketItemId: event.target.parentNode.parentNode.id,
    quantity: quantity.value
  }
  counter.inBasket(quantity.value, sizeInput.value, object.value)
  basket.calcSumma()
  summa.value = basket.summa
}
const minus = async (event) => {
  summa.value = 0
  productsBasket.value.forEach((el: any) => {
    if (el.id == event.target.parentNode.parentNode.id) {
      if (el.quantity > 0) {
        el.quantity = el.quantity - 1
        quantity.value = el.quantity
      } else {
        quantity.value = el.quantity
        el.quantity = 0
      }
    }
  })
  //basket.arr = products.value
  const sum = Number(product.value.quantity) * Number(product.value.price)
  summa.value = summa.value + sum
  basket.summa = summa.value

  object.value = {
    basketItemId: event.target.parentNode.parentNode.id,
    quantity: quantity.value
  }
  basket.calcSumma()
  summa.value = basket.summa
  counter.inBasket(quantity.value, sizeInput.value, object.value)
}


currentProduct.value = counter.currentProduct
const currentProductInLocalStorage = localStorage.getItem('currentProduct');
if (currentProductInLocalStorage) {
  currentProduct.value = JSON.parse(currentProductInLocalStorage);
}

////////  Удаление товара из корзины  /////////////
const ProductDelete = async (event: any) => {
  currentProductId.value = event.target.dataset.id;
  await deleteBaskets(currentProductId.value)
  event.target.parentNode.parentNode.parentNode.remove();
  productsBasket.value = await getBaskets();
  basket.arr = productsBasket.value
  basket.calcSumma()
  summa.value = basket.summa;
}
///////////      Запрос списка товаров из корзины  для удаления товара////////
const result = ref('')
const colorToRu = async () => {
  result.value = product.color;
  if (product.value.color.color.title === "Blue") {
    res.value = "Синий"
  }

  if (product.value.color.color.title === "Red") {
    res.value = "Красный"
  }
  if (product.value.color.color.title === "Green") {
    res.value = "Зеленый"
  }
  if (product.value.color.color.title === "Yellow") {
    res.value = "Желтый"
  }
  if (product.value.color.color.title === "Purple") {
    res.value = "Фиолетовый"
  }
  if (product.value.color.color.title === "Pink") {
    res.value = "Розовый"
  }
  if (product.value.color.color.title === "black") {
    res.value = "Черный"
  }
  if (product.value.color.color.title === "white") {
    res.value = "Белый"
  }
}
colorToRu()
watch(() => summa.value, () => {
  if (summa.value) {
    localStorage.setItem('summa', JSON.stringify(summa.value));
  }
}, { deep: true })


</script>

<style scoped>
.quantity {
  padding: 15px;
  font-size: 20px;
}

.product__item:not(:last-child) {
  margin-bottom: 60px;
}

.cart__block {
  border: 1px solid #dedede;
  border-radius: 1px;
  padding: 35px 30px;
}

.cart__button {
  margin-top: 20px;
  width: 100%;
}

.cart__desc,
.cart__price {
  margin: 0 0 15px;
  font-size: 16px;
  line-height: 22px;
}

.cart__price {
  font-size: 30px;
  line-height: 48px;
}

.cart__price span {
  font-weight: 500;
  font-size: 34px;
  line-height: 48px;
}

.cart__data {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px 30px;
  padding-bottom: 25px;
  margin-bottom: 15px;
}

.cart__data label:not(:nth-child(4)):not(:nth-child(3)) {
  grid-column: 1/-1;
}

.product__pic,
.product__title {
  align-self: flex-start;
  grid-column: 1/2;
  grid-row: 1/4;
}

.product__title {
  margin: 0;
  grid-column: 2/3;
  grid-row: 1/2;
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;
}

.product__info {
  margin: 0;
  grid-column: 2/3;
  grid-row: 2/3;
  font-size: 14px;
  line-height: 1;
  color: #737373;
}

.form__error-block {
  padding: 25px 30px;
  border: 3px solid #e02d71;
  border-radius: 1px;
}

.form__error-block h4 {
  margin: 0 0 4px;
  font-weight: 500;
  font-size: 17px;
  line-height: 24px;
  color: #e02d71;
}

.form__error-block p {
  margin: 0;
  font-size: 13px;
  color: #000;
}

.button {
  margin: 0;
  border: 0;
  font: inherit;
  background-color: transparent;
  -webkit-tap-highlight-color: transparent;
  display: inline-block;
  padding: 25px 15px;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
  font-family: "Circe", "Arial", sans-serif;
  vertical-align: middle;
  text-transform: uppercase;
  font-weight: 700;
  cursor: pointer;
}

.product__price {
  padding: 23px 5px;
  height: 70px;
  width: 70px;
  border-radius: 0;
  background-color: transparent;
  border: 0;
  -webkit-box-shadow: none;
  box-shadow: none;
  color: #222;
  font: inherit;
  font-size: 24px;
  line-height: 1;
  text-align: center;
}

.product__del {
  grid-column: 5/6;
  grid-row: 1/2;
}

.cart__item:not(:last-child) {
  margin-bottom: 60px;
}

.color-ru {
  display: flex;
  text-align: start;
  align-items: center;
  padding-left: 15px
}

.bor {
  border: 1px solid gray;
}
</style>