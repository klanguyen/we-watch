export default {
    movieLists(state, _, _2, rootGetters) {
        const userId = rootGetters.userId;
        return state.movieLists.filter(list => list.userId === userId);
    },
    hasLists(state) {
        return state.movieLists && state.movieLists.length > 0;
    },
    watchedList(state) {
        return state.watchedList;
    },
    gottaWatchList(state) {
        return state.gottaWatchList;
    },
    watched(state) {
        return state.watched;
    },
    gottaWatched(state) {
        return state.gottaWatched;
    }
}
