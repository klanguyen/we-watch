<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TmdbAPI from "@/services/TmdbAPI.js";

const router = useRouter();

const posterUrl = ref('');
const genres = ref([])

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

function toDetailsPage(id) {
  router.replace(`/movie/${id}`);
}

onMounted(() => {
  posterUrl.value = TmdbAPI.getPosterImageUrl(props.movie.poster_path);

  if(props.movie.genre_ids !== undefined) {
    TmdbAPI.getGenreName(props.movie.genre_ids)
        .then(response => {
          genres.value = response;
        })
        .catch(err => {
          console.error('Failed to load genres', err);
        });

  } else {
    (props.movie.genres).forEach(genre => {
      genres.value.push(genre.name);
    })
  }
})

</script>

<template>
  <div class="w-64" @click="toDetailsPage(props.movie.id)">
    <div class="bg-gray-300 w-full h-auto p-4 rounded-lg shadow-md">
      <img :src="posterUrl" class="rounded-lg shadow mb-2" :alt="props.movie.title + ' poster'">
      <h1 class="text-sm font-semibold text-gray-950 tracking-wide">{{ props.movie.title }}</h1>
      <h2
          class="text-xs text-gray-950 tracking-wide mb-2"
      >{{ genres.join(', ') }} </h2>
      <span class="my-1 px-4 py-1 text-sm rounded-lg bg-yellow-500 rating-badge shadow">{{ Math.round(props.movie.vote_average*10)/10 }}</span>
    </div>
  </div>
</template>

<style scoped>

</style>
