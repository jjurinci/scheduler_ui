import axios from 'axios'
import config from './config.js'

const url = config.dmlUrl

export default {
    getSchedules() {
        return axios.get(url + 'schedules')
            .then(response => response.data)
    },

    postSchedule(data) {
        return axios.post(url + 'schedules', data)
            .then(response => response.data)
    },

    replaceSchedule(id, data){
        return axios.put(url + 'schedules/' + id, data)
               .then(response => response.data)
    },

    updateSchedule(id, data) {
        return axios.patch(url + 'schedules/' + id, data)
            .then(response => response.data)
    },

    deleteSchedule(id) {
        return axios.delete(url + 'schedules/' + id)
            .then(response => response.data)
    }
}