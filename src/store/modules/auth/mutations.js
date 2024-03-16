export default {
    setUser(state, payload) {
        state.user = payload;
    },
    setIsAuthenticated(state, payload) {
        state.isAuthenticated = payload;
    },
    setAutoLogout(state) {
        state.didAutoLogout = true;
    }
};
