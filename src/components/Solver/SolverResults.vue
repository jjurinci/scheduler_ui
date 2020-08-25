<template>
<div class="container-fluid">
    <SolverNavigation :whoIsParent="'solverResults'" :finalTimetables="finalTimetables" @startSolver="start" @stopSolver="stop"/>
    <hr/>

    <p v-if="startClicked && !finalTimetables" class="mt-4" style="font-size:25px !important;">
        <span v-if="stopClicked">Solver stopping. Please wait...</span>
        <span v-else-if="!loadedData">Solver starting. Please wait...</span>
        <span v-else-if="!optimal">{{currentBestGrade.generation}}. generation</span>
        <span v-else>Solution is optimal. Please wait...</span>
    </p>
    
    <h3 v-if="finalTimetables" class="mt-4 mb-4">5 new timetables successfully generated.</h3>
    <button v-if="finalTimetables" @click="next" class="btn btn-success btn-lg">Plug them into calendar</button>
    <p class="mt-4" style="color:red;">{{feedback}}</p>

    <div class="row" style="margin-bottom:70px;">
        <div class="col-4 mt-4">
            <vue-ellipse-progress :progress="currentProgress.best" color="green" :size="280" :legend="true" :legendValue="currentProgress.best.toFixed(1)" animation="reverse 700 400"
                                    fontColor="black" fontSize="3rem">
                                    <span slot="legend-value">/100</span>
                                    <p slot="legend-caption">
                                        TOTAL GRADE:<br>
                                        <span style="font-size:20px;">{{currentBestGrade.best}}</span>
                                    </p>
            </vue-ellipse-progress>
        </div>

        <div class="col-4 mt-4">
            <vue-ellipse-progress :progress="currentProgress.classrooms" color="blue" :size="280" :legend="true" :legendValue="currentProgress.classrooms.toFixed(1)" animation="reverse 700 400"
                                    fontColor="black" fontSize="3rem">
                                    <span slot="legend-value">/100</span>
                                    <p slot="legend-caption">
                                        Classroom <br/>collisions grade:<br>
                                        <span style="font-size:20px;">{{currentBestGrade.classrooms}}</span>
                                    </p>
            </vue-ellipse-progress>
        </div>

        <div class="col-4 mt-4">
            <vue-ellipse-progress :progress="currentProgress.professors" color="blue" :size="280" :legend="true" :legendValue="currentProgress.professors.toFixed(1)" animation="reverse 700 400"
                                    fontColor="black" fontSize="3rem">
                                    <span slot="legend-value">/100</span>
                                    <p slot="legend-caption">
                                        Professor collisions grade:<br>
                                        <span style="font-size:20px;">{{currentBestGrade.professors}}</span>
                                    </p>
            </vue-ellipse-progress>
        </div>

        <div class="col-4 mt-4">
            <vue-ellipse-progress :progress="currentProgress.semesters" color="blue" :size="280" :legend="true" :legendValue="currentProgress.semesters.toFixed(1)" animation="reverse 700 400"
                                    fontColor="black" fontSize="3rem">
                                    <span slot="legend-value">/100</span>
                                    <p slot="legend-caption">
                                        Semester collisions grade:<br>
                                        <span style="font-size:20px;">{{currentBestGrade.semesters}}</span>
                                    </p>
            </vue-ellipse-progress>
        </div>

        <div class="col-4 mt-4">
            <vue-ellipse-progress :progress="currentProgress.capacity" color="blue" :size="280" :legend="true" :legendValue="currentProgress.capacity.toFixed(1)" animation="reverse 700 400"
                                    fontColor="black" fontSize="3rem">
                                    <span slot="legend-value">/100</span>
                                    <p slot="legend-caption">
                                        Classroom capacity grade:<br>
                                        <span style="font-size:20px;">{{currentBestGrade.capacity}}</span>
                                    </p>
            </vue-ellipse-progress>
        </div>

        <div class="col-4 mt-4">
            <vue-ellipse-progress :progress="currentProgress.computers" color="blue" :size="280" :legend="true" :legendValue="currentProgress.computers.toFixed(1)" animation="reverse 700 400"
                                    fontColor="black" fontSize="3rem">
                                    <span slot="legend-value">/100</span>
                                    <p slot="legend-caption">
                                        Classroom <br/>computers grade:<br>
                                        <span style="font-size:20px;">{{currentBestGrade.computers}}</span>
                                    </p>
            </vue-ellipse-progress>
        </div>
    </div>
</div>
</template>

<script>
import solverService from '@/services/solverService'
import SolverNavigation from './SolverNavigation.vue'
export default {
    props: ["propData"],
    components: {
        SolverNavigation
    },
    data(){
        return {
            user: null,
            solverId: null,
            feedback: '',
            startClicked: false,
            stopClicked: true,
            
            currentBestGrade: {
                best: 0,
                classrooms: 0,
                professors: 0,
                semesters: 0,
                capacity: 0,
                computers: 0
            },
            currentProgress: {
                best: 0,
                classrooms: 0,
                professors: 0,
                semesters: 0,
                capacity: 0,
                computers: 0
            },

            currentWorst: {
                best: -10000,
                classrooms: -10000,
                professors: -10000,
                semesters: -10000,
                capacity: -10000,
                computers: -10000,
            },
            loadedData: false,
            optimal: false,
            finalTimetables: null,

            dontRefreshNextPage: false,
        }
    },

    methods: {
        next(){
            this.dontRefreshNextPage = true
            let propData = {"finalTimetables": this.finalTimetables, "oldPropData": this.propData}
            this.$router.push({'name': 'Solver Calendar', params: {propData: propData}})
        },
        async poll(userId, solverId){
            
            while(!this.stopClicked){
                let response = await solverService.pollOverUrl(userId, solverId).catch(err => {return})
                if(response){
                    let grades = response.data
                    this.loadedData = true
                    if("done" in grades[grades.length-1]) break
                    this.currentBestGrade = grades[grades.length-1]
                    if(this.currentBestGrade.best == 0) this.optimal = true

                    this.currentProgress.best = (Math.abs(this.currentWorst.best) - Math.abs(this.currentBestGrade.best))/Math.abs(this.currentWorst.best) * 100
                    this.currentProgress.classrooms = (Math.abs(this.currentWorst.classrooms) - Math.abs(this.currentBestGrade.classrooms))/Math.abs(this.currentWorst.classrooms) * 100
                    this.currentProgress.professors = (Math.abs(this.currentWorst.professors) - Math.abs(this.currentBestGrade.professors))/Math.abs(this.currentWorst.professors) * 100
                    this.currentProgress.semesters = (Math.abs(this.currentWorst.semesters) - Math.abs(this.currentBestGrade.semesters))/Math.abs(this.currentWorst.semesters) * 100
                    this.currentProgress.capacity = (Math.abs(this.currentWorst.capacity) - Math.abs(this.currentBestGrade.capacity))/Math.abs(this.currentWorst.capacity) * 100
                    this.currentProgress.computers = (Math.abs(this.currentWorst.computers) - Math.abs(this.currentBestGrade.computers))/Math.abs(this.currentWorst.computers) * 100
                }
                await new Promise(r => setTimeout(r, 5000));
            }
            let response = undefined
            let repeat = 0
            while(response == undefined && repeat<10){
                await new Promise(r => setTimeout(r, 5000))
                response = await solverService.getFinalTimetables(userId, solverId).catch(err => {return})
                repeat++
            }
            this.finalTimetables = response.data
        },

        async start(){
            this.startClicked = true
            this.stopClicked = false
            
            this.feedback = ''
            this.propData.userId = this.user._id
            let obj = {"data": this.propData}
            let response = await solverService.postSolver(obj).catch(err => {
               return
            })
            this.solverId = response.data.data.solverId
            await this.poll(this.user._id, this.solverId)
        },
        async stop(){
            this.stopClicked = true

            this.feedback = ''
            if(!this.solverId){
                this.feedback = "You didn't start the solver."
                return
            }
            let obj = {"data": {"userId": this.user._id, "solverId": this.solverId} }
            let response = await solverService.postStopSolver(obj).catch(err => {
                return
            })
        }
    },

    async mounted(){
        this.user = JSON.parse(await localStorage.getItem('user'))
    },

    beforeDestroy(){
        if(this.dontRefreshNextPage) return
        this.stop()
        this.$router.go()
    }
}
</script>

<style lang="scss" scoped>

</style>