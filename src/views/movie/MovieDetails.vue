<script>
import TmdbAPI from "@/services/TmdbAPI.js";

export default {
  name: "MovieDetails",
  props: ['movieId'],
  data() {
    return {
      theMovie: '',
      posterUrl: ''
    }
  },
  mounted() {
    TmdbAPI.fetchSingleMovie(this.movieId)
        .then(response => {
          // TODO: Validate url input
          this.theMovie = response;
          this.posterUrl = TmdbAPI.getPosterImageUrl(this.theMovie.poster_path);
        }).catch(err => {
      console.error('AJAX QUERY ERROR', err);
    });
  }
}
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
  </section>
</template>

<style scoped>

</style>
