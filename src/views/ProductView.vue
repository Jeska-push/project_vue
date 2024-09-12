<template>


    <product-card />

    <router-view />


</template>

<script setup lang="ts">


import ProductCard from '@/components/ProductCard.vue'

</script>
<style scoped>
.container {
    width: 80%;
}


</style>