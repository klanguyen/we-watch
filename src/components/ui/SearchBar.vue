<template>
  <form @submit.prevent="submitForm">
    <div class="form-control">
      <label for="search">Search keyword</label>
      <input type="text" id="search" v-model.trim="searchString" />
    </div>
    <div class="actions">
      <base-button>Search</base-button>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      searchString: ''
    }
  },
  methods: {
    submitForm(){
      this.$router.push('/search/' + this.searchString);
      this.searchString = '';
    }
  }
}
</script>

<style scoped>
.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input[type='checkbox'] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

input,
textarea {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
}

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}

input[type='checkbox'] {
  display: inline;
  width: auto;
  border: none;
}

input[type='checkbox']:focus {
  outline: #3d008d solid 1px;
}
</style>
