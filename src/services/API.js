import axios from "axios";

export default(url = 'https://api.themoviedb.org/3') => {
    return axios.create({
        baseURL: url
    })
}
