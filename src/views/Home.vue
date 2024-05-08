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
              popularMovies.value = popularMovies.value.slice(0, 10);
            }
          })
          .catch(err => {
            console.error('Failed loading popular movies', err);
          });
  TmdbAPI.fetchNowPlayingMovies()
      .then(response => {
        if(response.total_results > 0) {
          nowPlayingMovies.value = response.results;
          nowPlayingMovies.value = nowPlayingMovies.value.slice(0, 10);
        }
      })
      .catch(err => {
        console.error('Failed loading now playing movies', err);
      });
  TmdbAPI.fetchTopRatedMovies()
      .then(response => {
        if(response.total_results > 0) {
          topRatedMovies.value = response.results;
          topRatedMovies.value = topRatedMovies.value.slice(0, 10);
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

          upcomingMovies.value = upcomingMovies.value.slice(0, 10);
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
    <div v-if="isLoggedIn" class="px-6 py-12 mb-3 bg-gray-950 text-gray-300">
      <h1 class="text-[2em] font-semibold tracking-wide mb-2">Welcome back, {{ currentUser.username }}!</h1>
      <p class="">Check out these movies!</p>
    </div>
    <div v-else class="px-6 py-12 mb-3 bg-gray-950 text-gray-300">
      <h1 class="text-[2em] font-semibold tracking-wide mb-2">Your movie library</h1>
      <p class="">Movies are better when we watch together!</p>
    </div>
    <div class="px-6 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-2xl font-semibold text-gray-950 tracking-wider">Popular</h2>
      </div>
      <div class="w-full flex flex-row flex-nowrap overflow-x-auto">
        <!-- card item -->
        <movie-item
            v-for="(item, index) in popularMovies"
            :key="item.id"
            :movie="item"></movie-item>
      </div>
    </div>

    <div class="px-6 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-2xl font-semibold text-gray-950 tracking-wider">Now Playing</h2>
      </div>
      <div class="w-full flex flex-row flex-nowrap overflow-x-auto">
        <!-- card item -->
        <movie-item
            v-for="(item, index) in nowPlayingMovies"
            :key="item.id"
            :movie="item"></movie-item>
      </div>
    </div>

    <div class="px-6 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-2xl font-semibold text-gray-950 tracking-wider">Top Rated</h2>
      </div>
      <div class="w-full flex flex-row flex-nowrap overflow-x-auto">
        <!-- card item -->
        <movie-item
            v-for="(item, index) in topRatedMovies"
            :key="item.id"
            :movie="item"></movie-item>
      </div>
    </div>

    <div class="px-6 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-2xl font-semibold text-gray-950 tracking-wider">Upcoming</h2>
      </div>
      <div class="w-full flex flex-row flex-nowrap overflow-x-auto">
        <!-- card item -->
        <movie-item
            v-for="(item, index) in upcomingMovies"
            :key="item.id"
            :movie="item"></movie-item>
      </div>
    </div>

<!--    <div v-if="isLoggedIn" class="px-6 py-3">
      <div class="pl-2 mb-3">
        <h2 class="text-2xl font-semibold text-gray-950 tracking-wider hover:underline cursor-pointer">Made for {{ currentUser.username }}</h2>
        <h3 class="text-sm text-gray-950">Get better recommendations the more you watch.</h3>
      </div>
      <div class="w-full flex flex-wrap justify-between">
        &lt;!&ndash; card item &ndash;&gt;
        &lt;!&ndash; TODO: adjust the amount of movies showing by size &ndash;&gt;
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
    </div>-->

<!--    <div class="px-6 py-3">
      <swiper-container class="topRatedSwiper" pagination-type="progressbar" navigation="true" slides-per-view="auto" space-between="10" free-mode="true">
        <swiper-slide v-for="(item, index) in topRatedMovies"
                      :key="item.id">
          <movie-item
            :movie="item"></movie-item>
        </swiper-slide>
      </swiper-container>
    </div>-->
  </section>
</template>

<style scoped>

</style>
