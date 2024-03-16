let timer;
import { db, auth } from '@/firebase/init.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { collection, doc, addDoc, setDoc } from 'firebase/firestore';
export default {
    async login(context, payload) {
        await signInWithEmailAndPassword(auth, payload.email, payload.password)
            .then(user => {
                context.commit('setUser', user);
                context.commit('setIsAuthenticated', true);
            })
            .catch(() => {
                context.commit('setUser', null);
                context.commit('setIsAuthenticated', false);
            })
    },

    async signup(context, payload) {
        await createUserWithEmailAndPassword(auth, payload.email, payload.password)
            .then(user => {
                context.commit('setUser', user);
                context.commit('setIsAuthenticated', true);
            })
            .catch(() => {
                context.commit('setUser', null);
                context.commit('setIsAuthenticated', false);
            })
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

        const user = await auth.currentUser;
        if(user) {
            // create leaderboard entry with matching id
            const leaderboardUserObj = {
                username: payload.uUsername,
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
                context.commit('setUser', null);
                context.commit('setIsAuthenticated', false)
            })
            .catch(() => {
                console.error('Failed signing out');
            })
    },
};
