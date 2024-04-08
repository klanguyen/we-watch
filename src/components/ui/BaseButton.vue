<script setup>
const props = defineProps({
  mode: {
    type: String,
    required: false,
    default: null
  },
  link: {
    type: Boolean,
    required: false,
    default: false
  },
  to: {
    type: String,
    required: false,
    default: '/'
  }
})
</script>

<template>
  <button v-if="!props.link && props.mode === 'outline'" class="bg-inherit text-gray-950 rounded-full py-2 px-5 flex justify-center hover:scale-105 border border-gray-950 text-sm">
    <slot></slot>
  </button>
  <button v-if="!props.link && props.mode === 'outline dark'" class="text-gray-300 border-[1px] border-gray-300 rounded-full bg-gray-5/20 py-2 px-5 backdrop-blur-md hover:bg-gray-400/30 mr-2">
    <slot></slot>
  </button>
  <button v-else-if="!props.link && !props.mode" class="bg-gray-950 text-gray-50 rounded-full py-2 px-5 flex justify-center hover:scale-105">
    <slot></slot>
  </button>
  <button v-else-if="!props.link && props.mode === 'dark'" class="bg-gray-50 text-gray-950 rounded-full py-2 px-5 flex justify-center hover:scale-105">
    <slot></slot>
  </button>
  <router-link v-else-if="props.link" :to="props.to" class="py-2 mr-5 text-gray-500 hover:text-gray-950 hover:scale-105">
    <slot></slot>
  </router-link>
</template>

<style scoped>
</style>
