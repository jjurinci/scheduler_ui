import axios from 'axios'

const url = 'http://localhost:3000/'

export default {
    login(data) {
        return axios.post(url + 'login', data)
            .then(response => response.data)
    },

    register(data) {
        return axios.post(url + 'register', data)
            .then(response => response.data)
    }
}