import axios from 'axios'

const url = 'https://sched-backend.herokuapp.com/'

export default {
    login(data) {
        return axios.get(url + 'login', data)
            .then(response => response.data)
    },

    register(data) {
        return axios.post(url + 'register', data)
            .then(response => response.data)
    }
}