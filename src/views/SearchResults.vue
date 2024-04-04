<template>
  <section class="px-6 py-3">
    <h1 class="text-2xl">Search Results for "{{ searchString }}"</h1>
    <p v-if="noData">No results</p>
    <p v-if="!noData" class="mb-3">{{ movieResults.length }} {{ movieResults.length === 1 ? 'result' : 'results' }}</p>
    <div
        class="w-full flex flex-wrap justify-between"
    >
      <movie-item
          v-for="(item, index) in movieResults"
          :key="index"
          :movie="item"
      ></movie-item>
    </div>
    <div v-if="hasMorePage" class="flex justify-center mb-5">
      <base-button mode="outline" @click="search(page)">
        Load more
        <font-awesome-icon class="ml-2 pt-[2px]" :icon="['fas', 'angles-down']" />
      </base-button>
    </div>
  </section>
</template>

<script setup>
import TmdbAPI from "@/services/TmdbAPI.js";
import {onBeforeMount, onMounted, ref} from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const props = defineProps(['searchString']);
const movieResults = ref([]);
const isLoading = ref(false);
const noData = ref(false);
const page = ref(1);
const hasMorePage = ref(true);

function search(pageNum) {
  TmdbAPI.search(props.searchString, pageNum)
      .then(response => {
        if (response.total_results > 0) {
          if(response.total_pages >= page.value) {
            if(response.total_pages === page.value) {
              hasMorePage.value = false;
            }
            page.value += 1;
            (response.results).forEach(result => {
              console.log(result);
              movieResults.value.push(result);
            })
          }
          isLoading.value = false;
          noData.value = false;
        } else {
          noData.value = true;
          isLoading.value = false;
        }
      }).catch(err => {
    console.error('AJAX QUERY ERROR', err);
  })
}

onBeforeMount(() => {
  search(page.value);
})

</script>

<style scoped>

</style>
