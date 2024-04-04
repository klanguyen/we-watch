<script setup>
import {useRouter} from "vue-router";
import {ref} from "vue";
import {FwbButton, FwbInput} from "flowbite-vue";

const router = useRouter();
const searchString = ref('');

function submitForm(){
  router.push('/search/' + searchString.value);
  searchString.value = '';
}
</script>

<template>
  <form @submit.prevent="submitForm" class="w-auto mb-4">
    <fwb-input
        v-model.trim="searchString"
        placeholder="Enter your search query"
        size="lg"
    >
      <template #prefix>
        <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </template>
      <template #suffix>
        <fwb-button color="dark" pill>Search</fwb-button>
      </template>
    </fwb-input>
  </form>
</template>

<style scoped>
</style>
