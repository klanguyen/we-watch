<script setup>
import {useStore} from "vuex";
import {computed, onBeforeMount, onMounted} from "vue";
import MovieItem from "@/components/movie/MovieItem.vue";

const store = useStore();

const gottaWatchList = store.getters["movieLists/gottaWatchList"];
const hasMovies = computed(() => {
  return gottaWatchList.length !== 0;
})

onBeforeMount(() => {
  store.commit('movieLists/setGottaWatchList', []);
})

onMounted(() => {
  store.dispatch('movieLists/fetchGottaWatchList');
})
</script>

<template>
  <article>
    <section class="px-6 py-12 mb-3 bg-gray-950 text-gray-300">
      <h1 class="text-[2.5em] font-semibold text-gray-50 tracking-wide mb-2">Gotta Watch List</h1>
      <p>Movies you've got to watch.</p>
    </section>
    <section class="px-6 py-5">
      <div v-if="!hasMovies">
        <p>You don't have any movie yet</p>
      </div>
      <div
          v-else
          class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <movie-item
            v-for="(item, index) in gottaWatchList"
            :key="index"
            :movie="item"></movie-item>
      </div>
    </section>
  </article>
</template>

<style scoped>

</style>
