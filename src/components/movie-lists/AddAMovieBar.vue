<script setup>
import {computed, ref, watch} from "vue";
import {debounce} from "@/./custom-objects/Utils.js"
import TmdbAPI from "@/services/TmdbAPI.js"
import {useRoute} from "vue-router";

const route = useRoute();
const emit = defineEmits(['onSubmit', 'onCancel', 'onDelete', 'onViewList'])
const props = defineProps({
  movies: {
    type: Array,
    required: false,
    default: []
  },
})

const searchString = ref('');
const results = ref([]);
const selectedMovies = ref([]);
const isAlerting = ref(false);
const alertedMovieName = ref('');

const isEditing = computed(() => {
  return route.name === 'EditList';
})

function selectMovie(movie) {
  if(selectedMovies.value.filter(obj => obj.id === movie.id).length > 0) {
    alertedMovieName.value = movie.title;
    showAlert();
  }
  else {
    selectedMovies.value.push(movie);
  }
  searchString.value = '';
}
function search() {
  TmdbAPI.search(searchString.value)
      .then(response => {
        if(response.total_results > 0) {
          results.value = response.results;
        }
      }).catch(err => {
    console.error('AJAX QUERY ERROR', err);
  })
}

function getPosterUrl(posterPath) {
  return TmdbAPI.getPosterImageUrl(posterPath);
}

function takeOutAMovie(movieId) {
  selectedMovies.value = selectedMovies.value.filter(obj => obj.id !== movieId);
}

function showAlert() {
  isAlerting.value = true;
}

function getMoviesInTheList() {
  if(props.movies.length > 0) {
    selectedMovies.value = props.movies;
  }
}

getMoviesInTheList();
watch(searchString, debounce(() => {
  search();
}), 1000)
</script>

<template>
  <div class="add-movie-bar">
    <div class="flex flex-row">
      <div class="mb-3 flex-1 w-full">
        <label for="search" class="block mb-1 font-medium text-gray-900 dark:text-gray-5">Add a movie</label>
        <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            id="search"
            v-model.trim="searchString"
            placeholder="Enter name of movie"
        />
      </div>
      <div class="list-actions flex flex-row w-full justify-end items-end flex-1 mb-3">
        <button
            v-if="isEditing"
            class="text-gray-50 bg-red-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full px-5 py-2.5 text-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            @click="$emit('onDelete')"
        >
          Delete
        </button>
        <button
            v-if="isEditing"
            class="bg-inherit text-gray-950 rounded-full py-2.5 px-5 flex justify-center hover:scale-105 border border-gray-950 text-sm me-2"
            @click="$emit('onViewList')"
        >
          View List
        </button>
        <span v-else class="mr-2">
          <button
              class="bg-inherit text-gray-950 rounded-full py-2.5 px-5 flex justify-center hover:scale-105 border border-gray-950"
              @click="$emit('onCancel')"
          >
            Cancel
          </button>
        </span>
        <button
            @click="$emit('onSubmit', selectedMovies)"
            class="bg-gray-950 text-gray-50 rounded-full py-2.5 px-5 flex justify-center hover:scale-105 pl-4"
        >
          Save list
        </button>
      </div>
    </div>
    <div
        v-if="isAlerting"
        id="alert-border"
        class="flex items-center p-4 mb-4 text-yellow-800 border-t-4 border-yellow-300 bg-yellow-50 dark:text-yellow-300 dark:bg-gray-800 dark:border-yellow-800"
        role="alert"
    >
      <svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <div class="ms-3 text-sm font-medium">
        <strong>{{alertedMovieName}}</strong> is already in the list!
      </div>
      <button
          type="button"
          class="ms-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700" data-dismiss-target="#alert-border"
          aria-label="Close"
          @click="isAlerting = false"
      >
        <span class="sr-only">Dismiss</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
    <div v-if="results.length && searchString !== ''"
        class="results-list mb-3">
      <div
          class="result-item flex flex-row items-center"
          v-for="result in results"
          :key="result.id"
          @click="selectMovie(result)"
      >
        <img class="search-img mr-3" :src="getPosterUrl(result.poster_path)" />
        <span class="">
          <p class="movie-name mb-0">{{ result.title }}</p>
          <span>({{parseInt(result.release_date)}})</span>
        </span>
      </div>
    </div>
    <div class="movies-in-list" v-if="selectedMovies.length > 0">
      <div
          v-for="movie in selectedMovies"
          class="movie-item-in-list flex flex-row items-center justify-between"
      >
        <div class="flex flex-row items-center">
          <img :src="getPosterUrl(movie.poster_path)" class="mr-3" />
          <div class="flex flex-col">
            <p class="movie-name mb-0">{{ movie.title }}</p>
            <span>({{ parseInt(movie.release_date) }})</span>
          </div>
        </div>
        <div class="movie-item-actions flex justify-end hover:cursor-pointer hover:bg-gray-300 hover:rounded-lg py-1 px-2">
          <font-awesome-icon
              :icon="['fas', 'xmark']"
              size="lg"
              class="action-item"
              @click="takeOutAMovie(movie.id)"
          />
        </div>
      </div>
    </div>
    <div class="empty-list text-center" v-else>
      <h5 class="mb-0">Your list is empty.</h5>
      <span>Add movies using the field above </span>
    </div>
  </div>
</template>

<style scoped>
.add-movie-bar {
  position: relative;
}

.results-list {
  position: absolute;
  width: 50%;
  background-color: #fff;
  box-shadow: 0px 0px 8px #ddd;
  border-radius: 10px;
  max-height: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
  z-index: 1;
}

.result-item {
  padding: 10px 20px;
}

.result-item:hover {
  background-color: #efefef;
  cursor: pointer;
}

.movies-in-list {
  border: 1px solid #b2b2b2;
  border-radius: 4px;
}

.movie-item-in-list {
  margin: 10px 15px;
  border-top: 1px solid #b2b2b2;
}

.movie-item-in-list:nth-child(1) {
  border-top: none;
}

.movie-item-in-list:not(:first-child) {
  padding-top: 10px;
}

.search-img, .movie-item-in-list img {
  height: 75px;
  width: auto;
}

.result-item .movie-name, .movie-item-in-list .movie-name {
  font-weight: bold;
}

.movie-item-in-list .movie-name {
  font-size: 1.2em;
}

.empty-list {
  border: 1px solid #b2b2b2;
  padding: 50px 75px;
}

</style>
