import axios from 'axios'

const url = 'http://127.0.0.1:5000/'

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