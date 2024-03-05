export default {
    setUser(state, payload) {
        state.token = payload.token;
        state.userId = payload.userId;
        // state.tokenExpiration = payload.tokenExpiration; <- commented this because it's not necessary for the UX
        state.didAutoLogout = false;
    },
    setAutoLogout(state) {
        state.didAutoLogout = true;
    }
};
