import axios from 'axios'

const url = 'http://localhost:3000/'

export default {
    getTimetables() {
        return axios.get(url + 'timetables')
            .then(response => response.data)
    },

    postTimetable(data) {
        return axios.post(url + 'timetables', data)
            .then(response => response.data)
    },

    updateTimetable(id, data) {
        return axios.put(url + 'timetables/' + id, data)
            .then(response => response)
    },

    deleteTimetable(id) {
        return axios.delete(url + 'timetables/' + id)
            .then(response => response)
    }
}