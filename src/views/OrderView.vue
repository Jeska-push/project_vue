<template>
  <div class="container">
    <div class="content__row">
      <h1 class="content__title">
        Оформление заказа
      </h1>
    </div>
    <section class="cart">
      <form class="cart__form form" action="">
        <div class="cart__field">
          <div class="cart__data">
            <label class="form__label" v-for="(item, index) in inputArray" :key="item.name">
              <div class="form__input-box">
                <input class="form__input" :class="{ 'form__error-block': inputArray[index].error !== '' }"
                  :type="item.type" :name="item.name" :placeholder="item.placeholder" v-model="inputArray[index].val">
                <span class="form__value">{{ item.text }}</span>
              </div>
              <span class="form__error">{{ inputArray[index].error }}</span>

            </label>
            <label class="form__label">
              <textarea class="form__input form__input--area" :class="{ 'error': res === false }" name="comments"
                placeholder="Ваши пожелания" v-model="comment"></textarea>
              <span class="form__value">Комментарий к заказу</span>
              <span v-if="isValid === true" class="form__error">Введите комментарий на кириллице</span>
            </label>
          </div>
          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="(item, index) in arrayDelivery" :key="item.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" :value="arrayDelivery[index].title"
                    checked="" @click="radioButtonDelivery($event)">
                  <span class="options__value">
                    {{ arrayDelivery[index].title }} <b v-if='arrayDelivery[index].price !== 0'>{{
                      arrayDelivery[index].price }} ₽</b>
                  </span>
                </label>
              </li>
            </ul>
            <div class="cart__pay " :class="{ 'block': flag === true }">
              <h3 class="cart__title">Оплата</h3>
              <ul class="cart__options options">
                <li class="options__item" v-for="(item, index) in paymentArray" :key="index">
                  <label class="options__label">
                    <input class="options__radio sr-only" type="radio" name="pay" :value="item.value" checked=""
                      :id="item.id" @click="radioButtonPayment($event)">
                    <span class="options__value">{{ item.title }}
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="product in products" :key="product.id">
              <h3>{{ product.product.title }} </h3>

              <b>{{ product.price * product.quantity }} ₽</b>
              <span>Артикул: {{ product.id }}</span>
            </li>

          </ul>

          <div class="cart__total">
            <p>Доставка: <b>{{ delType }}</b></p>
            <p>Итого: <b>{{ basket.arr.length }}</b> товара на сумму <b> {{ sum }}</b> ₽</p>
          </div>
          <router-link :to="{ name: 'succesOrder' }">
            <button class="cart__button button button--primery" type="button" @click='succesOrder($event)'>
              Оформить заказ</button>
          </router-link>
        </div>
        <div class="cart__error  form__error-block " :class="{ 'cart__error-none': isTest === false }">
          <h4>Заявка не отправлена!</h4>
          {{ error }}

        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { IProduct, IObjectData, IArrayDelivery } from '@/types/product'
import { getBaskets, getDeliveries, postOrder, getPayments } from '@/api/baskets';
import { useBasketStore } from '@/stores/basket';
const basket = useBasketStore();
const products = ref<IProduct[]>([]);
const objectData = ref<IObjectData>();
const arrayDelivery = ref<IArrayDelivery[]>([]);
const sum = ref(0)
const deliveryTypeId = ref(0)
const paymentTypeId = ref(0)
const flag = ref(false)
const paymentArray = ref([{ title: 'Картой при получении', value: "card", id: 1 }, { title: 'Наличными при получении', value: "cash", id: 2 },])
const comment = ref('');
const payType = ref('')
const res = ref(true)
const isValid = ref(false)
const isTest = ref(false)
const error = ref('')
const summaInLocalStorage = localStorage.getItem('summa');
const delType = ref('')


if (summaInLocalStorage) {
  sum.value = JSON.parse(summaInLocalStorage);
}

const inputArray = ref([
  {
    type: 'text',
    name: 'name',
    placeholder: 'Введите ваше полное имя',
    text: 'ФИО',
    val: '',
    error: ''
  },
  {
    type: 'text',
    name: 'address',
    placeholder: 'Введите ваш адрес',
    text: 'Адрес доставки',
    val: '',
    error: ''
  }, {
    type: 'tel',
    name: 'phone',
    placeholder: 'Введите ваш телефон',
    text: 'Телефон',
    val: '',
    error: ''
  },
  {
    type: 'email',
    name: 'email',
    placeholder: 'Введи ваш Email',
    text: 'Email',
    val: '',
    error: ''
  },

])

watch(() => [inputArray.value[0].val, inputArray.value[1].val, inputArray.value[2].val, inputArray.value[3].val, comment.value], () => {
  if ([inputArray.value[0].val || inputArray.value[1].val || inputArray.value[2].val || inputArray.value[3].val || comment.value]) {
    localStorage.setItem('order', JSON.stringify([inputArray.value[0].val, inputArray.value[1].val, inputArray.value[2].val, inputArray.value[3].val, comment.value]))
  }
}, { deep: true })



objectData.value = {
  name: inputArray.value[0].val,
  address: inputArray.value[1].val,
  phone: String(inputArray.value[2].val),
  email: inputArray.value[3].val,
  deliveryTypeId: Number(deliveryTypeId.value),
  paymentTypeId: Number(paymentTypeId.value),
  comment: comment.value,
}

onMounted(async () => {
  arrayDelivery.value = await getDeliveries()
})

const radioButtonDelivery = async (event: any) => {
  flag.value = true
  if (event.target.value === "Самовывоз") {
    deliveryTypeId.value = arrayDelivery.value[0].id;
     delType.value = "Самовывоз"
  } else {
    deliveryTypeId.value = arrayDelivery.value[1].id;
      delType.value = "Доставка курьером"
  }

  basket.deliveryTypeId = deliveryTypeId.value
  paymentArray.value = await getPayments(deliveryTypeId)
}
///////////      Запрос списка товаров из корзины ////////

const getBask = async () => {
  products.value = await getBaskets();
  const productsInLocalStorage = localStorage.getItem('basket');
  if (productsInLocalStorage) {
    products.value = JSON.parse(productsInLocalStorage);
  }
  basket.arr = products.value  //добавление товаров  в хранилище корзины

  // пересчет корзины
  sum.value = Number(basket.summa)
  products.value = basket.arr
}

getBask();

const radioButtonPayment = (event: any) => {
  paymentArray.value.forEach((pay) => {
    if (pay.id == event.target.id) {
      paymentTypeId.value = pay.id
      if (paymentTypeId.value === 1) {
        payType.value = "Оплата картой"
      }
      else {
        payType.value = "Оплата наличными"
      }
      basket.payType = payType.value

    }
  })
}

function test() {
  let result = true;
  if (paymentTypeId.value === 0 && deliveryTypeId.value === 0) {
    result = false;
    error.value = "Выберите способы оплаты и доставки"
  }
  if (paymentTypeId.value === 0 && deliveryTypeId.value !== 0) {
    result = false;
    error.value = "Выберите способ оплаты"
  }
  if (deliveryTypeId.value === 0 && paymentTypeId.value !== 0) {
    result = false;
    error.value = "Выберите способ доставки"

  }
  inputArray.value.forEach((input) => {
    input.error = ''
  })

  const validText = (comment: any) => {
    return /[а-я]/i.test(comment);
  }

  function validNumberPhone(phone: any) {
    const regex = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/;  // для формата +7(999)000-00-00
    return regex.test(phone);
  }

  function validEmail(Email: any) {
    const pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(String(Email).toLowerCase());
  }
  const object = () => {

    objectData.value = {
      name: inputArray.value[0].val,
      address: inputArray.value[1].val,
      phone: String(inputArray.value[2].val),
      email: inputArray.value[3].val,
      deliveryTypeId: Number(deliveryTypeId.value),
      paymentTypeId: Number(paymentTypeId.value),
      comment: comment.value,
    }

    //Проверка текстовых полей
    inputArray.value.forEach((input) => {

      if (input.val === '') {
        input.error = 'Поле не заполнено'
        result = false;
        return result;
      }
      if (input.val !== '') {
        if (input.name === 'name') {
          const resName = validText(inputArray.value[0].val);
          if (resName === false) {
            inputArray.value[0].error = 'Введите ФИО на кириллице'
            result = false;
            return result
          }
          return result;
        }
        if (input.name === 'address') {
          const resAddress = validText(inputArray.value[1].val);
          if (resAddress === false) {
            inputArray.value[1].error = 'Введите адрес на кириллице'
            result = false;
            return result
          }
          return result;
        }
        if (input.name === 'phone') {
          const resPhone = validNumberPhone(inputArray.value[2].val);
          if (resPhone === false) {
            inputArray.value[2].error = 'введите номер телефона в формате +7(999)000-00-00'
            result = false;
            return result
          }
          return result;
        }
        if (input.name === 'email') {
          const resEmail = validEmail(inputArray.value[3].val);
          if (resEmail === false) {
            inputArray.value[3].error = 'Адрес электронной почты введен неверно'
            result = false;
            return result
          }
          return result;
        }
      }
      return result;
    })
  }
  object()

  return result;
}
const succesOrder = async (event: any) => {
  if (test() === false) {
    event.preventDefault();
    isTest.value = true
  }
  if (test()) {
    objectData.value = {
      name: inputArray.value[0].val,
      address: inputArray.value[1].val,
      phone: String(inputArray.value[2].val),
      email: inputArray.value[3].val,
      deliveryTypeId: Number(deliveryTypeId.value),
      paymentTypeId: Number(paymentTypeId.value),
      comment: comment.value,
    }
    basket.objectData = objectData.value
    const obj = await postOrder(objectData.value)
    basket.obj = obj
  }
}
const objectDataInLocalStorage = localStorage.getItem('order');
if (objectDataInLocalStorage) {
  const objectData = JSON.parse(objectDataInLocalStorage);
  inputArray.value[0].val = objectData[0];
  inputArray.value[1].val = objectData[1];
  inputArray.value[2].val = objectData[2];
  inputArray.value[3].val = objectData[3];
  comment.value = objectData[4]
}
</script>

<style scoped>
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
.options__radio:checked~.options__value::before {
  border: 4px solid #fff;
}
.button--primery:not(:disabled):focus,
.button--primery:not(:disabled):hover {
  background-color: #150c26;
}
.cart__error-none {
  display: none;
}
</style>