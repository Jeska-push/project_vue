<template>

    <div class="conteiner">
        <div class="content__row" :class="{ 'cart__none': basket.arr.length === 0 }">
            <h1 class="content__title"  >
                Корзина
            </h1>
            <span class="content__info">
                {{ basket.arr.length }}
                товара
            </span>
        </div>
        <section class="cart">
            <form class="cart__form form" action="#" method="POST">
                <div class="cart__field">
                    <ul class="cart__list">
                        <li class="cart__item" v-for="product in productsBasket" :key="product.id" :id="product.id">
                            <ProductCardBasket :product="product" :productsBasket="productsBasket" />
                        </li>
                    </ul>
                </div>
                <div v-if="basket.summa !== 0" class="cart__block">
                    <p class="cart__desc">
                        Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
                    </p>
                    <p class="cart__price">
                        Итого: <span>{{ basket.summa }}</span>
                    </p>

                    <router-link class="cart__button button button--primery" :to="{ name: 'order' }" @submit="addOrder"
                        type="submit">
                        Оформить заказ
                    </router-link>
                </div>
                <div v-else class="cart__block ">
                    <h2 class="cart__tite">Корзина пуста</h2>
                    <p class="cart__desc">
                        Воспользуйтесь каталогом
                        , чтобы найти всё, что нужно.</p>
                </div>
            </form>
        </section>
    </div>
</template>

<script setup lang="ts">
import ProductCardBasket from '@/components/ProductCardBasket.vue'
import { useBasketStore } from '@/stores/basket';
import { getBaskets } from '@/api/baskets';
import { ref, watch } from 'vue'
import type { IProduct } from "@/types/product"
const basket = useBasketStore();
const summa = ref(0)
const prod = ref<IProduct[]>([])
const productsBasket = ref<IProduct[]>([])

///////////      Запрос списка товаров из корзины ////////
const summaInLocalStorage = localStorage.getItem('summa');
if (summaInLocalStorage) {
    summa.value = JSON.parse(summaInLocalStorage);
}
summa.value = basket.summa
//добавление товаров  в хранилище корзины
const getBask = async () => {
    productsBasket.value = await getBaskets();
    const productsInLocalStorage = localStorage.getItem('basket');
    if (productsInLocalStorage) {
        prod.value = JSON.parse(productsInLocalStorage);
    }
    if (productsBasket.value.length === 0) {
        productsBasket.value = prod.value
    }
    basket.arr = productsBasket.value
    // пересчет корзины
    basket.calcSumma()
    summa.value = basket.summa
}
getBask();

watch(() => productsBasket.value, () => {
    if (productsBasket.value) {
        localStorage.setItem('basket', JSON.stringify(productsBasket.value));
    }
}, { deep: true })

watch(() => summa.value, () => {
    if (summa.value) {
        localStorage.setItem('summa', JSON.stringify(summa.value))
    }
}, { deep: true })

</script>

<style scoped>

</style>