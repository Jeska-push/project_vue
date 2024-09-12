<template>
  <div class="container">
    <the-header />
    <div class="flex">
      <router-view />
    </div>
    <the-footer />
  </div>
</template>




<script setup lang="ts">

import { RouterView } from 'vue-router'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'

</script>





<style scoped>
.container {
  padding: 20px;
  flex-direction: column;
}

.flex {
  display: flex;
  gap: 30px;
}
</style>



