import mutations from "./mutations.js";
import actions from './actions.js';
import getters from './getters.js';
export default {
    state() {
        return {
            userId: null,
            token: null,
            // tokenExpiration: null, <- commented this out because we're not really using it in our vuex store
            didAutoLogout: false
        };
    },
    mutations,
    actions,
    getters
};
