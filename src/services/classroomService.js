import axios from 'axios'

const url = 'https://sched-backend.herokuapp.com/'

export default {
    getClassrooms() {
        return axios.get(url + 'classrooms')
            .then(response => response.data)
    },

    postClassroom(data) {
        return axios.post(url + 'classrooms', data)
            .then(response => response.data)
    },

    updateClassroom(id, data) {
        return axios.put(url + 'classrooms/' + id, data)
            .then(response => response.data)
    },

    deleteClassroom(id) {
        return axios.delete(url + 'classrooms/' + id)
            .then(response => response.data)
    }
}