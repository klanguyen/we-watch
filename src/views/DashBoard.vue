<template>
  <div>
    <div>This is a dashboard</div>
    <base-button mode="outline" link to="/">To home</base-button>
    <base-button link to="/auth" v-if="!isLoggedIn">Login</base-button>
    <base-button v-if="isLoggedIn" link to="/new-list">Create a list</base-button>
  </div>
</template>

<script>
export default {
  name: "DashBoard",
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    }
  }
}
</script>


<style scoped>

</style>
