<template>
  <section>
    <h1>Search Results for {{ searchString }}</h1>
    <p v-if="noData">No results</p>
    <p v-if="!noData">{{ movieResults.length }} results</p>
    <div
        v-for="(item, index) in movieResults"
        :key="index"
    >
      <movie-item :movie="item"></movie-item>
    </div>
  </section>
</template>

<script>
import TmdbAPI from "@/services/TmdbAPI.js";

export default {
  name: "SearchResults",
  props: ['searchString'],

  data() {
    return {
      movieResults: [],
      isLoading: false,
      noData: false
    }
  },
  methods: {

  },
  mounted() {
    TmdbAPI.search(this.searchString)
        .then(response => {
          if(response.total_results > 0) {
            this.movieResults = response.results;
            console.log(this.movieResults);
            this.isLoading = false;
            this.noData = false;
          } else {
            this.noData = true;
            this.isLoading = false;
          }
        }).catch(err => {
      console.error('AJAX QUERY ERROR', err);
    })
  }
}
</script>

<style scoped>

</style>
