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
        return baseImgUrl.concat('w154', posterPath);
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
