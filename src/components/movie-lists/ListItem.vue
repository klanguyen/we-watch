<template>
  <li @click="toDetailsPage(listId)">
    <div>
      <h3>{{ listTitle }}</h3>
      <p>{{ listDescription }}</p>
      <p>Made by: {{ userEmail }}</p>
      <p>Is public: {{ isPublic }}</p>
    </div>
  </li>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter();
const props = defineProps([
    'listTitle',
    'listDescription',
    'userEmail',
    'isPublic',
    'listId'
])

function toDetailsPage(id) {
  router.replace(`/list/${id}`);
}
</script>

<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #ccc;
  padding: 1rem;
}

a {
  color: #3d008d;
  text-decoration: none;
  font-weight: bold;
}

a:hover,
a:active {
  color: #8d007a;
}

p {
  margin: 0.5rem 0 0 0;
}
</style>
