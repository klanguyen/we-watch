<script setup>
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

const store = useStore();
const router = useRouter();
const generalPages = [{
  id: 'home',
  name: 'Home',
  icon: 'house',
  path: '/'
},
{
  id: 'search',
  name: 'Search',
  icon: 'magnifying-glass',
  path: '/search'
}
];
const memberPages = [
  {
    id: 'library',
    name: 'Library',
    icon: 'film',
    path: '/user/lists/',
    requiredLoggedIn: true
  }
];

const discoverPages = [
  {
    id: 'discover-lists',
    name: 'Movie Lists',
    icon: 'book-open',
    path: '/discover/movie-lists/',
    requiredLoggedIn: false
  },
  {
    id: 'discover-trending',
    name: 'Trending',
    icon: 'fire',
    path: '/discover/trending/',
    requiredLoggedIn: false
  },
];
const isLoggedIn = computed(() => {
  return store.getters.isAuthenticated;
})

function toPage(path) {
  router.push(path);
}
</script>

<template>
  <!-- side nav -->
  <aside class="w-60 bg-gray-300 h-full flex-none overflow-y-scroll">
    <div class="p-6">
      <h1 class="h-10 text-gray-950 logo text-2xl">
        <router-link to="/">
          <font-awesome-icon
            :icon="['fas', 'glasses']"
            class="mr-2"
        />WeWatch</router-link>
      </h1>
    </div>
    <div class="mx-2 mb-2">
      <button
          v-for="page in generalPages"
          @click="toPage(page.path)"
          :class="`w-full focus:outline-none text-sm hover:text-gray-950 hover:bg-gray-50 rounded px-3 py-2 flex items-center justify-start text-gray-500`"
      >
        <font-awesome-icon
            :icon="['fas', page.icon]"
            class="mr-3"
        />
        <span class="font-semibold"> {{ page.name}} </span>
      </button>
      <button
          v-for="page in memberPages"
          @click="toPage(page.path)"
          :class="`w-full focus:outline-none text-sm hover:text-gray-950 hover:bg-gray-50 rounded px-3 py-2 flex items-center justify-start text-gray-500`"
          v-if="isLoggedIn"
      >
        <font-awesome-icon
            :icon="['fas', page.icon]"
            class="mr-3"
        />
        <span class="font-semibold"> {{ page.name}} </span>
      </button>
    </div>
    <div class="mx-5">
      <h2 class="mb-3 pt-3 text-sm text-gray-500 tracking-widest uppercase border-t-2 border-gray-400">Discover</h2>
      <button
          v-for="page in discoverPages"
          class="flex items-center justify-start opacity-45 hover:opacity-100 mb-2 py-1"
          @click="toPage(page.path)">
        <font-awesome-icon
            class="mr-3 text-gray-950"
            :icon="['fas', page.icon]" />
        <span class="text-sm text-gray-950">{{ page.name }}</span>
      </button>
    </div>
    <div class="mx-5">
      <h2 class="mb-3 pt-3 text-sm text-gray-500 tracking-widest uppercase border-t-2 border-gray-400">Movie Lists</h2>
      <div v-if="isLoggedIn">
        <button class="flex items-center justify-start opacity-45 hover:opacity-100 mb-2 py-1" @click="toPage('/new-list')">
          <font-awesome-icon
              class="mr-3 text-gray-950"
              :icon="['fas', 'square-plus']" />
          <span class="text-sm text-gray-950">Create List</span>
        </button>
        <button class="flex items-center justify-start opacity-45 hover:opacity-100 mb-2 py-1" @click="toPage('/user/watched-list/')">
          <font-awesome-icon
              class="mr-3 text-gray-950"
              :icon="['fas', 'eye']"/>
          <span class="text-sm text-gray-950">Watched List</span>
        </button>
        <button class="flex items-center justify-start opacity-45 hover:opacity-100 py-1" @click="toPage('/user/gotta-watch-list/')">
          <font-awesome-icon
              class="mr-3 text-gray-950"
              :icon="['fas', 'bookmark']" />
          <span class="text-sm text-gray-950">Gotta Watch List</span>
        </button>
      </div>
      <div v-else class="text-gray-500">
        <p class="text-sm mb-2">Log in to track movies, create lists, and more.</p>
        <button class="bg-inherit text-gray-950 rounded-full py-2 px-5 flex justify-center hover:scale-105 border border-gray-950 text-sm" @click="toPage('/login')">Log in</button>
      </div>
    </div>
    <div class="relative pt-4">
      <div class="w-full h-full flex justify-end items-start opacity-0 hover:opacity-100 p-2 absolute">
        <div class="bg-gray-950 rounded-full flex justify-center h-6 w-6">
          <font-awesome-icon
              class="self-center text-gray-50"
              :icon="['fas', 'chevron-down']"/>
        </div>
      </div>
      <img src="https://placehold.it/500x500">
    </div>
  </aside>
</template>

<style scoped>

</style>
