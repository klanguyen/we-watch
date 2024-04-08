<template>
  <li class="w-full flex flex-col items-start bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:cursor-pointer" @click="toDetailsPage(listId)">
    <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" :src="thumbnailUrl" alt="">
    <div class="flex flex-col justify-between p-4 leading-normal">
      <h3 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 pt-4">{{ listTitle }}</h3>
      <p class="text-sm text-gray-700 mb-2">
        <span class="mr-2 font-semibold">{{ userEmail }}</span>
        <span class="mr-2">&#8226;</span>
        <span class="">{{ movieCount > 1 ? movieCount + ' movies' : movieCount + ' movie' }}</span>
      </p>
      <p class="text-sm text-gray-700 mb-2">
        <font-awesome-icon class="mr-2" :icon="['far', 'clock']" />
        <span v-if="lastUpdated" class="">Updated {{ getNumberOfDays(lastUpdated.toDate()) }}</span>
        <span v-else>Created {{ getNumberOfDays(createdOn.toDate()) }}</span>
      </p>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ listDescription }}</p>
      <p v-if="isPublic">Is public: {{ isPublic }}</p>
    </div>
  </li>
</template>

<script setup>
import {useRouter} from "vue-router";
import {getNumberOfDays} from "@/custom-objects/Utils.js";

const router = useRouter();
const props = defineProps([
    'listTitle',
    'listDescription',
    'userEmail',
    'isPublic',
    'listId',
    'createdOn',
    'movieCount',
    'lastUpdated',
    'thumbnailUrl'
])

function toDetailsPage(id) {
  router.push(`/list/${id}`);
}
</script>

<style scoped>
</style>
