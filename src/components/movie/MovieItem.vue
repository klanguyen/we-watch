<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TmdbAPI from "@/services/TmdbAPI.js";

const router = useRouter();

const posterUrl = ref('');

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
})
</script>

<template>
  <base-card @click="toDetailsPage(props.movie.id)">
    <h4>{{ props.movie.title }}</h4>
    <img :src="posterUrl" :alt="props.movie.title + ' poster'">
    <p>{{ props.movie.overview }}</p>
  </base-card>
</template>

<style scoped>

</style>
