<template>
<div class="container-fluid" style="padding: 0px">
  <Navigation2 v-if="timetables.length > 0 && loaded"
               :timetables="timetables"
               :allSubjects="subjects"
               :getDataFromDB="getDataFromDB"
               @changeTimetable="changeTimetable"
               @adjustDatepickerStyle="adjustDatepickerStyle"
               @adjustEditDatepickerStyle="adjustEditDatepickerStyle"
               @loadEditTimetableData="loadEditTimetableData"
               @saveSolverTimetableToDB="saveSolverTimetableToDB"              
               style="padding: 0px 15px 0px 15px;"/>

  <hr v-if="timetables.length > 0 && loaded" style="margin-bottom:0px;"/>
  
  <NavigationLower v-if="timetables.length > 0 && loaded"
                   :faculties="faculties" :facultyIdToSemesters="facultyIdToSemesters"
                   :classrooms="classrooms" :professors="professors"
                   @selectedFilterChanged="selectedFilterChanged"
                   @filterTimetableAllSchedules="filterTimetableAllSchedules"
                   @filterTimetableBySemester="filterTimetableBySemester"
                   @filterTimetableByProfessor="filterTimetableByProfessor"
                   @filterTimetableByClassroom="filterTimetableByClassroom"/>


  <calendar v-if="timetables.length > 0 && loaded"
    style="height: 800px; padding: 0px 15px 0px 15px;"
    ref="theCalendar"
    :calendars="calendarOptions.calendarList"
    :schedules="calendarOptions.scheduleList"
    :view="calendarOptions.view"
    :taskView="calendarOptions.taskView"
    :scheduleView="calendarOptions.scheduleView"
    :theme="calendarOptions.theme"
    :week="calendarOptions.week"
    :disableDblClick="calendarOptions.disableDblClick"
    :isReadOnly="calendarOptions.isReadOnly"
    :template="calendarOptions.template"
    :useCreationPopup="calendarOptions.useCreationPopup"
    :useDetailPopup="calendarOptions.useDetailPopup"
    @beforeCreateSchedule="beforeCreateSchedule"
    @clickSchedule="clickSchedule"
    @beforeUpdateSchedule="beforeUpdateSchedule" 
/>

<div v-else-if="loaded" class="text-right">
  <h2 class="mt-4 text-right" style="color: #0069d9; font-weight:bold;">You must have at least 1 timetable created to continue.</h2>
</div>

<AddTimetableModal :createTimetable="createTimetable" :feedback="feedback" @addTimetable="addTimetable"/>
<AddScheduleModal v-if="loaded" :selectedCreate="selectedCreate" :classrooms="classrooms" :feedback="feedback" @createSchedule="createSchedule"/>
<EditScheduleModal v-if="loaded" :selectedCreate="selectedCreate" :classrooms="classrooms" :feedback="feedback" @editSchedule="editSchedule" @deleteSchedule="deleteSchedule"/>
<EditTimetableModal v-if="loaded" :editTimetable="editTimetable" :feedback="feedback" @updateTimetable="updateTimetable"/>
<TimetableFeedbackModal v-if="loaded" :feedback="feedback"/>
</div>
</template>

<script>
import $ from 'jquery'
import { Calendar } from '@toast-ui/vue-calendar'
import Navigation from './Navigation/Navigation.vue'
import Navigation2 from './Navigation/Navigation2.vue'
import NavigationLower from './Navigation/NavigationLower.vue'

import timetableData from './timetableData.js'
import timetableMethods from './timetableMethods.js'
import timetableWatch from './timetableWatch.js'

import AddTimetableModal from './Modals/AddTimetableModal.vue'
import AddScheduleModal from './Modals/AddScheduleModal.vue'
import EditScheduleModal from './Modals/EditScheduleModal.vue'
import EditTimetableModal from './Modals/EditTimetableModal.vue'
import TimetableFeedbackModal from './Modals/TimetableDBFeedback.vue'

export default {
    name: 'Solver',
    props: {
      propTimetables: Array,
      propAllSchedules: Array,
      getDataFromDB: Boolean
    },
    components: {
      AddTimetableModal,
      AddScheduleModal,
      EditScheduleModal,
      EditTimetableModal,
      TimetableFeedbackModal,
      Navigation,
      Navigation2,
      NavigationLower,
      calendar: Calendar
    },

    data(){
      return{
        ...timetableData,
      }
    },

    methods: {
      ...timetableMethods
    },
    async mounted(){
      this.user = JSON.parse(await localStorage.getItem('user'))
      
      if(this.getDataFromDB){
        this.timetables = await this.getTimetables()
        this.allSchedules = await this.getSchedules()
      }
      else{
        this.timetables = this.propTimetables
        this.allSchedules = this.propAllSchedules
        for(let i=0; i<this.timetables.length; i++){
          let t = this.timetables[i]
          this.solverTimetableSaved[t._id] = false
        }
      }

      if(this.timetables.length == 0){
        this.$root.$emit("noTimetables")
        this.adjustDatepickerStyle()
        window.$('#addTimetable').modal({ show: true })
      }
      
      this.faculties = await this.getFaculties()
      this.semesters = await this.getSemesters()
      this.professors = await this.getProfessors()
      this.classrooms = await this.getClassrooms()
      this.prepareData()
      this.subjects = await this.getSubjects()
      await this.loadStyling()
      
      this.$root.$on('subjectClicked', selectedCreate => {
        this.selectedCreate.subject = this.subjects.find(s => s._id == selectedCreate.subject._id)
      })
      this.$root.$on('classroomClicked', selectedCreate => {
        console.log("received: ", selectedCreate)
        this.selectedCreate.classroom = selectedCreate.classroom
      })

      this.loaded = true
      
    },
    watch:{
      ...timetableWatch
    }
}
</script>

<style src="vue2-timepicker/dist/VueTimepicker.css"></style>
<style src="tui-calendar/dist/tui-calendar.css"></style>
<style src="tui-date-picker/dist/tui-date-picker.css"></style>
<style src="tui-time-picker/dist/tui-time-picker.css"></style>

<style lang="scss">
  @import './timetableStyle.scss';
</style>