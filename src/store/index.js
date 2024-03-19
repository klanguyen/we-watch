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
            userId: null,
            email: null
        };
    },
    getters: {
        userId(state) {
            return state.userId;
        },
        email(state) {
            return state.email;
        }
    },
    mutations: {
        setCurrentUser(state, payload) {
            state.userId = payload.userId;
            state.email = payload.email;
        },
    }
});

export default store;
