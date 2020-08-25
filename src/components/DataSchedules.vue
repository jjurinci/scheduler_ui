<template>
<div class="container-fluid" style="margin-top:60px;">
    <Toolbar class="w-75 mx-auto"/>
    <button @click="resetData" class="btn btn-primary mb-4" data-toggle="modal" data-target="#addSchedule" style="margin-top:60px;">Add new schedule</button>
    <table class="table w-75 mx-auto text-center">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Course</th>
            <th scope="col">Classroom</th>
            <th scope="col">Professor</th>
            <th scope="col">Start</th>
            <th scope="col">End</th>
            <th scope="col">Options</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(schedule, index) in this.schedules" :key="schedule._id">
                <th scope="row">{{index+1}}</th>
                <td>{{schedule.courseName}}</td>
                <td>{{schedule.classroomName}}</td>
                <td>{{schedule.professorName}}</td>
                <td>{{schedule.startClean}}</td>
                <td>{{schedule.endClean}}</td>
                <td>
                    <button @click="editScheduleModal(schedule)" class="btn btn-primary mr-2">Edit</button>
                    <button @click="deleteSchedule(schedule)" class="btn btn-danger">Delete</button>
                </td>
            </tr>
        </tbody>
    </table>

<!-- Modal Add -->
<div class="modal" id="addSchedule" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Add schedule</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="professor">Course name</label>
            <input v-model="scheduleCourseName" type="text" class="form-control" id="professor">
          </div>
          <div class="form-group">
            <label for="professor">Classroom name</label>
            <input v-model="scheduleClassroomName" type="text" class="form-control" id="professor">
          </div>
          <div class="form-group">
            <label for="professor">Professor name</label>
            <input v-model="scheduleProfessorName" type="text" class="form-control" id="professor">
          </div>

        </form>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="addSchedule" type="button" class="btn btn-primary">Add</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Edit -->
<div class="modal" id="editSchedule" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Edit schedule</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="professor">Course name</label>
            <input v-model="editScheduleCourseName" type="text" class="form-control" id="professor">
          </div>
          <div class="form-group">
            <label for="professor">Classroom name</label>
            <input v-model="editScheduleClassroomName" type="text" class="form-control" id="professor">
          </div>
          <div class="form-group">
            <label for="professor">Professor name</label>
            <input v-model="editScheduleProfessorName" type="text" class="form-control" id="professor">
          </div>

        </form>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="editSchedule" type="button" class="btn btn-primary">Edit</button>
      </div>
    </div>
  </div>
</div>

</div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import schedulesService from '@/services/schedulesService'
import Toolbar from '@/components/DataToolbar.vue'
export default {

    data(){
        return {
            schedules: [],
            scheduleCourseName: '',
            scheduleProfessorName: '',
            scheduleClassroomName: '',
            scheduleStartDirty: '',
            scheduleEndDirty: '',
            scheduleStartClean: '',
            scheduleEndClean: '',

            editScheduleCourseName: '',
            editScheduleProfessorName: '',
            editScheduleClassroomName: '',
            editScheduleStartDirty: '',
            editScheduleEndDirty: '',
            editScheduleStartClean: '',
            editScheduleEndClean: '',
            nextEditSchedule: {},
            feedback: '',
        }
    },
    components: {
      Toolbar
    },
    methods: {
        resetData(){
            this.scheduleCourseName = ''
            this.scheduleProfessorName = ''
            this.scheduleClassroomName = ''
            this.scheduleStartDirty = ''
            this.scheduleEndDirty = ''
            this.scheduleStartClean = ''
            this.scheduleEndClean = ''

            this.editScheduleCourseName = ''
            this.editScheduleProfessorName = ''
            this.editScheduleClassroomName = ''
            this.editScheduleStartDirty = ''
            this.editScheduleEndDirty = ''
            this.editScheduleStartClean = ''
            this.editScheduleEndClean = ''
            this.nextEditSchedule = {}
            this.feedback = ''
        },
        async addSchedule(){
            this.feedback = ''
            if (this.scheduleCourseName == '' || this.scheduleProfessorName == '' ||
                this.scheduleClassroomName == '') this.feedback = "Please enter all fields."
            else {
                let obj = {courseName: this.scheduleCourseName, classroomName: this.scheduleClassroomName,
                           professorName: this.scheduleProfessorName, startDirty: null, endDirty: null, startClean: null, endClean: null}
                let response = await schedulesService.postSchedule(obj)
                if(response.status == "success"){
                    obj._id = response.id
                    this.schedules.push(obj)
                }
                window.$('#addSchedule').modal('hide');
            }
        },
        async editScheduleModal(schedule){
            this.resetData()
            this.nextEditSchedule = schedule
            window.$('#editSchedule').modal({show: true})
        },

        async editSchedule(){
            let schedule = this.nextEditSchedule
            if(this.editScheduleCourseName == '' || this.editScheduleClassroomName=='' ||
               this.editScheduleProfessorName == '') this.feedback = "Please enter all fields.";
            else{
                schedule.courseName = this.editScheduleCourseName
                schedule.professorName = this.editScheduleProfessorName
                schedule.classroomName = this.editScheduleClassroomName
                let response = await schedulesService.updateSchedule(schedule._id, schedule)
                if(response.status == "success"){
                    let index = this.schedules.findIndex(el => el._id == schedule._id)
                    Vue.set(this.schedules, index, schedule)
                    window.$('#editSchedule').modal('hide');
                }
            }
        },

        async deleteSchedule(schedule){
            let response = await schedulesService.deleteSchedule(schedule._id)
            if(response.status == "success"){
                let index = this.schedules.findIndex(el => el._id == schedule._id)
                this.schedules.splice(index,1)
            }
        }
    },

    async mounted(){
        this.schedules = await schedulesService.getSchedules()
    }
}
</script>

<style lang="scss" scoped>

</style>