export default {
    isAuthenticated(state) {
        return state.userId !== null && state.userId !== undefined;
    },
    userId(state) {
        return state.userId;
    },
    token(state) {
        return state.token;
    },
    didAutoLogout(state) {
        return state.didAutoLogout;
    }
}
