<script setup>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import MovieItem from "@/components/movie/MovieItem.vue";
import BaseSpinner from "@/components/ui/BaseSpinner.vue";

const store = useStore();
const props = defineProps(['listId']);
const isLoading = ref(false);
const error = ref(null);
const theList = computed(() => {
  return store.getters["movieLists/theList"];
})
const moviesInTheList = computed(() => {
  return store.getters["movieLists/theListMovies"];
})
const listStatus = computed(() => {
  return theList.value.isPublic ? 'Public' : 'Private';
})
const hasMovies = computed(() => {
  return moviesInTheList.value.length !== 0;
})
const listIsLoading = computed(() => {
  isLoading.value = true;
  return theList.value === null;
})

async function loadList() {
  isLoading.value = true;
  try {
    await store.dispatch('movieLists/fetchSingleList', props.listId);
  } catch(e) {
    error.value = e.message || 'Something failed';
  }
  isLoading.value = false;
}

function handleError() {
  error.value = null;
}

loadList();
</script>

<template>
  <article>
    <base-dialog
        :show="!!error"
        title="An error occurred"
        @close="handleError"
    >
      <p>{{ error }}</p>
    </base-dialog>

    <div v-if="listIsLoading">
      <base-spinner v-if="isLoading"></base-spinner>
    </div>

    <section v-else>
      <base-spinner v-if="isLoading"></base-spinner>
      <h1>{{theList.title}}</h1>
      <p>{{theList.description}}</p>
      <p>Created by: {{theList.createdByUserEmail}}</p>
      <span>{{listStatus}}</span>
      <base-card
          v-if="hasMovies"
          title="Movies"
          v-for="item in moviesInTheList"
      >
        <movie-item :movie="item"></movie-item>
      </base-card>
      <base-card
          v-else
          title="Movies"
      >
        <p>There's no movie in this list.</p>
      </base-card>
    </section>
  </article>
</template>

<style scoped>

</style>
