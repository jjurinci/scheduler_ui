import axios from 'axios'

const url = 'http://localhost:3000/'

export default {
    getInfoFaculties(id) {
        return axios.get(url + 'faculties/deleteInfo/' + id)
            .then(response => response)
    },

    getInfoSemesters(id) {
        return axios.get(url + 'semesters/deleteInfo/' + id)
            .then(response => response)
    },

    getInfoSubjects(id) {
        return axios.get(url + 'subjects/deleteInfo/' + id)
            .then(response => response)
    },

    getInfoClassrooms(id) {
        return axios.get(url + 'classrooms/deleteInfo/' + id)
            .then(response => response)
    },
    getInfoProfessors(id) {
        return axios.get(url + 'professors/deleteInfo/' + id)
            .then(response => response)
    },
    getInfoTimetables(id){
        return axios.get(url + 'timetables/deleteInfo/' + id)
               .then(response => response)
    }
}