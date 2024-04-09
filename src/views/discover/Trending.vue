<script setup>
import {onMounted, ref} from "vue";
import TmdbAPI from "@/services/TmdbAPI.js";
import MovieItem from "@/components/movie/MovieItem.vue";

const trendingMovies = ref([]);
const trendingPeople = ref([]);

onMounted(() => {
  TmdbAPI.fetchTrendingMovies().then(r => {
    trendingMovies.value = r;
  })
  TmdbAPI.fetchTrendingPeople().then(r => {
    let output = null;
    let movieCollection = [];
    r.forEach(person => {
      (person.known_for).forEach(movie => {
        if(movie.name){
          movieCollection.push(movie.name);
        } else if (movie.title) {
          movieCollection.push(movie.title);
        }
      })
      output = {
        info: person,
        movies: movieCollection.slice(0,3),
        profileImageUrl: TmdbAPI.getPeopleProfileImg(person.profile_path)
      }
      trendingPeople.value.push(output);
      movieCollection = []
    })
  })
})
</script>

<template>
  <article class="">
    <section class="px-6 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-2xl font-semibold text-gray-950 tracking-wider hover:underline cursor-pointer">Trending movies</h2>
      </div>
      <div class="w-full flex flex-row flex-nowrap overflow-x-auto">
        <!-- card item -->
        <movie-item
            v-for="(item, index) in trendingMovies"
            :key="item.id"
            :movie="item"></movie-item>
      </div>
    </section>
    <section class="px-6 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-2xl font-semibold text-gray-950 tracking-wider hover:underline cursor-pointer">Trending people</h2>
      </div>
      <div class="w-full flex flex-row flex-nowrap overflow-x-auto">
        <ul class="block lg:grid lg:grid-cols-2">
          <li v-for="(item, key) in trendingPeople" class="flex flex-row mr-3 mb-7 items-center">
            <div class="flex mr-3">
              <div class="w-[9rem] h-[9rem] overflow-hidden rounded-full">
                <img v-if="!item.profileImageUrl.includes('https://')" :src="item.profileImageUrl">
                <img v-else :src="item.profileImageUrl" class="relative -top-5 scale-100">
              </div>
            </div>
            <span class="flex flex-col tracking-wide">
              <span class="font-semibold text-lg text-gray-950">{{ item.info.original_name }}</span>
              <span class="font-light text-sm">{{ item.movies.join(', ') }}</span>
            </span>
          </li>
        </ul>
      </div>
    </section>
  </article>
</template>

<style scoped>

</style>
