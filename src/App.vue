<template>
  <div class="bg-black h-screen">
    <div class="flex h-full">
      <side-bar-nav></side-bar-nav>
      <div class="w-full h-full bg-gray-100 relative overflow-y-scroll">
        <the-header></the-header>
        <router-view v-slot="slotProps">
          <component :is="slotProps.Component"></component>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, watch} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();

const didAutoLogout = computed(() => {
  return store.getters.didAutoLogout;
})
watch(didAutoLogout, (currentValue, oldValue) => {
  if(currentValue && currentValue !== oldValue) {
    router.replace('/')
  }
})

store.dispatch('tryLogin');
</script>

<style scoped>

</style>
