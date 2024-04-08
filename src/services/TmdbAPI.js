import API from './API.js';
import {formatDate, getRandomInt} from "@/custom-objects/Utils.js";

export default {
    search(searchString, pageNum) {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                query: searchString,
                include_adult: false,
                language: 'en-US',
                page: pageNum
            }
        };
        return API().get(`/search/movie`, config)
                    .then(response => {
                        console.log(response.data);
                        return response.data
                    });
    },
    getPosterImageUrl(posterPath) {
        if(posterPath !== null) {
            let baseImgUrl = 'https://image.tmdb.org/t/p/';
            return baseImgUrl.concat('w780', posterPath);
        } else {
            return 'https://placehold.it/500x500';
        }
    },
    getBackdropImageUrl(backdropPath) {
        let baseImgUrl = 'https://image.tmdb.org/t/p/';
        return baseImgUrl.concat('original', backdropPath);
    },
    getPeopleProfileImg(profilePath) {
        if(profilePath !== null){
            let baseImgUrl = 'https://image.tmdb.org/t/p/';
            return baseImgUrl.concat('original', profilePath);
        } else {
            return '/src/assets/img/profile-placeholder.svg';
        }
    },
    getGenreName(idList) {
        // first, get the official genres list
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                language: 'en'
            }
        };
        return API().get(`/genre/movie/list`, config)
                    .then(response => {
                        let genreList = response.data.genres;
                        let resultGenres = [];
                        (genreList).forEach(genre => {
                            idList.forEach(id => {
                                if(genre.id === id) {
                                    resultGenres.push(genre.name)
                                }
                            })
                        });

                        return resultGenres;
                    });
    },
    getGenreOfficialLists() {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                language: 'en'
            }
        };
        return API().get(`/genre/movie/list`, config)
            .then(response => {
                return response.data.genres;
            })
    },
    fetchSingleMovie(id) {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
            }
        };
        return API().get(`/movie/${id}`, config)
                    .then(response => {
                        return response.data
                    });
    },
    getDirector(id) {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
            }
        };
        let output = '';
        return API().get(`/movie/${id}/credits`, config)
            .then(response => {
                (response.data.crew).forEach(item => {
                    if(item.job === 'Director'){
                        output = item.name;
                    }
                })
                return output;
            })
            .catch(err => {
                console.error('AJAX QUERY ERROR', err);
            });
    },
    getTopCast(id){
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
            }
        };
        let output = [];
        return API().get(`/movie/${id}/credits`, config)
            .then(response => {
                (response.data.cast).forEach(item => {
                    if(item.order <= 9) {
                        output.push(item);
                    }
                })
                return output;
            })
            .catch(err => {
                console.error('AJAX QUERY ERROR', err);
            });
    },
    getKeyWords(id) {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
            }
        };
        let output = [];
        return API().get(`/movie/${id}/keywords`, config)
                    .then(response => {
                        output = response.data.keywords;
                        return output;
                    }).catch(err => {
                        console.error('AJAX QUERY ERROR', err);
                    });
    },
    getCollection(collectionId) {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
            }
        };
        let output = [];
        return API().get(`/collection/${collectionId}`, config)
            .then(response => {
                output = response.data;
                return output;
            }).catch(err => {
                console.error('AJAX QUERY ERROR', err);
            });
    },
    getRecommendations(id) {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                language: 'en-US'
            }
        };
        let output = [];
        return API().get(`/movie/${id}/recommendations`, config)
            .then(response => {
                output = response.data.results;
                return output;
            }).catch(err => {
                console.error('AJAX QUERY ERROR', err);
            });
    },
    getSimilarMovies(id) {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                language: 'en-US'
            }
        };
        let output = [];
        let num = 0
        return API().get(`/movie/${id}/similar`, config)
        .then(response => {
            if(response.data.total_pages >= 500){
                num = getRandomInt(1, 500);
            }else {
                num = getRandomInt(1, response.data.total_pages);
            }
            config = {
                params: {
                    api_key: import.meta.env.VITE_TMDB_API_KEY,
                    language: 'en-US',
                    page: num
                }
            };
            return API().get(`/movie/${id}/similar`, config)
                .then(r => {
                    (r.data.results).forEach(result => {
                        if(result.poster_path !== null && result.vote_average > 5) {
                            output.push(result);
                        }
                    })
                    return output;
                })
        }).catch(err => {
            console.error('AJAX QUERY ERROR', err);
        });
    },
    fetchPopularMovies() {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                language: 'en-US',
                page: 1
            }
        };
        return API().get(`/movie/popular`, config)
            .then(response => {
                return response.data
            });
    },
    fetchNowPlayingMovies() {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                language: 'en-US',
                page: 1
            }
        };
        return API().get(`/movie/now_playing`, config)
            .then(response => {
                return response.data
            });
    },
    fetchTopRatedMovies() {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                language: 'en-US',
                page: 1
            }
        };
        return API().get(`/movie/top_rated`, config)
            .then(response => {
                return response.data
            });
    },
    fetchUpcomingMovies() {
        const today = new Date();
        const neededDate = new Date();
        const month = neededDate.getMonth();
        neededDate.setMonth(neededDate.getMonth() + 3);
        while (neededDate.getMonth() === month) {
            neededDate.setDate(neededDate.getDate() - 1);
        }
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                include_adult: false,
                include_video: false,
                language: 'en-US',
                page: 1,
                with_original_language: 'en',
                'primary_release_date.gte': formatDate(today),
                'primary_release_date.lte': formatDate(neededDate),
                sort_by: 'popularity.desc',
                with_release_type: '2|3'
            }
        };
        return API().get(`/discover/movie`, config)
            .then(response => {
                return response.data
            });
    },
    fetchTrendingMovies() {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
            }
        }

        return API().get(`/trending/movie/day`, config)
            .then(response => {
                return response.data.results;
            })
            .catch(err => {
                console.error('AJAX QUERY ERROR', err);
            })
    },
    fetchTrendingPeople() {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                language: 'en-US'
            }
        }

        return API().get(`/trending/person/day`, config)
            .then(response => {
                return response.data.results;
            })
            .catch(err => {
                console.error('AJAX QUERY ERROR', err);
            })
    },
}
