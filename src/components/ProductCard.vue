<template>
    <div class="container1">
        <main>
            <section class="item">
                <div class="item__pics pics">
                    <div class="pics__wrapper">
                        <img width="570" height="570" :src="src" :alt="product.title">
                    </div>
                    <ul class="pics__list">
                        <li class="pics__item" v-for="item in src_picture" :key="item.id">
                            <a href="#" class="pics__link" :class="{ 'pics__link--curren': item.isDynamic === true }"
                                disabled>
                                <img width="98" height="98" alt="Название товара" :src="item.url" :alt="product.title">
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="item__form">
                    <form class="form" action="#" method="POST">
                        <div class="item__info">
                            <span class="item__code">Артикул: {{ product.id }}</span>
                            <h2 class="item__title">
                                {{ product.title }}
                            </h2>
                            <div class="item__row item__row--center">
                                <div class="form__counter">
                                    <button type="button" class="btn btn-minus" @click="minus"
                                        aria-label="Убрать один товар">
                                        -
                                    </button>

                                    <input type="text" :value="quantity" name="count">

                                    <button type="button" class="btn btn-plus" @click="plus"
                                        aria-label="Добавить один товар">
                                        +
                                    </button>
                                </div>
                                <b class="item__price">
                                    {{ summa }} ₽
                                </b>
                            </div>
                            <div class="item__box">
                                <div class="item__row">
                                    <div class="form__block">
                                        <div class="form__legend">Цвет</div>
                                        <ul class="colors colors--black">
                                            <li class="colors__item" v-for="item in product.colors" :key="item.id">
                                                <label class="colors__label">
                                                    <input class="colors__radio sr-only" type="radio" name="color">
                                                    <span v-if="item.color.id !== 27" class="colors__value"
                                                        :style="`background-color: ${item.color.code};`"
                                                        :data-color="item.color.title"
                                                        @click="color($event, product.id)" :name="item.color.title">
                                                        <span class="colors__value-active"></span>
                                                    </span>
                                                    <span v-if="item.color.id === 27" class="colors__value bor"
                                                        :style="`background-color: ${item.color.code};`"
                                                        :data-color="item.color.title"
                                                        @click="color($event, product.id)" :name="item.color.title">
                                                        <span class="colors__value-active"></span>
                                                    </span>

                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="item__row">
                                    <fieldset class="form__block">
                                        <legend class="form__legend">Размер</legend>
                                        <label class="form__label">
                                            <input class="product__select" type="text" ref="selectInput" name="size"
                                                :value="sizeInput" @click="select">
                                            <span class="arrow" :class="{ arrow_down: isActive }"></span>

                                            <ul class="option-box">
                                                <li class="option" :class="{ active: isActive }" v-for=" item in size"
                                                    :key="item.id" @click="selectProduct($event)"> {{ item.title }}</li>
                                            </ul>
                                        </label>
                                    </fieldset>
                                </div>
                            </div>
                            <router-link :to="{ name: 'basket' }" class="item__button button button--primery"
                                @click="counter.inBasket(quantity, sizeInput, 0)">
                                В корзину
                            </router-link>
                        </div>
                    </form>
                </div>
                <div class="item__desc">
                    <ul class="tabs">
                        <li class="tabs__item" v-for="item in tabs" :key="item">
                            <router-link :to="{ name: 'product' }" class="tabs__link" href=""
                                @click="tabs_click($event)">
                                {{ item }}
                            </router-link>
                        </li>
                    </ul>
                    <div class="item__content">
                        <the-delivery v-if="isDelivery" :price="price" />
                        <the-about v-else />
                    </div>
                </div>
            </section>
        </main>
    </div>
    <form class="product__form" action="#" method="get">
    </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCounterStore } from "@/stores/counter"
import type { IProduct, ISize, IPicture } from '@/types/product'
import { RouterLink } from "vue-router"
import TheDelivery from '@/components/TheDelivery.vue'
import TheAbout from '@/components/TheAbout.vue'

const size = ref<ISize[]>([]);
const product = ref<IProduct[]>([]);
const sizeInput = ref('')
const tabs = ref([
    'Информация о товаре',
    'Доставка и возврат'
])
const color14 = ref('')
const counter = useCounterStore();
const productId = ref('')
const colorName = ref('')
const isActive = ref(false)
const isDelivery = ref(false)
const selectInput = ref('')
const src = ref('')
const picture = ref<IPicture[]>([]);
const src_picture = ref({});
const image = ref('')
const summa = ref(0)
const productPrice = ref(product.price)
const quantity = ref(1)
const productsBasket = ref<IProduct[]>([]);
const price = ref(0)

watch(() => product.value, () => {
    localStorage.setItem('product', JSON.stringify(product.value))

}, { deep: true })

watch(() => colorName.value, () => {
    localStorage.setItem('colorName', JSON.stringify(colorName.value))

}, { deep: true })
watch(() => quantity.value, () => {
    localStorage.setItem('quantity', JSON.stringify(quantity.value))

}, { deep: true })
watch(() => productPrice.value, () => {
    localStorage.setItem('productPrice', JSON.stringify(productPrice.value))

}, { deep: true })
watch(() => sizeInput.value, () => {
    localStorage.setItem('sizeInput', JSON.stringify(sizeInput.value))
}, { deep: true })

watch(() => color14.value, () => {
    localStorage.setItem('color14', JSON.stringify(color14.value))
}, { deep: true })
watch(() => summa.value, () => {
    localStorage.setItem('summa', JSON.stringify(summa.value))
}, { deep: true })
watch(() => size.value, () => {
    localStorage.setItem('size', JSON.stringify(size.value))
}, { deep: true })

watch(() => productsBasket.value, () => {
    if (productsBasket.value) {
        localStorage.setItem('basket', JSON.stringify(productsBasket.value));
    }
}, { deep: true })

async function getColors() {
    productId.value = counter.productId
    //Отрисовка кружочков в карточке товара
    await counter.loadProduct(productId.value)
    summa.value = counter.product.price
    productPrice.value = counter.product.price
    getColorName()

    ///////////   Отрисовка размеров  ////////////
    size.value = counter.size
    sizeInput.value = size.value[0].title
    counter.sizeInput = sizeInput.value

    ///////  Отрисовка маленьких кaртинок     //////
    picture.value = counter.pictures
    picture.value.forEach((el: any) => {
        if (el.id == productId.value) {
            src_picture.value = el.src
            el.src.forEach((element: any) => {
                image.value = element
            });
        }
    })
    product.value = counter.product
    if (productId.value === '14') {
        if (colorName.value === 'Pink') {
            const prod = counter.productsAll.find(el => el.id === 14)
            src.value = prod.colors[1].gallery[0].file.url;
            color14.value = prod.colors[1].gallery[0].file.url;
            console.log(src.value)
        }
    }
}
getColors()

const getColorName = () => {
    counter.productsAll.forEach((item: any) => {
        if (item.id === Number(productId.value)) {
            item.colors.forEach((i: any) => {
                if (i.color.active === true) {
                    colorName.value = i.color.title
                    src.value = `/src/assets/img_2x/product-${productId.value}-${colorName.value}@2x.jpg`
                }
            })
        }
    })
}

const tabs_click = (event: any) => {
    if (event.target.textContent == "Доставка и возврат") {
        isDelivery.value = true
        const loadInfo = async () => {
            const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/deliveries`)
            const response = await fetchResponse.json();
            console.log(response);
            price.value = response[1].price
            return response
        }
        loadInfo()
    }
    else {
        isDelivery.value = false
    }
}

////////////////  Кнопки + и -    ////////////////////
const plus = async () => {
    quantity.value = quantity.value + 1
    summa.value = productPrice.value * quantity.value
}
const minus = async () => {
    if (quantity.value > 0) {
        quantity.value = quantity.value - 1
    } else {
        quantity.value = 0
    }
    summa.value = productPrice.value * quantity.value
}

//////////////      Корзинa        //////////////////
const select = () => {
    if (isActive.value == false) {
        isActive.value = true
    } else {
        isActive.value = false
    }
}

const selectProduct = (event: any) => {
    sizeInput.value = event.target.textContent;
}
const color = (event: any, id: number) => {
    colorName.value = event.target.getAttribute('name')
    counter.colorName = colorName.value
    productId.value = counter.productId

    ///////////      Отрисовка фотографий  ///////////////
    if (event.target.getAttribute('name', colorName)) {
        src.value = `/src/assets/img_2x/product-${product.value.id}-${colorName.value}@2x.jpg`
    }

    if (productId.value === '14') {
        if (colorName.value === 'Pink') {
            const prod = counter.productsAll.find(el => el.id === 14);
            src.value = prod.colors[1].gallery[0].file.url;
            color14.value = prod.colors[1].gallery[0].file.url;
        }
    }
    counter.productsAll.forEach((el) => {
        if (el.id === counter.currentProduct.id) {
            counter.productsAll.splice(id - 1, 1)
            counter.productsAll.splice(id - 1, 0, counter.currentProduct);
        }
    })
}

const productInLocalStorage = localStorage.getItem('product');
const colorNameInLocalStorage = localStorage.getItem('colorName');
if (colorNameInLocalStorage) {
    colorName.value = JSON.parse(colorNameInLocalStorage);
}
const quantityInLocalStorage = localStorage.getItem('quantity');
if (quantityInLocalStorage) {
    quantity.value = JSON.parse(quantityInLocalStorage);
}
const productPriceInLocalStorage = localStorage.getItem('productPrice');

if (productPriceInLocalStorage) {
    productPrice.value = JSON.parse(productPriceInLocalStorage);
}
const sizeInputInLocalStorage = localStorage.getItem('sizeInput');
if (sizeInputInLocalStorage) {
    sizeInput.value = JSON.parse(sizeInputInLocalStorage);
}
if (productInLocalStorage) {
    product.value = JSON.parse(productInLocalStorage);
    src.value = `/src/assets/img_2x/product-${product.value.id}-${colorName.value}@2x.jpg`
}
const color14InLocalStorage = localStorage.getItem('color14');
if (color14InLocalStorage) {
    color14.value = JSON.parse(color14InLocalStorage);
}
const summaInLocalStorage = localStorage.getItem('summa');
if (summaInLocalStorage) {
    summa.value = JSON.parse(summaInLocalStorage);
}
const sizeInLocalStorage = localStorage.getItem('size');
if (sizeInLocalStorage) {
    size.value = JSON.parse(sizeInLocalStorage);
}


</script>

<style scoped>
.check-list__desc::after,
.check-list__desc::before {
    content: '';
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}

.check-list__desc::before {
    left: 0;
    width: 12px;
    height: 12px;
    background-color: #fff;
    border: 1px solid #222;
}

.check-list__desc::after {
    opacity: 0;
    left: 3px;
    width: 6px;
    height: 6px;
    background-color: #e02d71;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
}

.check-list__desc span {
    color: #737373;
}

.check-list__label:focus .check-list__desc::after,
.check-list__label:hover .check-list__desc::after {
    opacity: 0.3;
}

.check-list__check:checked~.check-list__desc::after {
    opacity: 1;
}

.act {
    display: flex;
}

.act:checked {
    display: flex;
}

.tabs {
    display: flex;
    gap: 30px;
}

.item__info {
    padding: 30px 15px;
}

.item__box {

    display: flex;
    gap: 30px;
}

.product__select {
    padding-left: 5px;
    width: 80px;
    background-color: #f8f8f8;
    border: none;
    outline: none;
}

.option {
    padding-left: 5px;
    opacity: 0;
    width: 100%;


    background-color: #f8f8f8;
}

.option-box {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0;
    list-style: none;
}

ul {
    list-style: none;
}

.social {
    margin: 0;
    padding: 0;
    list-style: none;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
}

.social__item+.social__item {
    margin-left: 30px;
}

.social__link {
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
    color: #d9d9d9;
}

.social__link:focus,
.social__link:hover {
    color: #e02d71;
}

.footer__wrapper {
    display: grid;
    grid-template-columns: 550px 423px;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding-top: 60px;
    padding-bottom: 60px;
    border-top: 1px solid #e9e9e9;
}

.footer__link {
    font-size: 14px;
    line-height: 24px;
    color: #222;
    border-bottom: 2px solid transparent;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
}

.footer__link:focus,
.footer__link:hover {
    border-color: #e02d71;
}

.footer__link--medium {
    font-weight: 500;
}

.footer__links {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-gap: 20px 30px;
}

.footer__desc {
    margin: 30px 0 37px;
    font-size: 14px;
    line-height: 24px;
    color: #9d9d9d;
}

.footer__social {
    margin-left: auto;
    -ms-flex-item-align: start;
    align-self: flex-start;
}

.footer__copyright {
    grid-row: 3/4;
    align-self: flex-end;
    font-size: 12px;
}

.footer__data {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 10px;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    grid-column: 2/3;
    grid-row: 3/4;
}

.arrow {

    position: absolute;
    top: 10%;
    right: 4px;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 14px;
    height: 7px;
    background-image: url('/src/assets/img/svg/icon-arrow-bottom.svg');
    background-repeat: no-repeat;
    background-size: contain;
    z-index: 100;
}

.arrow_down {
    transform: rotate(180deg);
    top: 8%;
}

.active {
    opacity: 1;
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

.button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.button--primery {
    background-color: #e02d71;
    border: 0;
    color: #fff;
    font-size: 13px;
}

.button--primery:not(:disabled):focus,
.button--primery:not(:disabled):hover {
    background-color: #150c26;
}

.button--second {
    background-color: transparent;
    border: 1px solid #222;
    padding: 15px;
    color: #222;
    font-size: 14px;
}

.button--second:not(:disabled):focus,
.button--second:not(:disabled):hover {
    background-color: #222;
    color: #fff;
}

.button-del {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    background-color: transparent;
    -webkit-tap-highlight-color: transparent;
    width: 20px;
    height: 20px;
}

.bor {
    border: 1px solid gray;
}
</style>