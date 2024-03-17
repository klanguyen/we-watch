<script setup>
import {onMounted, ref} from 'vue';
import TmdbAPI from "@/services/TmdbAPI.js";

const props = defineProps(['movieId']);
const theMovie = ref('');
const posterUrl = ref('');
const watched = ref(false);
const gottaWatch = ref(false);

function addWatchedMovie() {
  watched.value = true;
}
function removeWatchedMovie() {
  watched.value = false;
}
function addGottaWatchMovie() {
  gottaWatch.value = true;
}
function removeGottaWatchMovie() {
  gottaWatch.value = false;
}

onMounted(() => {
  TmdbAPI.fetchSingleMovie(props.movieId)
      .then(response => {
        // TODO: validate url input
        theMovie.value = response;
        posterUrl.value = TmdbAPI.getPosterImageUrl(theMovie.value.poster_path);
      }).catch(err => {
        console.error('AJAX QUERY ERROR', error);
  });
})
</script>

<template>
  <section>
    <h2>{{ theMovie.title }}</h2>
    <img :src="posterUrl" :alt="theMovie.title + ' poster'" />
    <p>{{ theMovie.overview }}</p>
    <ul
        v-for="(item, index) in theMovie.genres"
        :key="index"
    >
      <li>{{ item.name }}</li>
    </ul>
    <div class="actions">
      <base-button
          type="button"
          mode="flat"
          v-if="!watched"
          @click="addWatchedMovie"
      >
        <font-awesome-icon :icon="['fas', 'check']" /> Already watched
      </base-button>
      <base-button
          type="button"
          v-else
          @click="removeWatchedMovie"
      ><font-awesome-icon :icon="['fas', 'check']" /> Watched</base-button>
      <base-button
          type="button"
          mode="flat"
          v-if="!gottaWatch"
          @click="addGottaWatchMovie"
      ><font-awesome-icon :icon="['far', 'bookmark']" /> Want to watch</base-button>
      <base-button
          type="button"
          mode="flat"
          v-else
          @click="removeGottaWatchMovie"
      ><font-awesome-icon :icon="['fas', 'bookmark']" /> Want to watch</base-button>
    </div>
  </section>
</template>

<style scoped>

</style>
