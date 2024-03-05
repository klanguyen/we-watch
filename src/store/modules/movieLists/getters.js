export default {
    movieLists(state) {
        return state.movieLists;
    },
    hasLists(state) {
        return state.movieLists && state.movieLists.length > 0;
    }
}
