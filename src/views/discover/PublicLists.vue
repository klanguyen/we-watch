<script setup>
import ListItem from '@/components/movie-lists/ListItem.vue'
import {ref, computed} from "vue";
import {useStore} from "vuex";

const store = useStore();
const isLoading = ref(false);
const error = ref(null);

const isLoggedIn = computed(() => {
  return store.getters.isAuthenticated;
})
const publicLists = computed(() => {
  return store.getters["movieLists/movieLists"];
})
const hasLists = computed(() => {
  return store.getters["movieLists/hasLists"];
})

async function loadLists() {
  isLoading.value = true;
  try {
    await store.dispatch('movieLists/fetchPublicLists');
  } catch(e) {
    error.value = e.message || 'Something failed';
  }
  isLoading.value = false;
}

function handleError() {
  error.value = null;
}

loadLists();
</script>

<template>
  <div>
    <base-dialog
        :show="!!error"
        title="An error occurred"
        @close="handleError"
    >
      <p>{{ error }}</p>
    </base-dialog>
    <section>
      <base-card>
        <header>
          <h2>Public lists</h2>
        </header>
        <base-spinner v-if="isLoading"></base-spinner>
        <ul v-else-if="hasLists && !isLoading">
          <list-item
              v-for="list in publicLists"
              :key="list.id"
              :list-title="list.data.title"
              :list-description="list.data.description"
              :is-public="list.data.isPublic"
              :user-email="list.data.createdByUserEmail"
          ></list-item>
        </ul>
        <div v-else>
          <h3>There's no movie lists to discover.</h3>
          <base-button v-if="isLoggedIn" link to="/new-list">Create a list</base-button>
        </div>
      </base-card>
    </section>
  </div>
</template>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
