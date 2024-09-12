<template>
  <the-filter @set-filter-arr="setFilterArr" @set-card="setCard" :paginationTotal="pagination.total" />
  <div class="container">

    <section class="catalog">
      <ul class="catalog__list">
        <router-link class="catalog__item" v-for=" product in products"
          :to="{ name: 'product', params: { id: product.id } }" :key="product.id">
          <ProductCardCataloge :product="product" @click="currentCard($event)"></ProductCardCataloge>
        </router-link>
        <router-view />
      </ul>
    </section>
    <div class="container1">
      <VueAwesomePaginate :total-items="pagination.total" v-model="currentPage" :items-per-page="pagination.itemPerPage" :page="pagination.page"
        @click="onClickHandler" />
    </div>
  </div>
</template>
<div class="header__icon">
</div>


<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCounterStore } from "@/stores/counter"
import { useBasketStore } from "@/stores/basket"
import TheFilter from '@/components/TheFilter.vue'
import { getProducts, getColorIds } from '@/api/product'
import type { IPagination } from '@/types/global'
import type { IProduct } from '@/types/product'
import VueAwesomePaginate from '@/components/VueAwesomePaginate.vue'
import ProductCardCataloge from '@/components/ProductCardCataloge.vue'
import { getAccessKey } from '@/api/baskets';

const counter = useCounterStore();
const basket = useBasketStore();
const products = ref<IProduct[]>([]);
const productsAll = ref<IProduct[]>([]);
const productId = ref('')
const flag = ref(basket.flag)
const colors = ref([])
const key = ref('')
const numberChunk = ref(1)
const currentPage = ref(1);
const productsFromFilter = ref<IProduct[]>([]);
const pagination = ref<IPagination>({
  page: 1,// какая сейчас активна для показа
  itemPerPage: 3, //количество элементов на странице
  total: 0, // //количество элементов всего

})
const propsSeachPop = ref([])

const onClickHandler = (page: number) => {

  numberChunk.value = page
  if (productsFromFilter.value.length !== 0) {
    pagination.value.total = productsFromFilter.value.length
    const chunkedArray = chunkArray(productsFromFilter.value, 3);
    if (numberChunk.value === 1) {
      products.value = chunkedArray[0]
    } else {
      products.value = chunkedArray[page - 1]
    }
  }
  else {
    pagination.value.total = counter.products.length
    const chunkedArray = chunkArray(counter.products, 3);
    if (numberChunk.value === 1) {
      products.value = chunkedArray[0]
    } else {
      products.value = chunkedArray[page - 1]
    }
  }
};


// Запрос на получение ключа
async function getAccess() {
  if (flag.value) {
    key.value = await getAccessKey()
    basket.key = key.value
  }
  flag.value = false
  basket.flag = false

}
getAccess()

const keyInLocalStorage = localStorage.getItem('key');
if (keyInLocalStorage && keyInLocalStorage !== 'undefined') {
  key.value = JSON.parse(keyInLocalStorage).value;
}
watch(() => key.value, () => {
  localStorage.setItem('key', JSON.stringify(key.value))

}, { deep: true })

//Запрос на получение ВСЕГО списка товаров 
const r = async () => {
  counter.loadProducts();
  productsAll.value = counter.productsAll
}
r()

//Запрос на получение всего списка товаров НА СТРАНИЦЕ
const loadProducts = async () => {
  if (numberChunk.value === 1) {
    const response = await getProducts()

    const img = response.products.find((elem) => {
      if (elem.id === 7) {
        let picture = elem.colors[0].gallery[0].file
        picture.url = 'src/assets/img/product-7.jpg'

      }
      if (elem.id === 12) {
        let picture = elem.colors[0].gallery[0].file
        picture.url = 'src/assets/img/product-12.jpg'
      }
    })
    response.products.forEach((el) => {
      el.colors.forEach((el) => {
        el.color.active = false
      })
      el.colors[0].color.active = true;
    })
    products.value = response.products
    counter.products = response.products
    pagination.value.total = products.value.length
    const chunkedArray = chunkArray(products.value, 3);
    if (numberChunk.value === 1) {
      products.value = chunkedArray[numberChunk.value - 1]
    } else {
      products.value = chunkedArray[numberChunk.value]
    }

  }
}
loadProducts()
//////////////     Клик по карточке товара   ////////////////////
const currentCard = async (event: any) => {

  if (!event.target.hasAttribute('marker', 'colors')) {
    productId.value = event.target.parentNode.parentNode.id;
    counter.productId = productId.value
    await counter.loadProduct(counter.productId);
    colors.value = counter.colors
    counter.currentProduct = (await counter.loadProduct(counter.productId)).product;
    colors.value.forEach((el) => {
      el.color.active = false

    })
    if (colors.value[0] !== undefined) {
      colors.value[0].color.active = true
      counter.colors = colors.value
    }

  }

}
const setFilterArr = (card: any) => {
  productsFromFilter.value = card
  pagination.value.total = card.length
  const chunkedArray = chunkArray(card, 3);
  if (numberChunk.value === 0) {
    products.value = chunkedArray[numberChunk.value]
  } else {
    products.value = chunkedArray[numberChunk.value - 1]
  }
}

const setCard = (card: any) => {
  console.log(card);
  productsFromFilter.value = card
  pagination.value.total = productsFromFilter.value.length;
  pagination.value.page = 1

  currentPage.value= 1
  numberChunk.value = 0

  const chunkedArray = chunkArray(card, 3);
  if (numberChunk.value === 0) {
    products.value = chunkedArray[numberChunk.value]
  } else {
    products.value = chunkedArray[numberChunk.value - 1]
  }
}



const addColorsId = async () => {
  const colorsId = await getColorIds();
}

addColorsId()

function chunkArray(array: any, chunkSize: any) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
watch(() => products.value, () => {
  localStorage.setItem('products', JSON.stringify(products.value))
}, { deep: true })

const productInLocalStorage = localStorage.getItem('products');
if (productInLocalStorage) {
  products.value = JSON.parse(productInLocalStorage).value;
}
</script>
<style scope>
@import "vue-awesome-paginate/dist/style.css";

.container1 {
  display: flex;
  justify-content: center;
}

.pagination-container {
  display: flex;
  column-gap: 10px;
}

.paginate-buttons {
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgb(242, 242, 242);
  border: 1px solid rgb(217, 217, 217);
  color: black;
}

.paginate-buttons:hover {
  background-color: #d8d8d8;
}

.active-page {
  background-color: #3498db;
  border: 1px solid #3498db;
  color: white;
}

.active-page:hover {
  background-color: #2988c8;
}
</style>