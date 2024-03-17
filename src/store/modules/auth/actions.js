let timer;
import { db, auth } from '@/firebase/init.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { collection, doc, addDoc, setDoc } from 'firebase/firestore';

export default {
    async login(context, payload) {
        await signInWithEmailAndPassword(auth, payload.email, payload.password)
            .then(response => {
                console.log('logging in...');
                context.dispatch('saveTokenInfoInLocal', response.user);
                context.commit('setUser', response.user.accessToken);
                context.commit('setIsAuthenticated', true);
                context.commit('setUserId', response.user.uid, {root: true})
            })
            .catch((e) => {
                context.commit('setUser', null);
                context.commit('setIsAuthenticated', false);
                context.commit('setUserId', null, {root: true})
                console.error('Error logging in', e);
            })
    },

    async signup(context, payload) {
        await createUserWithEmailAndPassword(auth, payload.email, payload.password)
            .then(response => {
                console.log('signing up...');
                context.dispatch('saveTokenInfoInLocal', response.user);
                context.commit('setUser', response.user.accessToken);
                context.commit('setIsAuthenticated', true);
                context.commit('setUserId', response.user.uid, {root: true})
                context.dispatch('addUserDataToFireBase', payload)
                    .catch((e) => {
                        console.error('Error creating user document', e);
                });
            })
            .catch((e) => {
                context.commit('setUser', null);
                context.commit('setIsAuthenticated', false);
                context.commit('setUserId', null, {root: true})
                console.error('Error creating user', e);
            })
    },

    async addUserDataToFireBase(_, payload) {
        // 'WeWatchUsers' collection reference
        const colRef = collection(db, "WeWatchUsers");
        // data to send
        const dataObj = {
            username: payload.username,
            email: payload.email
        };
        // create document and return reference to it
        const docRef = await addDoc(colRef, dataObj);
        console.log('Created with id: ' + docRef.id);

        const user = await auth.currentUser;
        if(user) {
            // create leaderboard entry with matching id
            const leaderboardUserObj = {
                username: payload.username,
                score: 0
            }
            await setDoc(doc(db, "leaderboard", user.uid), leaderboardUserObj);
        } else {
            console.error('No user is currently signed in.');
        }

    },

    logout(context) {
        signOut(auth)
            .then(() => {
                console.log('signing out...');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('tokenExpiration');

                clearTimeout(timer);

                context.commit('setUser', null);
                context.commit('setIsAuthenticated', false);
                context.commit('setUserId', null, {root: true})
            })
            .catch(() => {
                console.error('Failed signing out');
            })
    },

    saveTokenInfoInLocal(context, payload) {
        const tokenExpiresIn = payload.stsTokenManager.expirationTime * 1000;
        const expirationDate = new Date().getTime() + tokenExpiresIn;

        console.log('setting local storage...');
        localStorage.setItem('token', payload.accessToken);
        localStorage.setItem('userId', payload.uid);
        localStorage.setItem('tokenExpiration', expirationDate);

        /*timer = setTimeout(function(){
            context.dispatch('autoLogout');
        }, tokenExpiresIn);*/
    },

    tryLogin(context) {
        console.log('try logging in...');
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        const tokenExpiresIn = +tokenExpiration - new Date().getTime();

        // after the token expires, there's no need to try to log in/keep the logged in state
        if(tokenExpiresIn < 0) {
            return;
        }

        /*timer = setTimeout(function(){
            context.dispatch('autoLogout').then(r => {
                console.log('Session expired', r);
            });
        }, tokenExpiresIn)*/

        if(token && userId) {
            context.commit('setUser', token);
            context.commit('setUserId', userId, {root: true})
            context.commit('setIsAuthenticated', true);
        }
    },

    autoLogout(context) {
        console.log('Session expired. Auto logging out...');
        context.dispatch('logout');
        context.commit('setAutoLogout');
    }
};
