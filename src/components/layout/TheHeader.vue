<script setup>
import {computed, ref} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const showDropdown = ref(false);

const isLoggedIn = computed(() => {
  return store.getters.isAuthenticated;
})

function logout() {
  showDropdown.value = false
  store.dispatch('logout');
  router.replace('/');
}

function toPage(path) {
  router.push(path);
}
</script>

<template>
  <!-- header -->
  <header class="w-full sticky top-0 py-4 px-6 flex items-center justify-between bg-gray-100">
    <div class="flex items-center">
      <button class="rounded-full bg-gray-400 w-8 h-8 text-gray-950 opacity-45 hover:opacity-100 mr-3" @click="router.back()">
        <font-awesome-icon
            :icon="['fas', 'chevron-left']"/>
      </button>
      <button class="rounded-full bg-gray-400 w-8 h-8 text-gray-950 opacity-45 hover:opacity-100" @click="router.forward()">
        <font-awesome-icon
            :icon="['fas', 'chevron-right']"/>
      </button>
    </div>
    <div v-if="isLoggedIn" class="relative">
      <button @click="showDropdown = !showDropdown" class="bg-gray-300 rounded-full py-1 px-2 flex items-center">
        <img src="https://placehold.it/200x200" class="rounded-full h-6 w-6 mr-2" />
        <span class="text-gray-950 font-semibold text-xs mr-2">Kayla Nguyen</span>
        <font-awesome-icon
            :icon="['fas', (showDropdown ? 'chevron-up' : 'chevron-down')]"
            size="xs"
        />
      </button>
      <div v-if="showDropdown" class="absolute bg-gray-300 w-full rounded mt-1 shadow">
        <button @click="showDropdown = false" class="focus:outline-none w-full rounded text-sm py-2 text-gray-500 hover:text-gray-950 hover:bg-gray-400">Account</button>
        <button @click="logout" class="focus:outline-none w-full rounded text-sm py-2 text-gray-500 hover:text-gray-950 hover:bg-gray-400">Log Out</button>
      </div>
    </div>
    <div v-else class="relative flex items-center">
      <router-link to="/signup" class="py-2 mr-5 text-gray-500 hover:text-gray-950 hover:scale-105">
        Sign up
      </router-link>
      <button class="bg-gray-950 text-gray-50 rounded-full py-2 px-5 flex justify-center hover:scale-105" @click="toPage('/login')">Log in</button>
    </div>
  </header>
</template>

<style scoped>
</style>
