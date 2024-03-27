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
  return formValues.value.mode === 'login' ? 'Login' : 'Signup'
})
const switchModeButtonCaption = computed(() => {
  return formValues.value.mode === 'login' ? 'Signup instead' : 'Login instead';
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
    formValues.value.formIsValid = false;
    return;
  }

  pageValues.value.isLoading = true;

  const actionPayload = {
    email: userValues.value.email,
    password: userValues.value.password,
    username: userValues.value.username
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
    formValues.value.mode = 'signup';
  } else {
    formValues.value.mode = 'login';
  }
}

function handleError() {
  pageValues.value.error = '';
}

checkRoute();
</script>

<template>
  <div>
    <base-dialog :show="!!pageValues.error" title="Ah...error occurred" @close="handleError">
      {{ pageValues.error }}
    </base-dialog>
    <base-dialog :show="pageValues.isLoading" title="Authenticating..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control" v-if="formValues.mode === 'signup'">
          <label for="name">Username</label>
          <input type="text" id="name" v-model.trim="userValues.username" />
        </div>
        <div class="form-control">
          <label for="email">Email</label>
          <input type="email" id="email" v-model.trim="userValues.email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="userValues.password" />
        </div>
        <p v-if="!formValues.formIsValid">Please enter a valid email and password (must be 6 characters long)</p>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button type="button" mode="flat" @click="switchAuthMode">{{ switchModeButtonCaption }}</base-button>
      </form>
    </base-card>
  </div>
</template>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>
