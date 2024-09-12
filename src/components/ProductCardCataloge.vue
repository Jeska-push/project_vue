<template>
    <div v-if="product" :id="product.id">
        <a class="catalog__pic" href="#">
            <img v-if="product.colors[0].gallery !== null" :src="src" alt="product.title" class="img">
            <img v-if="product.colors[0].gallery == null" :src="src14" alt="product.title">
        </a>
        <h3 class="catalog__title">
            <a href="#">
                {{ product.title }}
            </a>
        </h3>
        <span class="catalog__price" @click.prevent>
            {{ product.price }}
        </span>
        <ul class="colors colors--black">
            <li class="colors__item" v-for="item in product.colors" :key="item.id">
                <label class="colors__label">
                    <input class="colors__radio sr-only" type="radio" name="color-1">
                    <span v-if="item.color.id !== 27" class="colors__value"
                        :style="`background-color: ${item.color.code};`" :name="`${item.color.title}`"
                        @click.prevent="color($event, product?.id)" marker="colors"></span>
                    <span v-else class="colors__value bor" :style="`background-color: ${item.color.code};`"
                        :name="`${item.color.title}`" @click.prevent="color($event, product?.id)"
                        marker="colors"></span>
                </label>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import type { IProduct } from '@/types/product'
import { ref, toRefs } from 'vue'
import { useCounterStore } from "@/stores/counter"
const counter = useCounterStore();
const productNew = ref({});
const src = ref('');
const src14 = ref('');
const currentProduct = ref<IProduct[]>([])

const props = defineProps<{
    product: IProduct | null,
}>()

const { product } = toRefs(props)
currentProduct.value = props.product
counter.currentProduct = currentProduct.value
src14.value = 'src/assets/img/product-14-Blue.jpg'

if (props.product?.colors[0].gallery !== null) {
    src.value = props.product?.colors[0].gallery[0].file.url
}
const color = async (event: any, id: number) => {
    let colorName = event.target.getAttribute('name')
    if (event.target.getAttribute('name', colorName)) {
        productNew.value = props.product;
        if (productNew.value.id == 14) {
            src14.value = `src/assets/img/product-14-${colorName}.jpg`
        }
    }
    productNew.value.colors.forEach((el: any) => {
        el.color.active = false
        if (el.color.title == colorName) {
            el.color.active = true
            src.value = el.gallery[0].file.url;
        }
    })
    counter.currentProduct = productNew.value
    counter.productsAll.forEach((el: any) => {
        if (productNew.value.id === el.id) {
            counter.productsAll.splice(id - 1, 1)
            counter.productsAll.splice(id - 1, 0, productNew.value);
        }
    })
}

</script>
<style scoped>
.bor {
    border: 1px solid gray;
}
</style>