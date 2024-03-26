import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {far} from "@fortawesome/free-regular-svg-icons";
import {fab} from '@fortawesome/free-brands-svg-icons'


library.add(fas, far, fab)

import TheHeader from './components/layout/TheHeader.vue';
import TheFooter from './components/layout/TheFooter.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseCard from './components/ui/BaseCard.vue';
import BaseDialog from "@/components/ui/BaseDialog.vue";
import BaseSpinner from "@/components/ui/BaseSpinner.vue";
import SearchBar from "@/components/ui/SearchBar.vue";
import MovieItem from "./components/movie/MovieItem.vue";


const app = createApp(App)

app.use(router)
app.use(store)

app.component('the-header', TheHeader);
app.component('the-footer', TheFooter);
app.component('base-button', BaseButton);
app.component('base-card', BaseCard);
app.component('base-dialog', BaseDialog);
app.component('base-spinner', BaseSpinner);
app.component('search-bar', SearchBar);
app.component('movie-item', MovieItem);
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
