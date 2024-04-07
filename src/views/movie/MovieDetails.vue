<script setup>
import {computed, onMounted, ref} from 'vue';
import {useStore} from "vuex";
import TmdbAPI from "@/services/TmdbAPI.js";
import {formatReleaseDate, transformRuntime, transformVoteAvg, transformVoteCt} from "@/custom-objects/Utils.js";

const store = useStore();
const props = defineProps(['movieId']);

const theMovie = ref('');
const posterUrl = ref('');
const backdropUrl = ref('');
const director = ref('');
const topCast = ref([]);
const keywords = ref([]);

const isLoggedIn = computed(() => {
  return store.getters.isAuthenticated;
})

const redirectLink = computed(() => {
  return '/login?redirect=movie/' + props.movieId;
})

function addWatchedMovie() {
  store.dispatch('movieLists/addWatchedMovie', theMovie.value)
}
function removeWatchedMovie() {
  store.dispatch('movieLists/removeWatchedMovie', parseInt(props.movieId));
}
function addGottaWatchMovie() {
  store.dispatch('movieLists/addGottaWatchMovie', theMovie.value)
}
function removeGottaWatchMovie() {
  store.dispatch('movieLists/removeGottaWatchMovie', parseInt(props.movieId));
}

function getDirector() {
  TmdbAPI.getDirector(props.movieId).then(r => {
    director.value = r;
  });
}

const watched = computed(() => {
  return store.getters["movieLists/watched"];
})

const gottaWatched = computed(() => {
  return store.getters["movieLists/gottaWatched"];
})

onMounted(() => {
  TmdbAPI.fetchSingleMovie(props.movieId)
      .then(response => {
        // TODO: validate url input
        theMovie.value = response;
        console.log(theMovie.value);
        posterUrl.value = TmdbAPI.getPosterImageUrl(theMovie.value.poster_path);
        backdropUrl.value = TmdbAPI.getBackdropImageUrl(theMovie.value.backdrop_path);
      }).catch(err => {
        console.error('AJAX QUERY ERROR', err);
  });
  TmdbAPI.getTopCast(props.movieId).then(r => {
    let output = null;
    r.forEach(person => {
      output = {
        info: person,
        profileImageUrl: TmdbAPI.getPeopleProfileImg(person.profile_path)
      }
      topCast.value.push(output);
    })
  });
  TmdbAPI.getKeyWords(props.movieId).then(r => {
    keywords.value = r;
  });
  store.dispatch('movieLists/getWatchedStatus', parseInt(props.movieId));
  store.dispatch('movieLists/getGottaWatchStatus', parseInt(props.movieId));
})

getDirector();
</script>

<template>
  <article class="bg-gray-950">
    <section
        class="px-6 py-10 bg-cover bg-center bg-no-repeat flex md:flex-row sm:flex-col"
        :style="'background-image: linear-gradient(rgba(3,7,18,0.75),\n'+'rgba(3,7,18,1)), url(\'' + backdropUrl + '\'); height: auto;'">
      <img class="max-w-[20rem] md:w-1/3 h-full rounded-lg mr-6" :src="posterUrl" :alt="theMovie.title + ' poster'" />
      <div class="movie-meta text-gray-300">
        <h1 class="text-[2.5em] text-gray-50 font-bold tracking-wide mb-2">{{ theMovie.title }} <span class="font-thin">({{ parseInt(theMovie.release_date) }})</span></h1>
        <p class="mb-2">Directed by <span class="font-semibold">{{ director }}</span></p>
        <p class="mb-3 tracking-wide">
          <span class="mr-2">{{ formatReleaseDate(theMovie.release_date) }}</span>
          <span v-if="theMovie.runtime !== 0" class="mr-2">
            <span class="mr-2">&#8226;</span>
            <span>{{ transformRuntime(theMovie.runtime) }}</span>
          </span>
          <span>
            <span class="mr-2">&#8226;</span>
            <font-awesome-icon class="text-yellow-300 mr-1" :icon="['fas', 'star']" />
            {{ transformVoteAvg(theMovie.vote_average) }}
            ({{ transformVoteCt(theMovie.vote_count, 1) }})
          </span>
        </p>
        <p class="uppercase tracking-wide mb-3">{{ theMovie.tagline }}</p>
        <span v-for="(item, index) in theMovie.genres"
                :key="index"
                class="text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-400 border-2 border-gray-300">
          {{ item.name }}
        </span>
        <h2 class="text-2xl font-semibold mt-3 mb-1">Overview</h2>
        <p class="pr-6">{{ theMovie.overview }}</p>
        <div
            class="login-actions mt-3"
            v-if="!isLoggedIn"
        >
          <button
              type="button"
              class="text-gray-300 border-[1px] border-gray-300 rounded-full bg-gray-5/20 py-2 px-5 backdrop-blur-md hover:bg-gray-400/30 mr-2"
          >
            <router-link :to="redirectLink">
              Login for further actions
            </router-link>
          </button>
        </div>
        <div class="actions mt-3" v-else>
          <button
              class="text-gray-300 border-[1px] border-gray-300 rounded-full bg-gray-5/20 py-2 px-5 backdrop-blur-md hover:bg-gray-400/30 mr-2"
              v-if="!watched"
              @click="addWatchedMovie"
          >
            <font-awesome-icon :icon="['fas', 'check']" /> Watched
          </button>
          <button
              type="button"
              v-else
              class="text-gray-950 border-[1px] border-gray-300 rounded-full bg-gray-100 py-2 px-5 backdrop-blur-md mr-2"
              @click="removeWatchedMovie"
          ><font-awesome-icon :icon="['fas', 'check']" /> Watched</button>
          <button
              type="button"
              v-if="!gottaWatched"
              class="text-gray-300 border-[1px] border-gray-300 rounded-full bg-gray-5/20 py-2 px-5 backdrop-blur-md hover:bg-gray-400/30 mr-2"
              @click="addGottaWatchMovie"
          ><font-awesome-icon :icon="['far', 'bookmark']" /> Gotta watch</button>
          <button
              type="button"
              v-else
              class="text-gray-950 border-[1px] border-gray-300 rounded-full bg-gray-100 py-2 px-5 backdrop-blur-md mr-2"
              @click="removeGottaWatchMovie"
          ><font-awesome-icon :icon="['fas', 'bookmark']" /> Gotta watch</button>
        </div>
      </div>
    </section>
    <section class="h-full bg-gray-950 text-gray-300">
      <div class="px-6 py-5">
        <h2 class="text-2xl font-semibold mb-5">Keywords</h2>
        <ul class="flex flex-wrap">
          <li v-for="item in keywords" class="keywords bg-gray-700 px-2 py-1 mr-2 mb-2 text-sm rounded-md hover:text-gray-50 cursor-pointer">{{ item.name }}</li>
        </ul>
      </div>
      <div class="px-6 py-5">
        <h2 class="text-2xl font-semibold mb-5">Top Cast</h2>
        <ul class="grid grid-cols-2 xl:grid-cols-5 md:grid-cols-3">
          <li v-for="(item, key) in topCast" class="flex flex-col flex-2 mr-3 mb-7">
            <div class="w-full flex justify-center">
              <div class="w-[9rem] h-[9rem] overflow-hidden rounded-full items-center">
                <img v-if="!item.profileImageUrl.includes('https://')" :src="item.profileImageUrl">
                <img v-else :src="item.profileImageUrl" class="relative -top-5 scale-110">
              </div>
            </div>
            <span class="flex flex-col items-center tracking-wide">
              <span class="font-semibold text-gray-50">{{ item.info.original_name }}</span>
              <span class="font-light">{{ item.info.character }}</span>
            </span>
          </li>
        </ul>
      </div>
    </section>
  </article>
</template>

<style scoped>
.keywords {
  box-shadow: inset 0 1px 0 hsla(0,0%,100%,.05);
}
</style>
