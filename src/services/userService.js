import axios from 'axios'
import config from './config.js'

const url = config.dmlUrl

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