<template>
  <div class="bg-gray-100 h-screen">
    <div class="flex h-full">
      <side-bar-nav></side-bar-nav>
      <div class="w-full h-full bg-gray-100 relative overflow-y-scroll">
        <the-header></the-header>
        <!-- add :key="$route.fullPath" so the page remounted everytime the path doesn't change but the params change -->
        <router-view :key="$route.fullPath" v-slot="slotProps">
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
