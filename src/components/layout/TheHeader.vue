<script setup>
import {computed, reactive, ref} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const isLoading = ref(false);
const error = ref(null);
const showDropdown = ref(false);
const currentUser = reactive({
  userId: computed(() => { return store.getters.userId}),
  email: computed(() => { return store.getters.email}),
  username: computed(() => { return store.getters.username}),
  profileImageUrl: computed(() => { return store.getters.profileImageUrl})
});

const isLoggedIn = computed(() => {
  return store.getters.isAuthenticated;
})

const headerIsLoading = computed(() => {
  isLoading.value = true;
  return currentUser.value === null;
})

function logout() {
  showDropdown.value = false
  store.dispatch('logout');
  router.push('/');
}

function handleError() {
  error.value = null;
}
</script>

<template>
  <base-dialog
      :show="!!error"
      title="An error occurred"
      @close="handleError"
  >
    <p>{{ error }}</p>
  </base-dialog>

  <div v-if="headerIsLoading">
    <base-spinner v-if="isLoading"></base-spinner>
  </div>
  <!-- header -->
  <header v-else class="w-full sticky top-0 py-4 px-6 flex items-center justify-between bg-gray-100/80 backdrop-blur-md z-20">
    <div class="flex items-center">
      <button
          data-drawer-target="wewatch-sidebar"
          data-drawer-toggle="wewatch-sidebar"
          aria-controls="wewatch-sidebar"
          class="p-2 mr-2 mt-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-300 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100"
      >
        <svg
            aria-hidden="true"
            class="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
          ></path>
        </svg>
        <svg
            aria-hidden="true"
            class="hidden w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
          ></path>
        </svg>
        <span class="sr-only">Toggle sidebar</span>
      </button>
      <h1 class="pt-2 h-10 text-gray-950 logo text-2xl md:hidden">
        <router-link to="/">
          <font-awesome-icon
              :icon="['fas', 'glasses']"
              class="mr-2"
          />WeWatch</router-link>
      </h1>
      <div class="hidden md:block">
        <button class="rounded-full bg-gray-400 w-8 h-8 text-gray-950 opacity-45 hover:opacity-100 mr-3" @click="router.back()">
          <font-awesome-icon
              :icon="['fas', 'chevron-left']"/>
        </button>
        <button class="rounded-full bg-gray-400 w-8 h-8 text-gray-950 opacity-45 hover:opacity-100" @click="router.forward()">
          <font-awesome-icon
              :icon="['fas', 'chevron-right']"/>
        </button>
      </div>
    </div>
    <div v-if="isLoggedIn" class="relative flex">
      <button @click="showDropdown = !showDropdown" class="bg-gray-300 rounded-full py-1 px-2 flex items-center">
        <img :src="currentUser.profileImageUrl ?? 'https://placehold.it/200x200'" class="rounded-full h-8 w-8 mr-3" />
        <span class="text-gray-950 font-semibold text-sm mr-4">{{ currentUser.username }}</span>
        <font-awesome-icon
            :icon="['fas', (showDropdown ? 'chevron-up' : 'chevron-down')]"
            size="xs"
        />
      </button>
      <div v-if="showDropdown" class="absolute bg-gray-300 w-full rounded mt-10 shadow">
        <button @click="logout" class="focus:outline-none w-full rounded text-sm py-2 text-gray-700 hover:text-gray-200 hover:bg-gray-700">
          <font-awesome-icon
              class="mr-2"
              :icon="['fas', 'arrow-right-from-bracket']" />
          Log Out
        </button>
      </div>
    </div>
    <div v-else class="relative flex items-center">
      <button class="py-2 mr-5 text-gray-500 hover:text-gray-950 hover:scale-105 hidden md:block"><router-link to="/signup">Sign up</router-link></button>
      <base-button><router-link to="/login">Log in</router-link></base-button>
    </div>
  </header>
</template>

<style scoped>
</style>
