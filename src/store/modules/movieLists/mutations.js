export default {
    addList(state, payload) {
        state.movieLists.push(payload);
    },
    setLists(state, payload) {
        state.movieLists = payload;
    },
    setTheList(state, payload) {
        state.theList = payload.theList;
        state.theListMovies = payload.theListMovies
    },
    addMovieToTheList(state, payload) {
        state.theListMovies.push(payload);
    },
    setWatchedList(state, payload) {
        state.watchedList = payload
    },
    setGottaWatchList(state, payload) {
        state.gottaWatchList = payload
    },
    addWatchedMovie(state, payload) {
        state.watchedList.push(payload);
    },
    addGottaWatchMovie(state, payload) {
        state.gottaWatchList.push(payload);
    },
    setWatched(state, payload) {
        state.watched = payload;
    },
    setGottaWatched(state, payload) {
        state.gottaWatched = payload;
    }
}
