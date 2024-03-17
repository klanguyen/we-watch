<template>
  <div>
    <div>This is a dashboard</div>
    <base-button mode="outline" link to="/">To home</base-button>
    <base-button link to="/auth" v-if="!isLoggedIn">Login</base-button>
    <base-button v-if="isLoggedIn" link to="/new-list">Create a list</base-button>
  </div>
</template>

<script setup>
import {computed} from "vue";
import {useStore} from "vuex";

const store = useStore();
const isLoggedIn = computed(() => {
  return store.getters.isAuthenticated;
})
</script>


<style scoped>

</style>
