import {db} from '@/firebase/init.js';
import {collection, query, where, doc, setDoc, getDocs, updateDoc, arrayUnion, arrayRemove, onSnapshot, deleteDoc} from 'firebase/firestore';
export default {
    async fetchWatchedList(context) {
        const usersColRef = collection(db, 'WeWatchUsers');
        const q = query(usersColRef, where('email', '==', context.rootGetters.email));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((userDoc) => {
            const watchedListColRef = collection(db, 'WeWatchUsers', userDoc.id, 'WatchedList');
            getDocs(watchedListColRef)
                .then(watchedListSnapshot => {
                    if(!watchedListSnapshot.empty){
                        watchedListSnapshot.forEach(watchedListDoc => {
                            let watchedMovie = watchedListDoc.data();
                            context.commit('addWatchedMovie', watchedMovie);
                        })
                    }else {
                        context.commit('setWatchedList', []);
                    }
                }).catch(err => {
                    console.error('Error getting watched list', err)
            });
        });

    },

    async fetchGottaWatchList(context) {
        const usersColRef = collection(db, 'WeWatchUsers');
        const q = query(usersColRef, where('email', '==', context.rootGetters.email));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((userDoc) => {
            const gottaWatchListColRef = collection(db, 'WeWatchUsers', userDoc.id, 'GottaWatchList');
            getDocs(gottaWatchListColRef)
                .then(gottaWatchListSnapshot => {
                    if(!gottaWatchListSnapshot.empty){
                        gottaWatchListSnapshot.forEach(gottaWatchListDoc => {
                            let gWMovie = gottaWatchListDoc.data();
                            context.commit('addGottaWatchMovie', gWMovie);
                        })
                    }else {
                        context.commit('setGottaWatchList', []);
                    }
                }).catch(err => {
                console.error('Error getting gotta watch list', err)
            });
        });
    },

    async addWatchedMovie(context, payload) {
        const usersColRef = collection(db, 'WeWatchUsers');
        const q = query(usersColRef, where('email', '==', context.rootGetters.email));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((userDoc) => {
            //setDoc(doc(db, 'WeWatchUsers', userDoc.id, 'WatchedList', payload.id), payload); <- can't use this bc the collection hasn't been created
            // add new movie id to watched array
            updateDoc(doc(db, 'WeWatchUsers', userDoc.id), {
                watched: arrayUnion(payload.id)
            })
            const newMovieRef = doc(collection(db, 'WeWatchUsers', userDoc.id, 'WatchedList'));
            setDoc(newMovieRef, payload);
        });
    },

    async addGottaWatchMovie(context, payload) {
        const usersColRef = collection(db, 'WeWatchUsers');
        const q = query(usersColRef, where('email', '==', context.rootGetters.email));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((userDoc) => {
            // add new movie id to gotta watch array
            updateDoc(doc(db, 'WeWatchUsers', userDoc.id), {
                gottaWatch: arrayUnion(payload.id)
            })
            const newMovieRef = doc(collection(db, 'WeWatchUsers', userDoc.id, 'GottaWatchList'));
            setDoc(newMovieRef, payload);
        });
    },

    async removeWatchedMovie(context, payload) {
        const usersColRef = collection(db, 'WeWatchUsers');
        const q = query(usersColRef, where('email', '==', context.rootGetters.email));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((userDoc) => {
            // delete movie id from watched array
            updateDoc(doc(db, 'WeWatchUsers', userDoc.id), {
                watched: arrayRemove(payload)
            })

            const watchedColRef = collection(db, 'WeWatchUsers', userDoc.id, 'WatchedList');
            const q = query(watchedColRef, where('id', '==', payload));
            getDocs(q)
                .then(results => {
                    results.forEach(watchedDoc => {
                        deleteDoc(doc(db, 'WeWatchUsers', userDoc.id, 'WatchedList', watchedDoc.id));
                    })
                })
                .catch(err => {
                    console.error('Error deleting watched doc', err);
                });

        });
    },

    async removeGottaWatchMovie(context, payload) {
        const usersColRef = collection(db, 'WeWatchUsers');
        const q = query(usersColRef, where('email', '==', context.rootGetters.email));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((userDoc) => {
            // delete movie id from gottaWatch array
            updateDoc(doc(db, 'WeWatchUsers', userDoc.id), {
                gottaWatch: arrayRemove(payload)
            })

            const gottaWatchColRef = collection(db, 'WeWatchUsers', userDoc.id, 'GottaWatchList');
            const q = query(gottaWatchColRef, where('id', '==', payload));
            getDocs(q)
                .then(results => {
                    results.forEach(gottaWatchDoc => {
                        deleteDoc(doc(db, 'WeWatchUsers', userDoc.id, 'GottaWatchList', gottaWatchDoc.id));
                    })
                })
                .catch(err => {
                    console.error('Error deleting gotta watch doc', err);
                });

        });
    },

    async getWatchedStatus(context, payload) {
        const usersColRef = collection(db, 'WeWatchUsers');
        const q = query(usersColRef, where('email', '==', context.rootGetters.email));

        /*const querySnapshot = await getDocs(q);
        querySnapshot.forEach((userDoc) => {
            context.commit('setWatched', userDoc.data().watched.includes(payload));
        });*/

        // get real-time update
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach(doc => {
                context.commit('setWatched', doc.data().watched.includes(payload));
            })
        })
    },

    async getGottaWatchStatus(context, payload) {
        const usersColRef = collection(db, 'WeWatchUsers');
        const q = query(usersColRef, where('email', '==', context.rootGetters.email));

        /*const querySnapshot = await getDocs(q);
        querySnapshot.forEach((userDoc) => {
            context.commit('setGottaWatched', userDoc.data().gottaWatch.includes(payload));
        });*/

        // get real-time update
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach(doc => {
                context.commit('setGottaWatched', doc.data().gottaWatch.includes(payload));
            })
        })
    },

    async createList(context, data) {
        const newListData = {
            title: data.listTitle,
            description: data.listDescription,
            isPublic: data.isPublic
        };
        const response = await fetch(
            `https://wewatch-d5a51-default-rtdb.firebaseio.com/movie-lists/${payload.userId}.json`,
            {
                method: 'POST',
                body: JSON.stringify(newListData)
        });

        const responseData = await response.json();

        if(!response.ok) {
            const error = new Error(responseData.message || 'Failed to create the list.');
            throw error;
        }

        newListData.id = responseData.name;
        newListData.userId = payload.userId;

        context.commit('addList', newListData);
    },

    async fetchLists(context) {
        const userId = context.rootGetters.userId;
        const response = await fetch(`https://wewatch-d5a51-default-rtdb.firebaseio.com/movie-lists/${userId}.json`);
        const responseData = await response.json();

        if(!response.ok) {
            const error = new Error(responseData.message || 'Failed to fetch list.');
            throw error;
        }

        const movieLists = [];

        for (const key in responseData) {
            const list = {
                id: key,
                userId: userId,
                listTitle: responseData[key].listTitle,
                listDescription: responseData[key].listDescription,
                isPublic: responseData[key].isPublic
            };

            movieLists.push(list);
        }

        context.commit('setLists', movieLists);
    }
}
