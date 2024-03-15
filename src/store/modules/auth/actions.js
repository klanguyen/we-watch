let timer;
import { db } from '@/firebase/init.js';
import { collection, doc, addDoc, setDoc } from 'firebase/firestore';
export default {
    async login(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'login'
        });
    },

    async signup(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'signup'
        });
    },

    async addUserDataToFireBase(_, payload) {
        // 'WeWatchUsers' collection reference
        const colRef = collection(db, "WeWatchUsers");
        // data to send
        const dataObj = {
            username: payload.uUsername,
            email: payload.uEmail
        };
        // create document and return reference to it
        const docRef = await addDoc(colRef, dataObj);
        console.log('Created with id: ' + docRef.id);
        // create leaderboard entry with matching id
        /*await setDoc(doc(collection(db, 'leaderboard', docRef.id)), {
            username: payload.username,
            score: 0
        });*/
    },

    async auth(context, payload) {
        const mode = payload.mode;
        let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${import.meta.env.VITE_FIREBASE_AUTH_KEY}`;

        if(mode === 'signup') {
            url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${import.meta.env.VITE_FIREBASE_AUTH_KEY}`;
        }

        const response = await fetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true
                })
        });

        const responseData = await response.json();

        if(!response.ok) {
            const error = new Error(responseData.message || 'Failed to authenticate. Check your login data.');
            throw error;
        }

        const tokenExpiresIn = +responseData.expiresIn * 1000; // *1000 to get the time in seconds, + to make sure it's a number
        //const tokenExpiresIn = 5000; <- tweak to test the auto log out function
        const expirationDate = new Date().getTime() + tokenExpiresIn;

        localStorage.setItem('token', responseData.idToken);
        localStorage.setItem('userId', responseData.localId);
        localStorage.setItem('tokenExpiration', expirationDate);

        timer = setTimeout(function(){
            context.dispatch('autoLogout');
        }, tokenExpiresIn);

        context.commit('setUser', {
            token: responseData.idToken,
            userId: responseData.localId,
            // tokenExpiration: expirationDate <- commented this because it's not necessary for the UX
        });
    },

    tryLogin(context) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        const tokenExpiresIn = +tokenExpiration - new Date().getTime();

        // after the token expires, there's no need to try to log in/keep the logged in state
        if(tokenExpiresIn < 0) {
            return;
        }

        timer = setTimeout(function(){
            context.dispatch('autoLogout');
        }, tokenExpiresIn)

        if(token && userId) {
            context.commit('setUser', {
                token: token,
                userId: userId
                // tokenExpiration: null <- not necessary
            });
        }
    },

    logout(context) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenExpiration');

        clearTimeout(timer);

        context.commit('setUser', {
            token: null,
            userId: null
        })
    },

    autoLogout(context) {
        context.dispatch('logout');
        context.commit('setAutoLogout');
    }
};
