<script setup>
import {useStore} from "vuex";
import {computed, onMounted} from "vue";
import MovieItem from "@/components/movie/MovieItem.vue";

const store = useStore();

const gottaWatchList = store.getters["movieLists/gottaWatchList"];
const hasMovies = computed(() => {
  return gottaWatchList.length !== 0;
})

onMounted(() => {
  store.dispatch('movieLists/fetchGottaWatchList');
})
</script>

<template>
  <div>
    <h1>Gotta Watch List</h1>
    <div v-if="!hasMovies">
      <p>You don't have any movie yet</p>
    </div>
    <div
        v-else
        class="w-full flex flex-wrap justify-between"
    >
      <movie-item
          v-for="(item, index) in gottaWatchList"
          :key="index"
          :movie="item"
      ></movie-item>
    </div>
  </div>
</template>

<style scoped>

</style>
