import mutations from'./mutations.js';
import actions from'./actions.js';
import getters from'./getters.js';
export default {
    namespaced: true,
    state() {
        return {
            movieLists: [],
            watchedList: [],
            gottaWatchList: [],
            watched: null,
            gottaWatched: null
        }
    },
    mutations,
    actions,
    getters
}
