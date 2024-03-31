<script setup>
import {useStore} from "vuex";
import {computed, onMounted} from "vue";
import MovieItem from "@/components/movie/MovieItem.vue";

const store = useStore();

const watchedList = store.getters["movieLists/watchedList"];
const hasMovies = computed(() => {
  return watchedList.length !== 0;
})

onMounted(() => {
  store.dispatch('movieLists/fetchWatchedList');
})
</script>

<template>
  <div>
    <h1>Watched List</h1>
    <div v-if="!hasMovies">
      <p>You don't have any movie yet</p>
    </div>
    <div
        v-else
        class="w-full flex flex-wrap justify-between"
    >
      <movie-item
          v-for="(item, index) in watchedList"
          :key="index"
          :movie="item"></movie-item>
    </div>
  </div>
</template>

<style scoped>

</style>
