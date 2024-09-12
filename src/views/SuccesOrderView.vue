<template>
  <h1 class="content__title">
    Заказ оформлен <span>№ {{ basket.orderId }}</span>
  </h1>
  <section class="cart">
    <form class="cart__form form" action="#" method="POST">
      <div class="cart__field">
        <p class="cart__message">
          Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
          Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
        </p>

        <ul class="dictionary">
          <li class="dictionary__item">
            <span class="dictionary__key">
              Получатель
            </span>
            <span class="dictionary__value">
              {{ objectData.name }}
            </span>
          </li>
          <li class="dictionary__item">
            <span class="dictionary__key">
              Адрес доставки
            </span>
            <span class="dictionary__value">
              {{ objectData.address }}

            </span>
          </li>
          <li class="dictionary__item">
            <span class="dictionary__key">
              Телефон
            </span>
            <span class="dictionary__value">
              {{ objectData.phone }}
            </span>
          </li>
          <li class="dictionary__item">
            <span class="dictionary__key">
              Email
            </span>
            <span class="dictionary__value">
              {{ objectData.email }}
            </span>
          </li>
          <li class="dictionary__item">
            <span class="dictionary__key">
              Способ оплаты
            </span>
            <span class="dictionary__value">
              {{ paymentType }}
            </span>
          </li>
        </ul>
      </div>

      <div class="cart__block">
        <ul class="cart__orders">
          <li class="cart__order" v-for="item in basket.arr" :key="item">
            <h3>{{ item.product.title }}</h3>
            <b>{{ item.product.price * item.quantity }} ₽</b>
            <span>Артикул: {{ item.product.id }}</span>
          </li>
        </ul>
        <div class="cart__total">
          <p>Доставка: <b>{{ basket.payType }}</b></p>
          <p>Итого: <b>{{ bask }}</b> товара на сумму <b>{{ basket.summa }} ₽</b></p>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBasketStore } from '@/stores/basket';
import type { IObjectData } from '@/types/product'
const basket = useBasketStore();
const objectData = ref<IObjectData>({})
const paymentType = ref('')
const bask = ref([])

bask.value = basket.arr.length;
objectData.value = basket.objectData
if (objectData.value.paymentTypeId === '1') {
  paymentType.value = "Оплата картой"
}
else {
  paymentType.value = "Оплата наличными"
}

</script>

<style scoped>

</style>