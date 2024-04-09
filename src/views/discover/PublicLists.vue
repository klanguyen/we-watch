<script setup>
import ListItem from '@/components/movie-lists/ListItem.vue'
import {ref, computed} from "vue";
import {useStore} from "vuex";
import BaseButton from "@/components/ui/BaseButton.vue";
import {useRouter} from "vue-router";

const router = useRouter();
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
const redirectLink = computed(() => {
  return '/login?redirect=new-list/';
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

function toPage(path) {
  router.push(path);
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
      <h1 class="text-[3em] font-semibold text-gray-50 tracking-wide mb-2">Movie Lists</h1>
      <p>Collect, curate, and share. Lists are the perfect way to group films.</p>
      <div
          class="login-actions mt-2"
          v-if="!isLoggedIn"
      >
        <base-button mode="outline dark">
          <router-link :to="redirectLink">
            Login to start your own list
          </router-link>
        </base-button>
      </div>
      <div class="actions mt-3" v-else>
        <base-button mode="dark">
          <router-link to="/new-list">
            Start your own list
          </router-link>
        </base-button>
      </div>
    </section>
    <section class="px-6 py-3">
      <base-spinner v-if="isLoading"></base-spinner>
      <div v-else-if="hasLists && !isLoading">
        <h2 class="text-2xl font-semibold text-gray-950 tracking-wide mb-4">Recently created</h2>
        <ul class="inline-block xl:grid xl:grid-cols-2 gap-5">
          <list-item
              v-for="list in publicLists"
              :key="list.id"
              :list-id="list.id"
              :list-title="list.data.title"
              :list-description="list.data.description"
              :created-on="list.data.createdOn"
              :last-updated="list.data.lastUpdated"
              :thumbnail-url="list.data.thumbnailUrl"
              :movie-count="list.data.movies.length"
              :user-email="list.data.createdByUserEmail"
          ></list-item>
        </ul>
      </div>
      <div v-else>
        <h2>There's no movie lists to discover.</h2>
      </div>
    </section>
  </article>
</template>

<style scoped>
</style>
