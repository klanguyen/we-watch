export default {
    user(state) {
        return state.user;
    },
    isAuthenticated(state) {
        return state.user !== null && state.user !== undefined;
    },
}
