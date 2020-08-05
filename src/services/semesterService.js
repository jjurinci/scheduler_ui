import axios from 'axios'

const url = 'https://sched-backend.herokuapp.com/'

export default {
    getSemesters(){
        return axios.get(url + 'semesters')
                    .then(response => response.data)
    },

    postSemester(data) {
        return axios.post(url + 'semesters', data)
                    .then(response => response.data)
    },

    updateSemester(id, data){
        return axios.put(url + 'semesters/' + id, data)
                    .then(response => response.data)
    },

    deleteSemester(id){
        return axios.delete(url + 'semesters/' + id)
                    .then(response => response.data)
    }
}