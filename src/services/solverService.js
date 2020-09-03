import axios from 'axios'
import config from './config.js'

const url = config.solverUrl

export default {
    getFinalTimetables(userid, solverid){
        return axios.get(url + 'solver_timetables/' + userid + '/' + solverid)
                    .then(response => response)
    },

    postSolver(data) {
        return axios.post(url + 'solve', data, {timeout: 10000})
            .then(response => response)
    },

    postStopSolver(data){
        return axios.post(url + 'stop_solver', data)
               .then(response => response)
    },

    pollOverUrl(userid, solverId){
        return axios.get(url + "solver_results/" + userid + "/" + solverId)
               .then(response => response)
    },
}