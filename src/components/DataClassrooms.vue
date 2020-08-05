<template>
<div class="container-fluid" style="margin-top:40px;">
    <Toolbar class="w-75 mx-auto"/>

    <button @click="classroomName = ''; classroomCapacity=0; feedback=''" class="btn btn-primary mb-4" data-toggle="modal" data-target="#addClassroom" style="margin-top:60px;">Add new classroom</button>
    <table class="table w-75 mx-auto text-center">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col" style="word-wrap: break-word;max-width: 70px;">Capacity</th>
            <th scope="col">Computers</th>
            <th scope="col">Options</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(classroom, index) in this.classrooms" :key="classroom._id">
                <th scope="row">{{index+1}}</th>
                <td>{{classroom.name}}</td>
                <td style="word-wrap: break-word;max-width: 70px;">{{classroom.capacity}}</td>
                <td>{{classroom.computers}}</td>
                <td>
                    <button @click="editClassroomModal(classroom)" class="btn btn-primary mr-2">Edit</button>
                    <button @click="deleteClassroom(classroom)" class="btn btn-danger">Delete</button>
                </td>
            </tr>
        </tbody>
    </table>

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
            <input v-model="classroomCapacity" type="text" class="form-control" id="professor">
          </div>
          <div class="form-check">
                <input v-model="classroomComputers" type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Racunalna</label>
          </div>

        </form>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="addClassroom" type="button" class="btn btn-primary">Add</button>
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
            <input v-model="editClassroomCapacity" type="text" class="form-control" id="professor">
          </div>
          <div class="form-check">
                <input v-model="editClassroomComputers" type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Racunalna</label>
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

</div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import classroomService from '@/services/classroomService'
import Toolbar from '@/components/DataToolbar.vue'
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
            feedback: '',
        }
    },
    components: {
      Toolbar
    },

    methods: {
        async addClassroom(){
            this.feedback = ''
            if (this.classroomName == '' || this.classroomCapacity == 0) this.feedback = "Please enter all fields."
            else {
                let obj = {name: this.classroomName, capacity: this.classroomCapacity, computers: this.classroomComputers}
                let response = await classroomService.postClassroom(obj)
                if(response.status == "success"){
                    obj._id = response.id
                    this.classrooms.push(obj)
                }
                window.$('#addClassroom').modal('hide');
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
                classroom.computers = this.editClassroomComputers
                let response = await classroomService.updateClassroom(classroom._id, classroom)
                if(response.status == "success"){
                    let index = this.classrooms.findIndex(el => el._id == classroom._id)
                    Vue.set(this.classrooms, index, classroom)
                    window.$('#editClassroom').modal('hide');
                }
            }
        },

        async deleteClassroom(classroom){
            let response = await classroomService.deleteClassroom(classroom._id)
            if(response.status == "success"){
                let index = this.classrooms.findIndex(el => el._id == classroom._id)
                this.classrooms.splice(index,1)
            }
        }
    },

    async mounted(){
        this.classrooms = await classroomService.getClassrooms()
    }
}
</script>

<style lang="scss" scoped>

</style>