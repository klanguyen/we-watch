import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js';

import TheHeader from './components/layout/TheHeader.vue';
import TheFooter from './components/layout/TheFooter.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseCard from './components/ui/BaseCard.vue';


const app = createApp(App)

app.use(router)
app.use(store)

app.component('the-header', TheHeader);
app.component('the-footer', TheFooter);
app.component('base-button', BaseButton);
app.component('base-card', BaseCard);

app.mount('#app')
