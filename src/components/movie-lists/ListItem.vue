<template>
  <li class="w-full flex flex-row items-start bg-white border border-gray-200 rounded-lg shadow md:max-w-full hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:cursor-pointer mb-4" @click="toDetailsPage(listId)">
    <img class="md:object-cover rounded-lg h-[20vh] md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" :src="thumbnailUrl" alt="">
    <div class="flex flex-col justify-between p-4 leading-normal">
      <h3 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 md:pt-4">{{ listTitle }}</h3>
      <span v-if="isPublic !== undefined" class="w-fit bg-gray-300 text-gray-800 flex text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 mb-2">{{ isPublic ? 'Public' : 'Private' }}</span>
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
      <p class="font-normal text-gray-700 dark:text-gray-400">{{ listDescription }}</p>
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
