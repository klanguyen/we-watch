import API from './API.js';

export default {
    search(searchString) {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                query: searchString,
                //language: 'en-US',
            }
        };
        return API().get(`/search/movie`, config)
                    .then(response => {
                        return response.data
                    });
    },
    getPosterImageUrl(posterPath) {
        let baseImgUrl = 'https://image.tmdb.org/t/p/';
        return baseImgUrl.concat('original', posterPath);
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
    fetchSingleMovie(id) {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
            }
        };
        return API().get(`/movie/${id}`, config)
                    .then(response => {
                        console.log(response.data);
                        return response.data
                    });
    }
}
