<template>
<div class="container-fluid">
    <DataNavigation :whoIsParent="'classroom'" 
                    @addClassroom="openAddClassroomModal" @editClassroom="openEditClassroomModal" @deleteClassroom="openDeleteClassroomModal"/>
    <hr style="margin-bottom:0px;"/>
    <DataNavigationLower/>
    
    <div class="col-12 mt-4">
      <vue-table-dynamic :params="params" @row-click="rowClick" ref="table"></vue-table-dynamic>
    </div>

<!-- Modal Add -->
<div class="modal" id="addClassroom" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Add classroom</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="professor">Classroom name</label>
            <input v-model="classroomName" type="text" class="form-control" id="professor">
          </div>
          <div class="form-group">
            <label for="professor">Classroom capacity</label>
            <input v-model="classroomCapacity" type="number" class="form-control" id="professor">
          </div>
          <div class="form-check">
                <input v-model="classroomComputers" type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Has computers</label>
          </div>

        </form>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="addClassroom" id="addClassroomBtn" type="button" class="btn btn-primary">Add</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Edit -->
<div class="modal" id="editClassroom" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Edit classroom</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="professor">Classroom name</label>
            <input v-model="editClassroomName" type="text" class="form-control" id="professor">
          </div>
          <div class="form-group">
            <label for="professor">Classroom capacity</label>
            <input v-model="editClassroomCapacity" type="number" class="form-control" id="professor">
          </div>
          <div class="form-check">
                <input v-model="editClassroomComputers" type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Has computers</label>
          </div>

        </form>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="editClassroom" type="button" class="btn btn-primary">Edit</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Delete -->
<div class="modal fade" id="deleteClassroom" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Delete semester</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h3 class="mb-4">Are you sure?</h3>
        <p>Deleting this classroom will result in <b>deletion</b> of the following number of items that <b>reference this classroom</b>:</p> 
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Schedules: {{deleteInfo.needsDeleteSchedules}}</li>
        </ul>

        <p style="color: red;" class="mt-4">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="deleteClassroom"  type="button" class="btn btn-danger">Confirm delete</button>
      </div>
    </div>
  </div>
</div>

</div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import classroomService from '@/services/classroomService'
import deleteInfoService from '@/services/deleteInfoService'

import DataNavigation from '@/components/DataNavigation.vue'
import DataNavigationLower from '@/components/DataNavigationLower.vue'

export default {
    data(){
        return {
            classrooms: [],
            classroomName: '',
            classroomCapacity: 0,
            classroomComputers: false,

            editClassroomName: '',
            editClassroomCapacity: 0,
            editClassroomComputers: false,
            nextEditClassroom: {},
            nextDeleteClassroom: {},
            feedback: '',
            editClassroomIndex: -1,
            indexToClassroomId: {},
            params: {
              data: [
                ['#', 'Name', 'Capacity', 'Has Computers'],
              ],
              header: 'row',
              border: true,
              stripe: true,
              enableSearch: true,
              sort: [0,1,2,3],
              pagination: true,
              highlight: {row: [1]}
            },

            deleteInfo: {
              needsDeleteClassrooms: 0,
              needsDeleteSchedules: 0
            }
        }
    },
    components: {
      DataNavigation,
      DataNavigationLower
    },

    methods: {
        rowClick(index, row){
          this.nextEditClassroom._id = this.indexToClassroomId[index]
          this.nextDeleteClassroom._id = this.indexToClassroomId[index]
          this.editClassroomName = row[1]
          this.editClassroomCapacity = row[2]
          this.editClassroomComputers = row[3]
          this.editClassroomIndex = index

          this.params.highlight.row = []
          this.params.highlight.row.push(index)
        },
        openAddClassroomModal(){
          this.feedback = ''
          window.$('#addClassroom').modal('show');
        },
        openEditClassroomModal(){
          this.feedback = ''
          window.$('#editClassroom').modal('show');
        },
        async openDeleteClassroomModal(){
          this.feedback = ''
          await this.classroomDeleteInfo()
          window.$('#deleteClassroom').modal('show');
        },

        resetDeleteInfo(){
          this.deleteInfo = {
            needsDeleteClassrooms: 0,
            needsDeleteSchedules: 0
          }
        },
        async addClassroom(){
            this.feedback = ''
            if (this.classroomName == '' || this.classroomCapacity == 0) this.feedback = "Please enter all fields."
            else {
                let obj = {name: this.classroomName, capacity: this.classroomCapacity, hasComputers: this.classroomComputers, userId: this.user._id}
                let response = await classroomService.postClassroom(obj)
                if(response.status == "success"){
                    obj._id = response.id
                    this.indexToClassroomId[this.params.data.length] = obj._id
                    this.params.data.push([this.params.data.length, obj.name, obj.capacity, obj.hasComputers])
                    
                    this.feedback = "Successfully added."
                }
                //window.$('#addClassroom').modal('hide');
            }
        },
        async editClassroomModal(classroom){
            this.nextEditClassroom = classroom
            this.classroomName = ''
            this.classroomCapacity = 0
            this.feedback = ''
            window.$('#editClassroom').modal({show: true})
        },

        async editClassroom(){
            let classroom = this.nextEditClassroom
            if(this.editClassroomName == '' || this.editClassroomCapacity==0) this.feedback = "Please enter all fields.";
            else{
                classroom.name = this.editClassroomName
                classroom.capacity = this.editClassroomCapacity
                classroom.hasComputers = this.editClassroomComputers
                classroom.userId = this.user._id
                let response = await classroomService.updateClassroom(classroom._id, classroom)
                if(response.status == "success"){
                    let newRow = [this.editClassroomIndex, classroom.name, classroom.capacity, classroom.hasComputers]
                    Vue.set(this.params.data, this.editClassroomIndex, newRow)
                    window.$('#editClassroom').modal('hide');
                }
            }
        },

        async deleteClassroom(){
            let response = await classroomService.deleteClassroom(this.nextDeleteClassroom._id)
            if(response.status == 200){
                this.$router.go(0)
                //let index = this.classrooms.findIndex(el => el._id == this.nextDeleteClassroom._id)
                //this.classrooms.splice(index,1)
                //window.$('#deleteClassroom').modal('hide');
            }
        },

        async classroomDeleteInfo(){
          this.feedback = ''
          this.resetDeleteInfo()
          let id = this.nextDeleteClassroom._id
          let response = await deleteInfoService.getInfoClassrooms(id).catch(err => this.feedback = "Internal server error.")
          if(response.status == 200) this.deleteInfo = response.data
        },
    },

    async mounted(){
        this.user = JSON.parse(await localStorage.getItem('user'))
        this.classrooms = (await classroomService.getClassrooms()).filter(el => el.userId == this.user._id)
        
        for(let i=0;i<this.classrooms.length;i++){
          let c = this.classrooms[i]
          this.indexToClassroomId[i+1] = c._id
          let row = [i+1, c.name, c.capacity, c.hasComputers]
          this.params.data.push(row)
        }
        if(this.params.data.length>1) this.rowClick(1, this.params.data[1])
        
        window.$(document).on('keypress',e => {
          let modalOpen = window.$('#addClassroom').hasClass('show')
          if(e.which == 13 && modalOpen) window.$("#addClassroomBtn").click()
        });
    }
}
</script>

<style lang="scss" scoped>

</style>