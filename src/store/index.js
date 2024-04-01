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
            email: null,
            username: null,
            profileImageUrl: null
        };
    },
    getters: {
        userId(state) {
            return state.userId;
        },
        email(state) {
            return state.email;
        },
        username(state) {
            return state.username;
        },
        profileImageUrl(state) {
            return state.profileImageUrl;
        }
    },
    mutations: {
        setCurrentUser(state, payload) {
            state.userId = payload.userId;
            state.email = payload.email;
            state.username = payload.username;
            state.profileImageUrl = payload.profileImageUrl
        },
    }
});

export default store;
