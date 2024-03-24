<script setup>
import {ref, watch} from "vue";
import {debounce} from "@/./custom-objects/Utils.js"
import TmdbAPI from "@/services/TmdbAPI.js"

const emit = defineEmits(['onSubmit', 'onCancel'])

const searchString = ref('');
const results = ref([]);
const selectedMovies = ref([]);
const isAlerting = ref(false);
const alertedMovieName = ref('');

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

watch(searchString, debounce(() => {
  search();
}), 1000)
</script>

<template>
  <div class="add-movie-bar">
    <div class="row">
      <div class="mb-3 col-8">
        <label for="search">Add a movie</label>
        <input
            type="text"
            class="form-control"
            id="search"
            v-model.trim="searchString"
            placeholder="Enter name of movie"
        />
        <div
            v-if="isAlerting"
            class="alert alert-warning alert-dismissible fade show row" role="alert"
        >
          <p class="col-10 mb-0"><strong>{{alertedMovieName}}</strong> is already in the list</p>
          <p class="close mb-0 col-2 d-flex justify-content-end flex-grow-1" data-dismiss="alert" aria-label="Close">
            <font-awesome-icon
                :icon="['fas', 'xmark']"
                size="lg"
                aria-hidden="true"
                class="action-item"
                @click="isAlerting = false"
            />
          </p>
        </div>
      </div>
      <div class="list-actions col-4">
        <base-button
            mode="outline"
            @click="$emit('onCancel')"
        >
          Cancel
        </base-button>
        <base-button @click="$emit('onSubmit', selectedMovies)">Save list</base-button>
      </div>
    </div>
    <div v-if="results.length && searchString !== ''"
        class="results-list mb-3">
      <div
          class="result-item row"
          v-for="result in results"
          :key="result.id"
          @click="selectMovie(result)"
      >
        <img class="search-img col-4" :src="getPosterUrl(result.poster_path)" />
        <span class="col-8">
          <p class="movie-name mb-0">{{ result.title }}</p>
          <span>({{parseInt(result.release_date)}})</span>
        </span>
      </div>
    </div>
    <div class="movies-in-list" v-if="selectedMovies.length > 0">
      <div
          v-for="movie in selectedMovies"
          class="movie-item-in-list row align-items-center"
      >
        <img :src="getPosterUrl(movie.poster_path)" class="col-3" />
        <div class="col-6 flex-column">
          <p class="movie-name mb-0">{{ movie.title }}</p>
          <span>({{ parseInt(movie.release_date) }})</span>
        </div>
        <div class="movie-item-actions col-3 d-flex justify-content-end flex-grow-1">
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

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
}

input:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}

.results-list {
  position: absolute;
  width: 97%;
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

.action-item:hover {
  color: #8d007a;
  cursor: pointer;
}

.empty-list {
  border: 1px solid #b2b2b2;
  padding: 50px 75px;
}

</style>
