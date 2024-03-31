<script setup>
import {computed, onMounted, ref} from 'vue';
import {useStore} from "vuex";
import TmdbAPI from "@/services/TmdbAPI.js";
import BaseButton from "@/components/ui/BaseButton.vue";
import logger from "@fortawesome/vue-fontawesome/src/logger.js";

const store = useStore();
const props = defineProps(['movieId']);

const theMovie = ref('');
const posterUrl = ref('');

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
        posterUrl.value = TmdbAPI.getPosterImageUrl(theMovie.value.poster_path);
      }).catch(err => {
        console.error('AJAX QUERY ERROR', err);
  });
  store.dispatch('movieLists/getWatchedStatus', parseInt(props.movieId));
  store.dispatch('movieLists/getGottaWatchStatus', parseInt(props.movieId));
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
    <div
        class="login-actions"
        v-if="!isLoggedIn"
    >
      <base-button
          type="button"
          mode="flat"
          link :to="redirectLink"
      >Login for further actions</base-button>
    </div>
    <div class="actions" v-else>
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
          v-if="!gottaWatched"
          @click="addGottaWatchMovie"
      ><font-awesome-icon :icon="['far', 'bookmark']" /> Gotta watch</base-button>
      <base-button
          type="button"
          mode="flat"
          v-else
          @click="removeGottaWatchMovie"
      ><font-awesome-icon :icon="['fas', 'bookmark']" /> Gotta watch</base-button>
    </div>
  </section>
</template>

<style scoped>

</style>
