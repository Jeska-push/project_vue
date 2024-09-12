<template>

  <header class="header container">
    <div class="header__wrapper">
      <router-link :to="{ name: 'catalog' }" class="header__info">Каталог</router-link>
      <a class="header__logo" href="#">
        <img src="../assets/img/svg/logo-moire.svg" alt="Логотип интернет магазина Moire" width="116" height="34">
      </a>

      <a class="header__tel" href="tel:8 800 600 90 09">
        8 800 600 90 09
      </a>
      <div class="header__icon">
        <span class="header__search"><img src="../assets/icon/icons8-лупа-24.png" alt=""></span>

        <router-link :to="{ name: 'basket' }" class="header__cart" href="#" aria-label="Корзина с товарами">
          <img src="../assets/icon/icons8-корзина-24.png" alt="">
          <a v-if="basket.arr.length !== 0" class="header__count" aria-label="Количество товаров">{{ basket.arr.length
            }}</a>
        </router-link>
      </div>
    </div>
  </header>

</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useBasketStore } from "@/stores/basket"
const basket = useBasketStore();
</script>

<style scoped>
.header {
  background-color: #fff;
}

.header__wrapper {
  display: grid;
  grid-template-columns: 380px 1fr 300px 25px;
  grid-column-gap: 40px;
  -webkit-box-align: end;
  -ms-flex-align: end;
  align-items: flex-end;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding-top: 23px;
  padding-bottom: 23px;
  border-bottom: 1px solid #e9e9e9;
}

.header__info {
  font-size: 12px;
  text-transform: uppercase;
}

.header__logo {
  display: block;
  width: 190px;
  height: 33px;
  margin: 0 auto;
}

.header__tel {
  margin-left: auto;
  font-size: 14px;
  color: #000;
}

.header__icon {
  position: relative;
  display: flex;
  gap: 10px;
  width: 100px;
  height: 100%;
}

.header__cart {
  position: relative;
}

.header__count {
  position: absolute;
  bottom: 20px;
  right: -5px;
  background-color: #e02d71;
  padding: 3px;
  min-width: 13px;
  height: 13px;
  border-radius: 50%;
  font-size: 7px;
  line-height: 1;
  font-weight: 500;
  color: #fff;
  text-align: center;
  text-decoration: none;
}
</style>
