export default {
    setUser(state, payload) {
        state.token = payload.token;
        state.userId = payload.userId;
        state.didAutoLogout = false;
    },
    setIsAuthenticated(state, payload) {
        state.isAuthenticated = payload;
    },
    setAutoLogout(state) {
        state.didAutoLogout = true;
    }
};
