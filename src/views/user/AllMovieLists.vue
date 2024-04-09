<script setup>
import ListItem from '@/components/movie-lists/ListItem.vue'
import {ref, computed, onMounted} from "vue";
import {useStore} from "vuex";
import BaseButton from "@/components/ui/BaseButton.vue";

const store = useStore();
const isLoading = ref(false);
const error = ref(null);

const createdLists = ref([]);
const hasLists = computed(() => {
  return store.getters["movieLists/hasLists"];
})

async function loadLists() {
  isLoading.value = true;
  try {
    await store.dispatch('movieLists/fetchLists');
    createdLists.value = store.getters["movieLists/movieLists"];
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
  <article class="mb-[3rem]">
    <base-dialog
        :show="!!error"
        title="An error occurred"
        @close="handleError"
    >
      <p>{{ error }}</p>
    </base-dialog>
    <section class="px-6 py-12 mb-3 bg-gray-950 text-gray-300">
      <h1 class="text-[3em] font-semibold text-gray-50 tracking-wide mb-2">My Lists</h1>
      <div class="actions mt-3">
        <base-button mode="dark">
          <router-link to="/new-list">
            Create a new list
          </router-link>
        </base-button>
      </div>
    </section>
    <section class="px-6 py-3">
      <base-spinner v-if="isLoading"></base-spinner>
      <ul v-else-if="hasLists && !isLoading" class="inline-block xl:grid xl:grid-cols-2 gap-5">
        <list-item
          v-for="list in createdLists"
          :key="list.id"
          :list-id="list.id"
          :list-title="list.data.title"
          :list-description="list.data.description"
          :is-public="list.data.isPublic"
          :user-email="list.data.createdByUserEmail"
          :created-on="list.data.createdOn"
          :last-updated="list.data.lastUpdated"
          :thumbnail-url="list.data.thumbnailUrl"
          :movie-count="list.data.movies.length"
        ></list-item>
      </ul>
      <div v-else>
        <h3>You haven't created any movie lists yet!</h3>
        <base-button link to="/new-list">Create a list</base-button>
      </div>
    </section>
  </article>
</template>

<style scoped>
</style>
