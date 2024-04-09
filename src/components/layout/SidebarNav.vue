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
  <aside id="wewatch-sidebar" class="fixed top-0 left-0 z-40 md:relative w-1/3 max-w-[18rem] min-w-[15rem] bg-gray-100 border-r border-gray-400 h-screen overflow-y-scroll transition-transform -translate-x-full md:translate-x-0" aria-label="Sidebar">
    <div class="p-6 dark:bg-gray-800 dark:border-gray-700">
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
          :class="`w-full focus:outline-none hover:text-gray-950 hover:bg-gray-300 rounded px-4 py-2 flex items-center justify-start text-gray-700`"
      >
        <font-awesome-icon
            :icon="['fas', page.icon]"
            class="mr-3"
        />
        <span class=""> {{ page.name}} </span>
      </button>
      <button
          v-for="page in memberPages"
          @click="toPage(page.path)"
          :class="`w-full focus:outline-none hover:text-gray-950 hover:bg-gray-300 rounded px-4 py-2 flex items-center justify-start text-gray-700`"
          v-if="isLoggedIn"
      >
        <font-awesome-icon
            :icon="['fas', page.icon]"
            class="mr-3"
        />
        <span class=""> {{ page.name}} </span>
      </button>
    </div>
    <div class="mx-2 mb-2">
      <h2 class="px-4 py-3 text-gray-700 tracking-widest uppercase border-t-[1px] border-gray-400">Discover</h2>
      <button
          v-for="page in discoverPages"
          class="w-full focus:outline-none hover:text-gray-950 hover:bg-gray-300 rounded px-4 py-2 flex items-center justify-start text-gray-700"
          @click="toPage(page.path)">
        <font-awesome-icon
            class="mr-3"
            :icon="['fas', page.icon]" />
        <span class="">{{ page.name }}</span>
      </button>
    </div>
    <div class="mx-2 mb-2">
      <h2 class="px-4 py-3 text-gray-700 tracking-widest uppercase border-t-[1px] border-gray-400">Movie Lists</h2>
      <div v-if="isLoggedIn">
        <button
            class="w-full focus:outline-none hover:text-gray-950 hover:bg-gray-300 rounded px-4 py-2 flex items-center justify-start text-gray-700"
            @click="toPage('/new-list')">
          <font-awesome-icon
              class="mr-3"
              :icon="['fas', 'square-plus']" />
          <span class="">Create List</span>
        </button>
        <button
            class="w-full focus:outline-none hover:text-gray-950 hover:bg-gray-300 rounded px-4 py-2 flex items-center justify-start text-gray-700"
            @click="toPage('/user/watched-list/')">
          <font-awesome-icon
              class="mr-3"
              :icon="['fas', 'eye']"/>
          <span class="">Watched</span>
        </button>
        <button
            class="w-full focus:outline-none hover:text-gray-950 hover:bg-gray-300 rounded px-4 py-2 flex items-center justify-start text-gray-700"
            @click="toPage('/user/gotta-watch-list/')">
          <font-awesome-icon
              class="mr-3"
              :icon="['fas', 'bookmark']" />
          <span class="">Gotta Watch</span>
        </button>
      </div>
      <div v-else class="mx-2 mb-2 text-gray-500">
        <p class="text-sm pl-2 mb-2">Log in to track movies, create lists, and more.</p>
        <button class="bg-inherit text-gray-950 rounded-full py-2 px-5 ml-2 flex justify-center hover:scale-105 border border-gray-950 text-sm" @click="toPage('/login')">Log in</button>
      </div>
    </div>
  </aside>
</template>

<style scoped>

</style>
