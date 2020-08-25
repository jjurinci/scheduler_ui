import axios from 'axios'

const url = 'http://localhost:3000/'

export default {
    getFaculties() {
        return axios.get(url + 'faculties')
            .then(response => response.data)
    },

    postFaculty(data) {
        return axios.post(url + 'faculties', data)
            .then(response => response.data)
    },

    updateFaculty(id, data) {
        return axios.put(url + 'faculties/' + id, data)
            .then(response => response.data)
    },

    deleteFaculty(id) {
        return axios.delete(url + 'faculties/' + id)
            .then(response => response)
    }
}