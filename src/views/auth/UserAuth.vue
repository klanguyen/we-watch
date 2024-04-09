<script setup>

import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();
const route = useRoute();

const userValues = ref({
  username: '',
  email: '',
  password: ''
})
const formValues = ref({
  formIsValid: true,
  mode: 'login'
})
const pageValues = ref({
  isLoading: false,
  error: ''
})

const submitButtonCaption = computed(() => {
  return formValues.value.mode === 'login' ? 'Log in' : 'Sign up'
})
const switchModeButtonCaption = computed(() => {
  return formValues.value.mode === 'login' ? 'Sign up' : 'Log in';
})

function checkRoute() {
  formValues.value.mode = route.name;
}

async function submitForm() {
  formValues.value.formIsValid = true;
  if (
      userValues.value.email === '' ||
      !userValues.value.email.includes('@') ||
      userValues.value.password.length < 6
  ) {
    if(formValues.value.mode === 'signup') {
      if(userValues.value.username === '') {
        formValues.value.formIsValid = false;
      }
    }
    formValues.value.formIsValid = false;
    return;
  }

  pageValues.value.isLoading = true;

  const actionPayload = {
    email: userValues.value.email,
    password: userValues.value.password,
    username: userValues.value.username,
    profileImageUrl: `https://api.dicebear.com/8.x/notionists-neutral/svg?seed=${userValues.value.username}`
  };

  try {
    if(formValues.value.mode === 'login') {
      await store.dispatch('login', actionPayload);
    } else {
      await store.dispatch('signup', actionPayload);
    }
    const redirectUrl = '/' + (route.query.redirect || '');
    await router.push(redirectUrl);
  } catch(err) {
    // TODO: fix this to show error on dialog
    pageValues.value.error = err.message || 'Failed to authenticate, try later';
  }

  pageValues.value.isLoading = false;
}

function switchAuthMode() {
  if(formValues.value.mode === 'login') {
    router.push('/signup');
    formValues.value.mode = 'signup';
  } else {
    router.push('/login');
    formValues.value.mode = 'login';
  }
}

function handleError() {
  pageValues.value.error = '';
}

checkRoute();
</script>

<template>
  <article class="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <base-dialog :show="!!pageValues.error" title="Ah...error occurred" @close="handleError">
      {{ pageValues.error }}
    </base-dialog>
    <base-dialog :show="pageValues.isLoading" title="Authenticating..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
          {{ formValues.mode === 'signup' ? 'Create an account' : 'Log in to your account' }}
        </h1>
        <form
            @submit.prevent="submitForm"
            class="space-y-4 md:space-y-6"
        >
          <div v-if="formValues.mode === 'signup'">
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Username</label>
            <input
                type="text"
                id="name"
                v-model.trim="userValues.username"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5"
                placeholder="e.g. MovieLover"
            />
          </div>
          <div>
            <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
                type="email"
                id="email"
                v-model.trim="userValues.email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5"
                placeholder="name@company.com"
            />
          </div>
          <div>
            <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
                type="password"
                id="password"
                v-model.trim="userValues.password"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5"
                placeholder="••••••••"
            />
          </div>
          <div v-if="!formValues.formIsValid" class="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <svg class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span class="sr-only">Danger</span>
            <div>
              <span class="font-medium">Ensure that these requirements are met:</span>
              <ul class="mt-1.5 list-disc list-inside">
                <li v-if="formValues.mode === 'signup'">Valid username</li>
                <li>Valid email address</li>
                <li>Passwords must be at least 6 characters long</li>
              </ul>
            </div>
          </div>
          <button
              type="submit"
              class="w-full text-gray-50 bg-zinc-800 hover:bg-zinc-950 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-full text-sm px-5 py-2.5 text-center"
          >{{ submitButtonCaption }}</button>
          <p class="text-sm font-light text-gray-500">
            {{ formValues.mode === 'login' ? 'Don’t have an account yet?' : 'Already have an account?' }}
            <a @click="switchAuthMode" class="font-medium text-gray-800 hover:underline cursor-pointer">
              {{ switchModeButtonCaption }}
            </a>
          </p>
        </form>
      </div>
    </div>
  </article>
</template>

<style scoped>
</style>
