<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import TmdbAPI from "@/services/TmdbAPI.js";
import MovieItem from "@/components/movie/MovieItem.vue";
import {mapState, useStore} from "vuex";

const store = useStore();
const isLoading = ref(false);
const popularMovies = ref([]);
const nowPlayingMovies = ref([]);
const topRatedMovies = ref([]);
const upcomingMovies = ref([]);

const isLoggedIn = computed(() => {
  return store.getters.isAuthenticated;
});

const currentUser = reactive({
  userId: computed(() => { return store.getters.userId}),
  email: computed(() => { return store.getters.email}),
  username: computed(() => { return store.getters.username}),
  profileImageUrl: computed(() => { return store.getters.profileImageUrl})
});

onMounted(() => {
  TmdbAPI.fetchPopularMovies()
          .then(response => {
            if(response.total_results > 0) {
              popularMovies.value = response.results;
              popularMovies.value = popularMovies.value.slice(0, 6);
            }
          })
          .catch(err => {
            console.error('Failed loading popular movies', err);
          });
  TmdbAPI.fetchNowPlayingMovies()
      .then(response => {
        if(response.total_results > 0) {
          nowPlayingMovies.value = response.results;
          nowPlayingMovies.value = nowPlayingMovies.value.slice(0, 6);
        }
      })
      .catch(err => {
        console.error('Failed loading now playing movies', err);
      });
  TmdbAPI.fetchTopRatedMovies()
      .then(response => {
        if(response.total_results > 0) {
          topRatedMovies.value = response.results;
          topRatedMovies.value = topRatedMovies.value.slice(0, 6);
        }
      })
      .catch(err => {
        console.error('Failed loading top rated movies', err);
      });
  TmdbAPI.fetchUpcomingMovies()
      .then(response => {
        if(response.total_results > 0) {
          (response.results).forEach(result => {
            upcomingMovies.value.push(result);
          });

          upcomingMovies.value = upcomingMovies.value.slice(0, 6);
        }
      })
      .catch(err => {
        console.error('Failed loading upcoming movies', err);
      });
})
</script>

<template>
  <!-- main content -->
  <section class="">
    <!-- cards -->
    <div class="px-6 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-2xl font-semibold text-gray-950 tracking-wider hover:underline cursor-pointer">Popular</h2>
        <h3 class="text-xs text-gray-950 uppercase tracking-wider hover:underline mb-3 cursor-pointer">See All</h3>
      </div>
      <div class="w-full flex flex-wrap justify-between">
        <!-- card item -->
        <!-- TODO: adjust the amount of movies showing by size -->
        <movie-item
            v-for="(item, index) in popularMovies"
            :key="index"
            :movie="item"></movie-item>
      </div>
    </div>

    <div class="px-6 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-2xl font-semibold text-gray-950 tracking-wider hover:underline cursor-pointer">Now Playing</h2>
        <h3 class="text-xs text-gray-950 uppercase tracking-wider hover:underline mb-3 cursor-pointer">See All</h3>
      </div>
      <div class="w-full flex flex-wrap justify-between">
        <!-- card item -->
        <!-- TODO: adjust the amount of movies showing by size -->
        <movie-item
            v-for="(item, index) in nowPlayingMovies"
            :key="index"
            :movie="item"></movie-item>
      </div>
    </div>

    <div class="px-6 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-2xl font-semibold text-gray-950 tracking-wider hover:underline cursor-pointer">Top Rated</h2>
        <h3 class="text-xs text-gray-950 uppercase tracking-wider hover:underline mb-3 cursor-pointer">See All</h3>
      </div>
      <div class="w-full flex flex-wrap justify-between">
        <!-- card item -->
        <!-- TODO: adjust the amount of movies showing by size -->
        <movie-item
            v-for="(item, index) in topRatedMovies"
            :key="index"
            :movie="item"></movie-item>
      </div>
    </div>

    <div class="px-6 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-2xl font-semibold text-gray-950 tracking-wider hover:underline cursor-pointer">Upcoming</h2>
        <h3 class="text-xs text-gray-950 uppercase tracking-wider hover:underline mb-3 cursor-pointer">See All</h3>
      </div>
      <div class="w-full flex flex-wrap justify-between">
        <!-- card item -->
        <!-- TODO: adjust the amount of movies showing by size -->
        <movie-item
            v-for="(item, index) in upcomingMovies"
            :key="index"
            :movie="item"></movie-item>
      </div>
    </div>

    <div v-if="isLoggedIn" class="px-6 py-3">
      <div class="pl-2 mb-3">
        <h2 class="text-2xl font-semibold text-gray-950 tracking-wider hover:underline cursor-pointer">Made for {{ currentUser.username }}</h2>
        <h3 class="text-sm text-gray-950">Get better recommendations the more you watch.</h3>
      </div>
      <div class="w-full flex flex-wrap justify-between">
        <!-- card item -->
        <!-- TODO: adjust the amount of movies showing by size -->
        <div class="w-48">
          <div class="bg-gray-300 w-full h-auto p-5 rounded-lg shadow-md">
            <img src="https://placehold.it/500x500" class="rounded-lg shadow mb-2">
            <h1 class="text-sm font-semibold text-gray-950 tracking-wide">Dune: Part Two </h1>
            <h2 class="text-xs text-gray-950 tracking-wide">2024</h2>
          </div>
        </div>
        <div class="w-48">
          <div class="bg-gray-300 w-full h-auto p-5 rounded-lg shadow-md">
            <img src="https://placehold.it/500x500" class="rounded-lg shadow mb-2">
            <h1 class="text-sm font-semibold text-gray-950 tracking-wide">Dune: Part Two </h1>
            <h2 class="text-xs text-gray-950 tracking-wide">2024</h2>
          </div>
        </div>
        <div class="w-48">
          <div class="bg-gray-300 w-full h-auto p-5 rounded-lg shadow-md">
            <img src="https://placehold.it/500x500" class="rounded-lg shadow mb-2">
            <h1 class="text-sm font-semibold text-gray-950 tracking-wide">Dune: Part Two </h1>
            <h2 class="text-xs text-gray-950 tracking-wide">2024</h2>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
