import {db, auth} from '@/firebase/init.js';
import {
    collection,
    query,
    where,
    doc,
    setDoc,
    getDocs,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    onSnapshot,
    deleteDoc,
    addDoc
} from 'firebase/firestore';
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

    async createList(context, payload) {
        const newListData = {
            title: payload.listTitle,
            description: payload.listDescription,
            isPublic: payload.isPublic,
            createdByUserEmail: auth.currentUser.email,
            movies: payload.selectedMovieIds
        };

        let movies = payload.selectedMovies;

        // add to lists collection
        await addDoc(collection(db, 'MovieLists'), newListData)
                .then(response => {
                    console.log('Added list successfully!', response.id)

                    // add list id to user's lists array
                    const usersColRef = collection(db, 'WeWatchUsers');
                    const q = query(usersColRef, where('email', '==', context.rootGetters.email));

                    getDocs(q).then(querySnapshot => {
                        querySnapshot.forEach((userDoc) => {
                            // add new list id to movieLists array
                            updateDoc(doc(db, 'WeWatchUsers', userDoc.id), {
                                movieLists: arrayUnion(response.id)
                            })
                        });
                    });

                    // add movies to the list
                    if(movies.length > 0) {
                        movies.forEach(movie => {
                            setDoc(doc(collection(db, 'MovieLists', response.id, 'Movies')), movie)
                                .then(r => {
                                    console.log('Added movie successfully!');
                                })
                                .catch(err => {
                                    console.log('Failed added movie', err);
                                });
                        })
                    };

                })
                .catch(err => {
                    console.error('Failed added list', err);
                });

    },

    async fetchLists(context) {
        context.commit('setLists', []);
        const listsColRef = collection(db, 'MovieLists');
        const q = query(
            listsColRef,
            where(
                'createdByUserEmail',
                '==',
                context.rootGetters.email
            )
        );

        await getDocs(q)
            .then(querySnapshot => {
                if(!querySnapshot.empty) {
                    querySnapshot.forEach(listDoc => {
                        let list = {
                            id: listDoc.id,
                            data: listDoc.data()
                        };
                        context.commit('addList', list);
                    })
                } else {
                    context.commit('setLists', []);
                }
            })
            .catch(e => {
                console.error('Error getting lists', e);
            });
    },

    async fetchPublicLists(context) {
        context.commit('setLists', []);
        const listsColRef = collection(db, 'MovieLists');
        const q = query(
            listsColRef,
            where(
                'isPublic',
                '==',
                true
            )
        );

        await getDocs(q)
            .then(querySnapshot => {
                if(!querySnapshot.empty) {
                    querySnapshot.forEach(listDoc => {
                        let list = {
                            id: listDoc.id,
                            data: listDoc.data()
                        }
                        context.commit('addList', list);
                    })
                } else {
                    context.commit('setLists', []);
                }
            })
            .catch(e => {
                console.error('Error getting lists', e);
            });
    },

    async fetchSingleList(context, payload) {
        console.log('Fetching...', payload);
        const listDocRef = doc(db, 'MovieLists', payload);
        const docSnap = await getDoc(listDocRef);
        let theList = null;
        let theListMovies = [];

        if(docSnap.exists()) {
            theList = docSnap.data()
        }

        const moviesColRef = collection(db, 'MovieLists', payload, 'Movies');
        await getDocs(moviesColRef)
            .then(results => {
                if(!results.empty) {
                    results.forEach(movieDoc => {
                        let movieData = movieDoc.data();
                        theListMovies.push(movieData);
                    })
                } else {
                    theListMovies = [];
                }
            }).catch(err => {
                console.error('Error getting movies in the list', err);
            })

        context.commit("setTheList", {
            theList: theList,
            theListMovies: theListMovies
        })
    }
}
