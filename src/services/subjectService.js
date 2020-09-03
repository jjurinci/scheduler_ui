import axios from 'axios'
import config from './config.js'

const url = config.dmlUrl

export default {
    getSubjects() {
        return axios.get(url + 'subjects')
            .then(response => response.data)
    },

    postSubject(data) {
        return axios.post(url + 'subjects', data)
            .then(response => response.data)
    },

    updateSubject(id, data) {
        return axios.put(url + 'subjects/' + id, data)
            .then(response => response.data)
    },

    deleteSubject(id) {
        return axios.delete(url + 'subjects/' + id)
            .then(response => response)
    }
}