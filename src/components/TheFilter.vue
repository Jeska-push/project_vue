<template>
    <main class="content container">
        <div class="content__top">
            <div class="content__row">
                <h1 class="content__title">
                    Каталог
                </h1>
                <span v-if="flagReset === false" class="content__info">
                    {{ props.paginationTotal }} товаров
                </span>
                <span v-else class="content__info">
                    {{ paginationTotal }} товаров
                </span>
            </div>
        </div>
        <div class="content__catalog">
            <aside class="filter">
                <form class="filter__form form" action="#" method="get">
                    <fieldset class="form__block">
                        <legend class="form__legend">Цена</legend>
                        <label class="form__label form__label--price">
                            <input class="form__input" type="text" name="min-price" v-model="minPrice">
                            <span class="form__value">От</span>
                        </label>
                        <label class="form__label form__label--price">
                            <input class="form__input" type="text" name="max-price" v-model="maxPrice">
                            <span class="form__value">До</span>
                        </label>
                    </fieldset>
                    <fieldset class="form__block">
                        <legend class="form__legend">Категория</legend>
                        <label class="form__label form__label--select" @click="select"
                            :class="{ selectStyle: isActive }">
                            <input class="form__select" ref="category" type="text" name="category"
                                :value="categoryInput">
                            <span class="arrow" :class="{ arrow_down: isActive }"></span>

                            <ul class="option-box">
                                <li class="option" :class="{ active: isActive }" :data-id="item.id"
                                    v-for=" item in categoryProducts" :key="item.id" @click="selectProduct($event)"> {{
                                        item.title }}</li>
                            </ul>
                        </label>
                    </fieldset>
                    <fieldset class="form__block">
                        <legend class="form__legend">Цвет</legend>
                        <ul class="check-list radio-list">
                            <li class="check-list__item" v-for="item in colors" :key="item.id">
                                <label class="check-radio">
                                    <input class="colors__radio colors-r sr-only real-radio" ref="radio" type="checkbox"
                                        :name="item.title" :checked="false">
                                    <span v-if="item.id !== 27" class="custom-radio"
                                        :style="`background-color: ${item.code};`" :data-id="item.id"
                                        @click="colorComputed($event)" ref="col">
                                    </span>
                                    <span v-else class="custom-radio bor" :style="`background-color: ${item.code}; `"
                                        :data-id="item.id" @click="colorComputed($event)" ref="col">
                                    </span>
                                </label>
                            </li>
                        </ul>
                    </fieldset>
                    <fieldset class="form__block">
                        <legend class="form__legend">Материал</legend>
                        <ul class="check-list">
                            <li class="check-list__item" v-for=" item in materials" :key="item.id">
                                <label class="check-list__label">
                                    <input class="check-list__check sr-only" ref="matInput" type="checkbox"
                                        name="material" value="">
                                    <span class="check-list__desc" ref="mat" :data-id="item.id"
                                        @click="materialsClick($event)">
                                        {{ item.title }}
                                        <span></span>
                                    </span>
                                </label>
                            </li>
                        </ul>
                    </fieldset>
                    <fieldset class="form__block">
                        <legend class="form__legend">Коллекция</legend>
                        <ul class="check-list">
                            <li class="check-list__item" v-for=" item in seasons" :key="item.id">
                                <label class="check-list__label">
                                    <input class="check-list__check sr-only" ref="matInput1" type="checkbox"
                                        name="collection" value="">
                                    <span class="check-list__desc" @click="seasonsClick($event)" :data-id="item.id"
                                        ref="mat1">
                                        {{ item.title }}
                                        <span></span>
                                    </span>
                                </label>
                            </li>
                        </ul>
                    </fieldset>
                    <button class="filter__submit button button--primery" type="button" @click="filterArr()">
                        Применить
                    </button>
                    <button v-if="reset === true" class="filter__reset button button--second" type="button"
                        @click="resetFilter">
                        Сбросить
                    </button>
                </form>
            </aside>
        </div>
    </main>
</template>




<script setup lang="ts">
import { ref, watch } from 'vue'
import type { IMaterials, Iseasons, ICategoryProducts, IColorsArr, IProduct, IPrice } from '@/types/product';
import { getColors, getCategory, getMaterials, getSeasons, filterMaterials, filterColors, filterMinPrice, filterMaxPrice, getSeasonIds, getCategoryId } from '@/api/product'
import { useCounterStore } from "@/stores/counter"

const seasons = ref<Iseasons[]>([]);

let isActive = ref(false)
let flag = ref(false)
let flagReset = ref(false)
const category = ref('')
const colors = ref<IColorsArr[]>([]);
const categoryInput = ref('Все товары')
const categoryProducts = ref<ICategoryProducts[]>([]);
const materials = ref<IMaterials[]>([]);
const counter = useCounterStore();
const productsAll = ref<IProduct[]>([]);
const products = ref<IProduct[]>([]);
const minPrice = ref<number | null>(0);
const maxPrice = ref<number | null>(50000);

const radio = ref([])
const emit = defineEmits(['set-filter-arr', 'set-card', 'set-page'])
const colorId = ref(0)
const materialId = ref('')
const reset = ref(false)
const mat = ref([])
const col = ref([])
const mat1 = ref([])
const paginationTotal = ref(0)
const priceArray = ref<IProduct[]>([]);
const colorArray = ref<IProduct[]>([]);
const materialArray = ref<IProduct[]>([]);
const seasonArray = ref<IProduct[]>([]);
const categoryArray = ref<IProduct[]>([]);
const matInput = ref([])
const matInput1 = ref([])



const props = defineProps<{
    paginationTotal: IProduct


}>()

paginationTotal.value = products.value.length;
const getProducts = async () => {
    const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/products`)
    const response = await fetchResponse.json()
    products.value = response.items
}
getProducts()


const select = () => {
    if (isActive.value == false) {
        isActive.value = true
    } else {
        isActive.value = false
    }
}


//Запрос на получение всего списка цветов
const loadColors = async () => {
    const response = await getColors()
    colors.value = response.colors.items
}
loadColors();

const loadCategory = async () => {
    const response = await getCategory()
    categoryProducts.value = response.colors.items
}
loadCategory();

const loadMaterials = async () => {
    const response = await getMaterials()
    materials.value = response.materials.items
}

loadMaterials();
const loadSeasons = async () => {
    const response = await getSeasons()
    seasons.value = response.seasons.items
}
loadSeasons();

const prodAll = async () => {
    const prodAll = await counter.loadProducts();
    productsAll.value = prodAll.value
}
prodAll()

watch(() => [minPrice, maxPrice], () => {
    if (minPrice.value !== 0) {
        reset.value = true
    }
    if (maxPrice.value !== 50000) {
        reset.value = true
    }
    filteredComputedPrice(minPrice.value, maxPrice.value)
}, { deep: true })


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Фильтрация по цене
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

const minPriceArr = ref<IPrice[]>([])
const maxPriceArr = ref<IPrice[]>([])

const filteredComputedPrice = async (minPrice: any, maxPrice: any) => {

    minPriceArr.value = await filterMinPrice(minPrice);
    minPriceArr.value = minPriceArr.value.products;
    maxPriceArr.value = await filterMaxPrice(maxPrice);
    maxPriceArr.value = maxPriceArr.value.products;
    const tempArr = ref([])
    const array3 = minPriceArr.value.concat(maxPriceArr.value);
    //сортировка массива по возрастанию
    const copy = [...array3];
    const sortUsers = (arr: any) => {
        let result = arr.sort(function (a: any, b: any) {
            return a.id - b.id;
        })
        return result;
    }
    sortUsers(copy)
    //сравнение соседних элементов 
    for (let i = 0; i < copy.length - 1; i++) {
        if (copy[i].id === copy[i + 1].id) {
            tempArr.value.push(copy[i])
        }
    }
    priceArray.value = tempArr.value

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Фильтрация по карегории
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

const selectProduct = async (event: any) => {
    categoryInput.value = event.target.textContent;
    const response = await getCategoryId(event.target.dataset.id);
    categoryArray.value = response
    isActive.value = false
    reset.value = true
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Фильтрация по цвету
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Клик по кружочкам
const colorComputed = ((event: any) => {
    colorId.value = event.target.dataset.id;
    event.target.classList.toggle('isAct');
    addColorsFilter()
    reset.value = true
})
//Выбирает пункты для фильтрации 


const addColorsFilter = () => {
    const productsArrColor = ref([])
    const array = ref([])
    const array1 = ref([])
    col.value.forEach((item: any) => {
        if (item.classList.contains('isAct')) {
            productsArrColor.value.push(item.dataset.id);
            // item.classList.remove('isAct')
        }
    })
    if (productsArrColor.value.length !== 0) {
        productsArrColor.value.forEach(async (item: any) => {
            const colorsFilter = await filterColors(item)
            array.value.push(colorsFilter.products);
            array1.value = array.value.flat();
            colorArray.value = Array.from(new Set(array1.value.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
        })
    }
    else {
        colorArray.value = products.value
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Фильтрация по материалу
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
const materialsClick = (event: any) => {
    materialId.value = event.target.dataset.id
    event.target.classList.toggle('active')
    reset.value = true
    addMaterialsFilter()
}
//Выбирает пункты для фильтрации
const addMaterialsFilter = () => {
    const productsArrMaterials = ref([])
    mat.value.forEach((item: any) => {
        if (item.classList.contains('active')) {
            productsArrMaterials.value.push(item.dataset.id)
        }
    })
    const arr = ref([])
    const arr1 = ref([])
    if (productsArrMaterials.value.length !== 0) {
        productsArrMaterials.value.forEach(async (item: any) => {
            const materialsFilter = await filterMaterials(item)
            arr.value.push(materialsFilter.products);
            arr1.value = arr.value.flat();
            materialArray.value = Array.from(new Set(arr1.value.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
        })
    }
    else {
        materialArray.value = products.value
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Фильтрация по коллекции
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const seasonsClick = (event: any) => {
    materialId.value = event.target.dataset.id
    event.target.classList.toggle('active');
    reset.value = true
    filteredSeasons()
}
const filteredSeasons = () => {
    const productsArrSeasons = ref([])
    mat1.value.forEach((item: any) => {

        if (item.classList.contains('active')) {
            productsArrSeasons.value.push(item.dataset.id)
        }
    })
    const arrSeasons = ref([])
    const arrSeasons1 = ref([])
    if (productsArrSeasons.value.length !== 0) {
        productsArrSeasons.value.forEach(async (item: any) => {
            const seasonsFilter = await getSeasonIds(item)
            arrSeasons.value.push(seasonsFilter.products);
            arrSeasons1.value = arrSeasons.value.flat();
            seasonArray.value = Array.from(new Set(arrSeasons1.value.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
        })
    }
    else {
        seasonArray.value = products.value
    }
}
const filterArr = (() => {
    if (priceArray.value.length === 0) {
        priceArray.value = products.value
    }
    if (seasonArray.value.length === 0) {
        seasonArray.value = products.value
    }
    if (colorArray.value.length === 0) {
        colorArray.value = products.value
    }
    if (categoryArray.value.length === 0) {
        categoryArray.value = products.value
    }
    if (materialArray.value.length === 0) {
        materialArray.value = products.value
    }
    const result = ref([])
    const res = [...priceArray.value, ...colorArray.value, ...materialArray.value, ...seasonArray.value, ...categoryArray.value];
    const resultNoDublicate = Array.from(new Set(res.map(item => JSON.stringify(item)))).map(item => JSON.parse(item))

    for (let i = 0; i < resultNoDublicate.length; i++) {
        const array = [];
        for (let j = 0; j < res.length; j++) {
            if (resultNoDublicate[i].id === res[j].id) {
                array.push(resultNoDublicate[i].id)

                if (array.length === 5) {
                    result.value.push(resultNoDublicate[i])
                }
            }
        }
        emit('set-filter-arr', result.value)
    }
})
const resetFilter = () => {
    minPrice.value = 0
    maxPrice.value = 50000
    categoryInput.value = "Все товары"
    flag.value = false

    radio.value.forEach((item: any) => {
        item.checked = false;

    })
    matInput.value.forEach((item: any) => {
        item.checked = false;

    })
    matInput1.value.forEach((item: any) => {
        item.checked = false;

    })
    col.value.forEach((item: any) => {
        if (item.classList.contains('isAct')) {
            item.classList.remove('isAct')
        }
    })
    reset.value = false
    flagReset.value = true
    paginationTotal.value = products.value.length;
    emit('set-card', products.value);

}



</script>

<style scoped>
.content {
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    padding-top: 35px;
    padding-bottom: 100px;
}

.content__top {
    margin-bottom: 35px;
}

.content__top--catalog {
    margin-left: 310px;
    text-align: center;
}

.content__row {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.content__breadcrumbs {
    margin-bottom: 10px;
}

.content__title {
    margin: 10px 0;
    font-weight: 800;
    font-size: 24px;
    line-height: 54px;
    text-transform: uppercase;
}

.content__title span {
    font-family: 'Geometria', 'Arial', sans-serif;
    font-weight: 500;
    font-size: 18px;
    vertical-align: top;
    color: #000;
}

.content__info {
    margin-left: 12px;
    font-size: 16px;
    font-weight: 300;
    line-height: 1;
    color: #9d9d9d;
}

.content__catalog {
    display: grid;
    grid-template-columns: 290px 1fr;
    grid-gap: 20px;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
}

.filter__form {
    padding: 0 25px 60px;
}

.filter__submit {
    width: 100%;
    margin-bottom: 15px;
}

.filter__reset {
    width: 144px;
}

.form__block {
    border: 0;
    padding: 0;
    margin: 0 0 35px;
}

.form__legend {
    margin-bottom: 12px;
    font-family: 'Geometria', 'Arial', sans-serif;
    font-size: 14px;
    line-height: 1;
    color: #737373;
}

.form__label {
    position: relative;
    display: block;
    color: #222;
}

.form__label:not(:last-child) {
    margin-bottom: 25px;
}

.form__label--price::after {
    content: '₽';
    position: absolute;
    top: 32px;
    right: 20px;
    font-size: 16px;
    line-height: 1;
    color: #222;
}

.form__label--select {
    display: flex;

    border: 1px solid grey;
}


.form__label--small::after {
    right: 5px;
}

.form__label--small select {
    height: 35px;
    padding: 6px 25px 6px 10px;
}

.form__value {
    position: absolute;
    top: 10px;
    left: 20px;
    font-size: 12px;
    line-height: 1;
    color: #737373;
    font-weight: 300;
}

.form__input {
    padding: 28px 45px 13px 20px;
    width: 100%;
    height: 65px;
    border-radius: 1px;
    border: 1px solid transparent;
    background-color: #fafafa;
    -webkit-box-shadow: none;
    box-shadow: none;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
    color: #222;
    font-size: 16px;
    font-family: inherit;
    line-height: 1;
}

.form__input:focus,
.form__input:hover {
    outline: 0;
    border-color: #222;
}

.form__input--area {
    height: 140px;
    resize: none;
}

.form__select {
    width: 100%;
    height: 52px;
    border-radius: 0;
    border: 0;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 14px 35px 14px 18px;
    color: #222;
    font-size: 16px;
    font-family: inherit;
    line-height: 1;
    background-color: #fafafa;
    border: none;
}



.form__counter button:focus,
.form__counter button:hover {
    background-color: #222;
    color: #fff;
}

.form__counter input {
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

.colors__label {
    position: relative;
    cursor: pointer;
    display: block;
    border-radius: 50%;
    padding: 3px;
}

.colors__value,
.colors__value::before {
    border-radius: 50%;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
}

.colors__value {
    display: block;
    width: 20px;
    height: 20px;
}

.colors__value::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 26px;
    height: 26px;
    border: 1px solid transparent;
}

.colors__label:focus .colors__value::before,
.colors__label:hover .colors__value::before,
.colors__radio:checked~.colors__value::before {
    border-color: var(--border-color);
}

.colors__radio:focus~.colors__value::before {
    opacity: 0.7;
}

.colors-r {
    transform: scale(2);
}

.radio-list {
    display: flex;
    gap: 10px;
}

.real-radio {
    display: none;
}

.custom-radio {
    position: relative;
    display: inline-block;
    width: 18px;
    height: 18px;
    background-color: #e02d71;
    border-radius: 50%;
    vertical-align: text-top;
}

.custom-radio1 {
    position: relative;
    display: inline-block;
    width: 18px;
    height: 18px;
    background-color: #e02d71;
    border-radius: 50%;
    vertical-align: text-top;
}

.custom-radio::before {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    content: '';
    display: inline-block;
    width: 26px;
    height: 26px;
    border: 1px solid black;
    border-radius: 50%;
    background-color: transparent;
    display: none;
}


.real-radio:checked+.custom-radio::before {
    display: block;
}

.check-list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.check-list__item {
    display: flex;
    gap: 10px;
}

.check-list__item:not(:last-child) {

    margin-bottom: 13px;
}

.check-list__label {
    display: block;
    cursor: pointer;
}

.check-list__desc {
    position: relative;
    display: block;
    padding-left: 27px;
    padding-top: 3px;
    padding-bottom: 3px;
    font-size: 16px;
    line-height: 1;
}

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

.check-list__check {
    display: none;
}

.check-list__check:checked~.check-list__desc::after {
    opacity: 1;
}

.option-box {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;

}

.option {
    display: none;
    padding: 10px 14px;
    width: 100%;
    font-size: 16px;
    background-color: #fafafa;
}

.active {
    display: flex;
    flex-direction: column
}

.option:hover,
.option:active {
    background-color: #93e9f1;
}

.selectStyle {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.arrow {

    position: absolute;
    top: 50%;
    right: 20px;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 14px;
    height: 7px;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url(../assets/img/svg/icon-arrow-bottom.svg);
}

.arrow_down {
    top: 11%;
    transform: rotate(180deg);
}

.selectStyle::after {
    top: 13%;
}

.bor {
    border: 1px solid gray;
}
</style>
