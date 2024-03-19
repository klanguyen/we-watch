<script setup>
import {ref} from 'vue';
import {useStore} from "vuex";
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();

const listTitle = ref('');
const listDescription = ref('');
const isPublic = ref(true);
const formIsValid = ref(true);

function validateForm() {
  formIsValid.value = !(listTitle.value === '' || listDescription.value === '');
}

function submitForm() {
  validateForm();

  if(formIsValid) {
    store.dispatch('movieLists/createList', {
      listTitle: listTitle.value,
      listDescription: listDescription.value,
      isPublic: isPublic.value,
    });
    router.replace('/user/my-lists');
  }
}
</script>

<template>
  <section>
    <base-card>
      <h2>Create a new movie list</h2>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="listTitle">List Title</label>
          <input
              type="text"
              id="listTitle"
              v-model.trim="listTitle"
          />
        </div>
        <div class="form-control">
          <label for="listDescription">List Description</label>
          <textarea
              id="listDescription"
              rows="5"
              v-model.trim="listDescription"
          ></textarea>
        </div>
        <div class="form-control">
          <div>
            <input
                type="checkbox"
                id="isPublic"
                v-model="isPublic"
            />
            <label for="isPublic">Public list</label>
          </div>
        </div>
        <p v-if="!formIsValid">Please fix the above errors and submit again.</p>
        <base-button>Create list</base-button>
      </form>
    </base-card>
  </section>
</template>

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

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invalid label {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}
</style>
