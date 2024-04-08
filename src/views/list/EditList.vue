<script setup>
import {computed, ref} from 'vue';
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import AddAMovieBar from "@/components/movie-lists/AddAMovieBar.vue";
import TmdbAPI from "@/services/TmdbAPI.js";

const store = useStore();
const router = useRouter();
const props = defineProps(['listId']);
const isLoading = ref(false);
const error = ref(null);
const listTitle = ref('');
const listDescription = ref('');
const isPublic = ref(true);
const formIsValid = ref(true);
const selectedMovies = ref([]);
const selectedMoviesId = ref([]);
const theList = ref(null);
const moviesInTheList = ref(null);


function viewList() {
  router.push('/list/' + props.listId);
}

function deleteList() {
  store.dispatch('movieLists/deleteList', props.listId);
  router.push('/user/lists');
}

function validateForm() {
  formIsValid.value = !(listTitle.value === '' || listDescription.value === '');
}

function submitEditForm() {
  console.log('Submitting..');
  validateForm();

  if(formIsValid.value) {
    let piclUrl = TmdbAPI.getPosterImageUrl(selectedMovies.value[0].poster_path);
    store.dispatch('movieLists/editList', {
      listId: props.listId,
      listTitle: listTitle.value,
      listDescription: listDescription.value,
      isPublic: isPublic.value,
      selectedMovies: selectedMovies.value,
      selectedMovieIds: selectedMoviesId.value,
      thumbnailUrl: piclUrl
    });
    router.push('/list/' + props.listId);
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

async function loadList() {
  isLoading.value = true;
  try {
    await store.dispatch('movieLists/fetchSingleList', props.listId);
  } catch(e) {
    error.value = e.message || 'Something failed';
  }
  isLoading.value = false;


  theList.value = store.getters["movieLists/theList"];
  moviesInTheList.value = store.getters["movieLists/theListMovies"];
  listTitle.value = theList.value.title;
  listDescription.value = theList.value.description;
  isPublic.value = theList.value.isPublic;
}

loadList();
</script>

<template>
  <section class="px-6 py-3">
      <h1 class="text-[2.5em] font-semibold mb-3">Edit list</h1>
      <base-spinner v-if="isLoading"></base-spinner>
      <form v-else @submit.prevent="submitEditForm">
        <div class="mb-3">
          <label for="listTitle" class="block mb-1 font-medium text-gray-900 dark:text-gray-5">List Title</label>
          <input
              class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              type="text"
              id="listTitle"
              v-model.trim="listTitle"
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
              id="listDescription"
              rows="5"
              v-model.trim="listDescription"
          ></textarea>
        </div>
        <p v-if="!formIsValid">Please fix the above errors and submit again.</p>
        <add-a-movie-bar
            :movies="moviesInTheList"
            @on-view-list="viewList"
            @on-submit="getSelectedMovies"
            @on-delete="deleteList"
        ></add-a-movie-bar>
      </form>
  </section>
</template>

<style scoped>
</style>
