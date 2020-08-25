<template>
<div class="row mt-4 mb-4">  
    <div id="timetableCol" class="col-3" :key="this.timetables.length">
        <select 
                v-model="selectedTimetable_mut" id="test"
                class="__selectpicker mr-2" data-live-search="true" data-width="100%" title="Select timetable">
            <option v-for="timetable in this.timetables" :key="timetable._id" :value="timetable">
                {{timetable.name}}
            </option>
        </select>
    </div>

    <div id="semesterCol" class="col-3" :key="selectedSeason + '1'">
        <select v-model="selectedFilter_mut.semester"  
                class="__selectpicker" data-live-search="true" data-width="100%" title="Filter by semester" @change="filterTimetableBySemester">
            <optgroup v-for="faculty in this.faculties" :key="faculty._id" :label="faculty.name">
                <option v-for="semester in selectedSeasonSemesters(faculty._id)" :key="semester._id" :value="semester" :data-tokens="semester.facultyName">
                    {{semester.name}}
                </option>
            </optgroup>
        </select>
    </div>

    <div id="professorCol" class="col-3">
      <select v-model="selectedFilter_mut.professor"  
              class="__selectpicker mr-2" data-live-search="true" data-width="100%" title="Filter by professor" @change="filterTimetableByProfessor">
          
          <option v-for="professor in this.professors" :key="professor._id" :value="professor">
              {{professor.firstName + ' ' + professor.lastName}}
          </option>
      </select>
    </div>
    <div id="classroomCol" class="col-3">
      <select v-model="selectedFilter_mut.classroom"  
              class="__selectpicker" data-live-search="true" data-width="100%" title="Filter by classroom" @change="filterTimetableByClassroom">
          
          <option v-for="classroom in this.classrooms" :key="classroom._id" :value="classroom">
              {{classroom.name}}
          </option>
      </select>
    </div>

    <!--non-Solver buttons-->
    <div v-if="getDataFromDB" class="col-12 mt-2 text-left">
        <button @click="adjustDatepickerStyle" class="btn btn-primary mr-2" data-toggle="modal" data-target="#addTimetable">+ Add timetable</button>
        <button @click="adjustEditDatepickerStyle" class="btn btn-primary mr-2" data-toggle="modal" data-target="#editTimetable">Edit timetable</button>
        <button @click="timetableDeleteInfo" class="btn btn-danger mr-2" data-toggle="modal" data-target="#deleteModal">- Delete timetable</button>
        <button class="btn btn-primary" @click="filterTimetableAllSchedules">Reset filters</button>
    </div>

    <!-- Solver buttons -->
    <div v-else class="col-12 mt-2 text-left">
        <button @click="saveSolverTimetableToDB" class="btn btn-success">Save solver timetable to DB</button>
        <button class="btn btn-primary" @click="filterTimetableAllSchedules">Reset filters</button>
    </div>
    <h3 class="mt-4 text-center" style="color: red;">{{feedback}}</h3>

    <div id="subjectCol" class="col-6 mx-auto mt-4" :key="this.selectedSeason">
      <p>Schedule a subject: </p>
        <select v-model="selectedCreate_mut.subject" id="yolo"
                class="__selectpicker" data-live-search="true" data-width="100%" title="Schedule a subject">      
            <option v-for="subject in this.currentSubjects" :key="subject._id" :value="subject">
                {{subject.name}}
            </option>
        </select>
      <p v-if="selectedCreate_mut.subject && selectedTimetable_mut">
        Hr/week | 
        Theory: {{Math.ceil(selectedCreate_mut.subject.theoryHr / selectedTimetable_mut.weeks)}}
        Practice: {{Math.ceil(selectedCreate_mut.subject.practiceHr / selectedTimetable_mut.weeks)}}
        Seminar: {{Math.ceil(selectedCreate_mut.subject.seminarHr / selectedTimetable_mut.weeks)}}
      </p>
      <div class="btn-group">
          <button @click="swapSubjectsToWinter" :class="(selectedSeason == 'winter') ? 'btn btn-primary mr-2' : 'btn btn-outline-primary mr-2'">Winter subjects</button>
          <button @click="swapSubjectsToSummer" :class="(selectedSeason == 'summer') ? 'btn btn-primary mr-2' : 'btn btn-outline-primary mr-2'">Summer subjects</button>
      </div>

    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Delete timetable</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <h3 class="mb-4">Are you sure?</h3>
                <p>Deleting this timetable will result in <b>deletion</b> of the following number of items that <b>reference this timetable</b>:</p> 
                <ul class="list-group list-group-flush">
                <li class="list-group-item">Schedules: {{deleteInfo.needsDeleteSchedules}}</li>
                </ul>
                <p style="color: red;" class="mt-4">{{feedbackModal}}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
                <button @click="deleteTimetable"  type="button" class="btn btn-danger">Confirm delete</button>
            </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import timetableService from '@/services/timetableService.js'
import deleteInfoService from '@/services/deleteInfoService.js'
export default {
    props: {
        selectedTimetable: Object,
        selectedCreate: Object,
        selectedFilter: Object,
        facultyIdToSemesters: Object,
        timetables: Array,
        faculties: Array,
        professors: Array,
        classrooms: Array,
        allSubjects: Array,
        winterSubjects: Array,
        summerSubjects: Array,
        loaded: Boolean,
        feedback: String,
        getDataFromDB: Boolean,
    },
    data() {
        return {
            selectedTimetable_mut: null,
            selectedCreate_mut: this.selectedCreate,
            selectedFilter_mut: this.selectedFilter,
            timetables_mut: this.timetables,
            loadedMutables: false,

            currentSubjects: this.winterSubjects,
            selectedSeason: 'winter',

            deleteInfo: {
                needsDeleteTimetables: 0,
                needsDeleteSchedules: 0
            },
            feedbackModal: '',
        }
    },
    methods: {
        changeTimetable(selectedTimetable){
            this.filterTimetableAllSchedules()
            this.$emit('changeTimetable', selectedTimetable)
        },
        filterTimetableAllSchedules(){
            this.$emit('filterTimetableAllSchedules')
        },
        filterTimetableBySemester(){
            this.$emit('filterTimetableBySemester')
        },
        filterTimetableByProfessor(){
            this.$emit('filterTimetableByProfessor')
        },
        filterTimetableByClassroom(){
            this.$emit('filterTimetableByClassroom')
        },
        adjustDatepickerStyle(){
            this.$emit('adjustDatepickerStyle')
        },
        adjustEditDatepickerStyle(){
            this.$emit('adjustEditDatepickerStyle')
            this.$emit('loadEditTimetableData', this.selectedTimetable_mut)
        },
        saveSolverTimetableToDB(){
            this.$emit('saveSolverTimetableToDB', this.selectedTimetable_mut, this.allSubjects)
        },
        async swapSubjectsToWinter(){
            this.selectedSeason = 'winter'
            window.$(".__selectpicker").selectpicker();
            this.currentSubjects = this.winterSubjects
            this.currentSubjects = this.currentSubjects.slice()
            
            await this.renderSelect()
            if(this.currentSubjects.length > 0) this.selectedCreate_mut.subject = this.currentSubjects[0]
        },
        async swapSubjectsToSummer(){
            this.selectedSeason = 'summer'
            window.$(".__selectpicker").selectpicker();
            this.currentSubjects = this.summerSubjects
            this.currentSubjects = this.currentSubjects.slice()
            
            await this.renderSelect()
            if(this.currentSubjects.length > 0) this.selectedCreate_mut.subject = this.currentSubjects[0]
        },
        selectedSeasonSemesters: function(facultyId){
            let semesters
            if(this.selectedSeason == 'winter')
                semesters = this.facultyIdToSemesters[facultyId].filter(sem => sem.season == 'winter')
            else if(this.selectedSeason == 'summer')
                semesters = this.facultyIdToSemesters[facultyId].filter(sem => sem.season == 'summer')
            
            return semesters
        },

        resetDeleteInfo(){
          this.deleteInfo = {
            needsDeleteTimetables: 0,
            needsDeleteSchedules: 0
          }
        },
        async timetableDeleteInfo(){
          this.feedbackModal = ''
          this.resetDeleteInfo()
          let response = await deleteInfoService.getInfoTimetables(this.selectedTimetable_mut._id).catch(err => this.feedbackModal = "Internal server error.")
          if(response.status == 200) this.deleteInfo = response.data
        },
        async deleteTimetable(){
            let response = await timetableService.deleteTimetable(this.selectedTimetable_mut._id).catch(err => this.feedbackModal = err.message)
            if(response.status == 200){
                this.$router.go(this.$router.currentRoute) //for now just refresh the page
                let index = this.timetables.findIndex(el => el._id == this.selectedTimetable_mut._id)
                this.timetables.splice(index,1)
                window.$('#deleteModal').modal('hide');
            }
        },
        renderSelect(){
            window.$('.__selectpicker').selectpicker('render')
        },
    },

    mounted(){
        this.selectedTimetable_mut = this.selectedTimetable
        if(this.winterSubjects.length > 0) this.selectedCreate_mut.subject = this.winterSubjects[0]
        window.$('.__selectpicker').selectpicker('render')
    },
    updated(){
        this.renderSelect()
    },

    watch: {
        selectedTimetable_mut:{
            //immediate: true,
            deep: true,
            async handler(newval, oldval){

                this.changeTimetable(newval)
            },
        },
        selectedCreate_mut:{
            immediate: true,
            deep: true,
            handler(newval, oldval){
                this.$emit("selectedCreateChanged", newval)
            },
        },
        selectedFilter_mut:{
            immediate: true,
            deep: true,
            handler(newval, oldval){
                this.$emit("selectedFilterChanged", newval)
            }
        },
        timetables:{
            immediate: true,
            deep: true,
            async handler(newval, oldval){
                await this.renderSelect()

                /*if(!this.selectedTimetable_mut && newval.length>0){
                    this.selectedTimetable_mut = newval[0]
                }*/
                this.$forceUpdate()
                this.$emit("timetablesChanged", newval)
            }
        },
    },
}
</script>

<style scoped>

</style>