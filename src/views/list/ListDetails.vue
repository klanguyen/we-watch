<script setup>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import MovieItem from "@/components/movie/MovieItem.vue";
import {auth} from "@/firebase/init.js";
import {useRouter} from "vue-router";
import {getNumberOfDays} from "@/custom-objects/Utils.js";

const store = useStore();
const router = useRouter();
const props = defineProps(['listId']);
const isLoading = ref(false);
const error = ref(null);
const theList = computed(() => {
  return store.getters["movieLists/theList"];
});
const moviesInTheList = computed(() => {
  return store.getters["movieLists/theListMovies"];
});

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
const isCreator = computed(() => {
  return auth.currentUser.email === theList.value.createdByUserEmail;
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

function editThisList() {
  router.push({ name: 'EditList'});
}

console.log('last updated', props.lastUpdated);
loadList();
</script>

<template>
  <article class="px-6 py-3">
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
      <h1 class="text-[2.5em] font-semibold mb-2 flex items-center">
        {{theList.title}}
        <span class="bg-gray-300 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 ml-4">{{listStatus}}</span>
      </h1>
      <p class="mb-[1.5rem]">{{theList.description}}</p>
      <div class="border-2 border-x-0 border-y-gray-400 py-2 text-sm flex justify-between items-center mb-[1.5rem]">
        <div>
          <span class="mr-2">
            A list by
            <span class="font-semibold">
              {{theList.createdByUserEmail}}
            </span>
          </span>
          <span class="font-normal mr-2">&#8226;</span>
          <font-awesome-icon class="mr-2" :icon="['far', 'clock']" />
          <span v-if="theList.lastUpdated" class="">Updated {{ getNumberOfDays(theList.lastUpdated.toDate()) }}</span>
          <span v-else>Created {{ getNumberOfDays(theList.createdOn.toDate()) }}</span>
        </div>
        <button
            v-if="isCreator"
            class="bg-inherit text-gray-950 rounded-full py-2 px-5 flex justify-center hover:scale-105 border border-gray-950 text-sm"
            @click="editThisList"
        >
          Edit or delete this list
        </button>
      </div>
      <div
          v-if="hasMovies"
          class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <movie-item
            v-for="item in moviesInTheList"
            :movie="item"
        ></movie-item>
      </div>
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
