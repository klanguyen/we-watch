<script setup>
import {ref, onMounted, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import TmdbAPI from "@/services/TmdbAPI.js";
import { FwbBadge } from 'flowbite-vue'
import {useStore} from "vuex";
import {transformVoteAvg} from "@/custom-objects/Utils.js";

const route = useRoute();
const router = useRouter();
const store = useStore();
const posterUrl = ref('');
const genres = ref([])

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})
function toDetailsPage(id) {
  // TODO: fix this bug, seems to not reload the page after router push
  router.push(`/movie/${id}`);
}

function addWatchedMovie() {
  store.dispatch('movieLists/addWatchedMovie', props.movie)
}
function removeWatchedMovie() {
  store.dispatch('movieLists/removeWatchedMovie', parseInt(props.movie.id));
}
function addGottaWatchMovie() {
  store.dispatch('movieLists/addGottaWatchMovie', props.movie)
}
function removeGottaWatchMovie() {
  store.dispatch('movieLists/removeGottaWatchMovie', parseInt(props.movie.id));
}

// TODO: get this to work
const watched = computed(() => {
  return store.getters["movieLists/watched"];
})

const gottaWatched = computed(() => {
  return store.getters["movieLists/gottaWatched"];
})

onMounted(() => {
  store.dispatch('movieLists/getWatchedStatus', parseInt(props.key));
  store.dispatch('movieLists/getGottaWatchStatus', parseInt(props.key));

  posterUrl.value = TmdbAPI.getPosterImageUrl(props.movie.poster_path);
  if(posterUrl.value === 'https://image.tmdb.org/t/p/w780null') {
    posterUrl.value = 'https://placehold.it/500x500';
  }

  if(props.movie.genre_ids) {
    if(props.movie.genre_ids.length > 0) {
      TmdbAPI.getGenreName(props.movie.genre_ids)
          .then(response => {
            genres.value = response;
          })
          .catch(err => {
            console.error('Failed to load genres', err);
          });
    } else {
      genres.value = [];
    }
  } else if(props.movie.genres) {
    (props.movie.genres).forEach(genre => {
      genres.value.push(genre.name);
    })
  }
})

</script>

<template>
  <div class="group/item w-60 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-5 cursor-pointer">
    <a @click="toDetailsPage(props.movie.id)" class="relative">
      <div class="w-full h-full flex justify-end items-start opacity-0 hover:opacity-100 p-4 absolute">
        <div class="border-[1px] border-white/20 bg-black/50 backdrop-blur-md rounded-lg flex justify-center h-6 w-6 p-4 mr-1">
          <font-awesome-icon class="p-3 self-center text-gray-50 hover:text-red-500 text-lg" :icon="['fas', 'heart']" />
        </div>
        <div v-if="!watched" class="border-[1px] border-white/20 bg-black/50 backdrop-blur-md rounded-lg flex justify-center h-6 w-6 p-4 mr-1" @click="addWatchedMovie">
          <font-awesome-icon class="p-3 self-center text-gray-50 hover:text-green-500 text-lg" :icon="['fas', 'eye']" />
        </div>

        <div v-else class="border-[1px] border-white/20 bg-black/50 backdrop-blur-md rounded-lg flex justify-center h-6 w-6 p-4 mr-1" @click="removeWatchedMovie">
          <font-awesome-icon class="p-3 self-center text-green-500 text-lg" :icon="['fas', 'eye']" />
        </div>
        <div v-if="!gottaWatched" class="border-[1px] border-white/20 bg-black/50 backdrop-blur-md rounded-lg flex justify-center h-6 w-6 p-4" @click="addGottaWatchMovie">
          <font-awesome-icon class="p-3 self-center text-gray-50 hover:text-yellow-200 text-lg" :icon="['fas', 'bookmark']" />
        </div>
        <div v-else class="border-[1px] border-white/20 bg-black/50 backdrop-blur-md rounded-lg flex justify-center h-6 w-6 p-4" @click="removeGottaWatchMovie">
          <font-awesome-icon class="p-3 self-center text-yellow-200 text-lg" :icon="['fas', 'bookmark']" />
        </div>
      </div>
      <img class="rounded-t-lg hover:brightness-50" :src="posterUrl" :alt="props.movie.title + ' poster'" />

    </a>
    <div class="p-5">
      <a @click="toDetailsPage(props.movie.id)">
        <h5 class="mb-2 text-lg font-bold tracking-wide text-gray-900 dark:text-white">{{ props.movie.title }}</h5>
      </a>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ genres.length > 0 ? genres.join(', ') : 'No genre specified' }}</p>
      <div class="flex">
        <fwb-badge size="sm" type="yellow">
          <template #icon>
            <font-awesome-icon :icon="['fas', 'star']" class="mr-1 pb-0.5 w-4 h-4" />
          </template>
          {{ transformVoteAvg(props.movie.vote_average) }}
        </fwb-badge>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
