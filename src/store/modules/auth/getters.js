export default {
    isAuthenticated(state, _, _2, rootGetters) {
        //return state.userId !== null && state.userId !== undefined;
        return rootGetters.userId !== null && rootGetters.userId !== undefined;
    },
    token(state) {
        return state.token;
    },
    didAutoLogout(state) {
        return state.didAutoLogout;
    }
}
