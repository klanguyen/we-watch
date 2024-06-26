export default {
    movieLists(state) {
        return state.movieLists
    },
    hasLists(state) {
        return state.movieLists && state.movieLists.length > 0;
    },
    theList(state) {
        return state.theList;
    },
    theListMovies(state){
        return state.theListMovies;
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
