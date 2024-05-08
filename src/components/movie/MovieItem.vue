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
  router.push(`/movie/${id}`);
}

// TODO: get this to work
// can't do it like this, it'll mess the button up
/*const watched = computed(() => {
  return store.getters["movieLists/watched"];
})

const gottaWatched = computed(() => {
  return store.getters["movieLists/gottaWatched"];
})*/

onMounted(() => {
  posterUrl.value = TmdbAPI.getPosterImageUrl(props.movie.poster_path);

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
  <div class="group/item w-48 md:w-60 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-5 mr-5 cursor-pointer min-w-48 md:min-w-60">
    <a @click="toDetailsPage(props.movie.id)" class="relative">
      <img class="rounded-t-lg hover:brightness-50" :src="posterUrl" :alt="props.movie.title + ' poster'" />
    </a>
    <div class="p-3 md:p-5">
      <a @click="toDetailsPage(props.movie.id)">
        <h5 class="mb-2 text-md sm:text-lg font-bold tracking-wide text-gray-900 dark:text-white">{{ props.movie.title }}</h5>
      </a>
      <p class="mb-3 font-normal text-xs sm:text-base text-gray-700 dark:text-gray-400">{{ genres.length > 0 ? genres.join(', ') : 'No genre specified' }}</p>
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
