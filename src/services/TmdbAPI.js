import API from './API.js';

export default {
    search(searchString) {
        let config = {
            params: {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                query: searchString
            }
        };
        return API().get(`/search/movie`, config)
                    .then(response => {
                        return response.data
                    });
    }
}
