<script>
import TmdbAPI from "@/services/TmdbAPI.js";
export default {
  name: "MovieItem",
  data() {
    return {
      posterUrl: ''
    }
  },
  props: {
    movie: {
      type: Object,
      required: true
    },
  },
  methods: {
    toDetailsPage(id) {
      this.$router.replace(`/movie/${id}`);
    }
  },
  mounted() {
    this.posterUrl = TmdbAPI.getPosterImageUrl(this.movie.poster_path);
  }
}
</script>

<template>
  <base-card @click="toDetailsPage(movie.id)">
    <h4>{{ movie.title }}</h4>
    <img :src="posterUrl" :alt="movie.title + ' poster'">
    <p>{{ movie.overview }}</p>
  </base-card>
</template>

<style scoped>

</style>
