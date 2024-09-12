<template>
    <div>
        <h3>Информация о товаре</h3>
        <table class="table">
            <tbody class="table-container">
                <tr class="about__seasons">
                    <th class="about__seasons-title">Сезон</th>
                    <td class=''>{{ arraySeosons }}</td>
                </tr>
                <tr class="about__materials">
                    <th class="about__materials-title">Материал</th>
                    <td>{{ arrayMaterials }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { useCounterStore } from "@/stores/counter"
import { ref } from 'vue'
const counter = useCounterStore();
const seasons = ref([]);
const materials = ref({});
const arraySeosons = ref([]);
const arrayMaterials = ref([]);

const getSeasons = async () => {
    await counter.loadProduct(counter.productId)
    seasons.value = counter.seasons
    seasons.value.forEach((el: any) => {
        arraySeosons.value.push(el.title);
        arraySeosons.value.toString();

    })
    arraySeosons.value = arraySeosons.value.toString().toLowerCase().replace(",", "-")

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    materials.value = counter.materials
    materials.value.forEach((el: any) => {
        arrayMaterials.value.push(el.title)
        arrayMaterials.value.toString();
    })
    arrayMaterials.value = arrayMaterials.value.toString().toLowerCase().replace(",", ", ");
}
getSeasons()

</script>





<style scoped>
h3 {
    margin-bottom: 15px;
    font-weight: 600;
}

ul {
    list-style: none;
    padding: 0;
}

.table {
    width: 100%;
}



th {
    width: 50%;
    text-align: start;
}

.container {
    margin-bottom: 30px;
    width: 200px;
    display: flex;
}

.about__box {
    display: flex;
    flex-direction: column
}

.about__box1 {
    display: flex;
}

.about__b {
    display: flex;
    width: 200px;
}

.about__item {
    display: flex;
    gap: 20px;
    height: 50%;
    padding: 12px 0;
    border-bottom: 1px solid;
}

.about__item-title {
    opacity: 0.7;
}

.about__seasons-title,
.about__materials-title {
    position: relative;
}

.about__seasons-title::after,
.about__materials-title::after {
    margin-left: 50px;
    content: "";
    display: block;
    width: 80%;
    height: 20px;
    position: absolute;
    left: 0;
    bottom: 5px;
    border-bottom: 1px dashed #d3d4dd;

}

.about__materials-title::after {
    margin-left: 75px;
    width: 72%;
}
</style>