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
            userId: null
        };
    },
    getters: {
        userId(state) {
            return state.userId;
        }
    },
    mutations: {
        setUserId(state, payload) {
            state.userId = payload
        }
    }
});

export default store;
