import { createStore } from 'vuex';

import movieListsModule from './modules/movieLists/index.js';
import authModule from './modules/auth/index.js'

const store = createStore({
    modules: {
        movieLists: movieListsModule,
        auth: authModule
    },
    state() {
        return {
            //userId: 'c3'
        };
    },
    getters: {
        /*userId(state) {
            return state.userId;
        }*/
    }
});

export default store;
