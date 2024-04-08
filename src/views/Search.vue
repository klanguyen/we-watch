<script setup>
import SearchBar from "@/components/ui/SearchBar.vue";
import {onMounted, ref} from "vue";
import TmdbAPI from "@/services/TmdbAPI.js";

const genresList = ref([]);

onMounted(() => {
  TmdbAPI.getGenreOfficialLists()
      .then(results => {
        results.forEach(result => {
          let icon = (result.name).replace(/\s+/g, '-').toLowerCase();
          let genre = {
            result,
            icon
          };

          genresList.value.push(genre);
        })
      });
})
</script>

<template>
<!--  <base-card>
    <h2>Search for a movie</h2>
    <search-bar></search-bar>
  </base-card>-->
  <article class="px-6 py-3">
    <h1 class="text-2xl font-semibold mb-3">Search</h1>
    <search-bar></search-bar>
    <h2 class="text-xl font-semibold mb-3">Browse All</h2>
    <div class="flex flex-wrap">
      <div v-for="genre in genresList" class="bg-gray-50 border-[1px] border-zinc-500 backdrop-blur-md rounded-lg flex justify-center p-4 mr-4 mb-3 hover:brightness-90">
        <img class="h-8 w-8 mr-2" :src="'./src/assets/img/genres/' + genre.icon + '.png'">
        <span class="pt-1">{{ genre.result.name }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>

</style>
