import API from './API.js';
import {formatDate} from "@/custom-objects/Utils.js";

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
        let baseImgUrl = 'https://image.tmdb.org/t/p/';
        return baseImgUrl.concat('w780', posterPath);
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
    }
}
