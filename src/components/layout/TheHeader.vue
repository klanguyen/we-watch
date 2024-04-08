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
        <img :src="currentUser.profileImageUrl ?? 'https://placehold.it/200x200'" class="rounded-full h-8 w-8 mr-2" />
        <span class="text-gray-950 font-semibold text-sm mr-2">{{ currentUser.username }}</span>
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
      <base-button link to="/signup">Sign up</base-button>
      <base-button><router-link to="/login">Log in</router-link></base-button>
    </div>
  </header>
</template>

<style scoped>
</style>
