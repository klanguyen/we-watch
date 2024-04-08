<script setup>
import {ref} from 'vue';
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import AddAMovieBar from "@/components/movie-lists/AddAMovieBar.vue";
import TmdbAPI from "@/services/TmdbAPI.js";

const store = useStore();
const router = useRouter();

const listTitle = ref('');
const listDescription = ref('');
const isPublic = ref(true);
const formIsValid = ref(true);
const selectedMovies = ref([]);
const selectedMoviesId = ref([]);

function backToLists() {
  router.back();
}

function validateForm() {
  formIsValid.value = !(listTitle.value === '' || listDescription.value === '');
}

function submitForm() {
  console.log('Submitting..');
  validateForm();

  if(formIsValid.value) {
    let picUrl = TmdbAPI.getPosterImageUrl(selectedMovies.value[0].poster_path);
    store.dispatch('movieLists/createList', {
      listTitle: listTitle.value,
      listDescription: listDescription.value,
      isPublic: isPublic.value,
      selectedMovies: selectedMovies.value,
      selectedMovieIds: selectedMoviesId.value,
      thumbnailUrl: picUrl
    });
    router.replace('/user/lists');
  }
}

function getSelectedMovies(movies) {
  if(movies.length > 0) {
    movies.forEach(movie => {
      selectedMovies.value.push(movie);
      selectedMoviesId.value.push(movie.id);
    });
  }
}
</script>

<template>
  <section class="px-6 py-3">
    <h1 class="text-[2.5em] font-semibold mb-3">Create a new list</h1>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="listTitle" class="block mb-1 font-medium text-gray-900 dark:text-gray-5">List Title</label>
        <input
            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            type="text"
            id="listTitle"
            v-model.trim="listTitle"
            placeholder="Type a list title"
        />
      </div>
      <div class="mb-3">
        <input
            type="checkbox"
            id="isPublic"
            v-model="isPublic"
            class="w-4 h-4 text-gray-950 bg-gray-100 border-gray-300 rounded focus:ring-gray-950 dark:focus:ring-gray-950 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label for="isPublic" class="ms-2 font-medium text-gray-900 dark:text-gray-300">Public list</label>
      </div>
      <div class="mb-3">
        <label for="listDescription" class="block mb-1 font-medium text-gray-900 dark:text-gray-5">List Description</label>
        <textarea
            class="block p-2.5 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-gray-600 focus:border-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Your description here"
            id="listDescription"
            rows="5"
            v-model.trim="listDescription"
        ></textarea>
      </div>
      <p v-if="!formIsValid">Please fix the above errors and submit again.</p>
      <add-a-movie-bar
          @on-cancel="backToLists"
          @on-submit="getSelectedMovies"
      ></add-a-movie-bar>
    </form>
  </section>
</template>

<style scoped>

</style>
