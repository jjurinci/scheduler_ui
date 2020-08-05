<template>
<div class="container-fluid" style="margin-top:60px;">
    <Toolbar class="w-75 mx-auto"/>
    <button @click="semesterName = ''; semesterCount=0; feedback=''" class="btn btn-primary mb-4" data-toggle="modal" data-target="#addSemester" style="margin-top:60px;">Add new semester</button>
    <table class="table w-75 mx-auto text-center">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col" style="word-wrap: break-word;max-width: 50px;">Students</th>
            <th scope="col">Options</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(semester, index) in this.semesters" :key="semester._id">
                <th scope="row">{{index+1}}</th>
                <td>{{semester.name}}</td>
                <td style="word-wrap: break-word;max-width: 50px;">{{semester.numStudents}}</td>
                <td>
                    <button @click="editSemesterModal(semester)" class="btn btn-primary mr-2">Edit</button>
                    <button @click="deleteSemester(semester)" class="btn btn-danger">Delete</button>
                </td>
            </tr>
        </tbody>
    </table>

<!-- Modal Add -->
<div class="modal" id="addSemester" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Add semester</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="predmet">Semester name</label>
            <input v-model="semesterName" type="text" class="form-control" id="predmet">
          </div>
          <div class="form-group">
            <label for="predmet">Semester student count</label>
            <input v-model="semesterCount" type="number" class="form-control" id="predmet">
          </div>
        </form>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="addSemester" type="button" class="btn btn-primary">Add</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Edit -->
<div class="modal" id="editSemester" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Edit semester</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="professor">Semester name</label>
            <input v-model="editSemesterName" type="text" class="form-control" id="professor">
          </div>
          <div class="form-group">
            <label for="professor">Semester student count</label>
            <input v-model="editSemesterStCount" type="number" class="form-control" id="professor">
          </div>

        </form>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="editSemester" type="button" class="btn btn-primary">Edit</button>
      </div>
    </div>
  </div>
</div>

</div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import semesterService from '@/services/semesterService'
import Toolbar from '@/components/DataToolbar.vue'
export default {
    data(){
        return {
            semesters: [],
            semesterName: '',
            semesterCount: 0,

            editSemesterName: '',
            editSemesterStCount: 0,
            nextEditSemester: {},
            feedback: '',
            counter: 1,
        }
    },
    components: {
      Toolbar
    },
    methods: {
        async addSemester(){
            this.feedback = ''
            if (this.semesterName == '' || this.semesterCount == 0) this.feedback = "Please enter all fields."
            else {
                let obj = {'name': this.semesterName, 'numStudents': this.semesterCount}
                let response = await semesterService.postSemester(obj)
                if(response.status == "success") {
                    obj._id = response.id
                    this.semesters.push(obj)
                }
                window.$('#addSemester').modal('hide');
            }
        },
        async editSemesterModal(semester){
            this.nextEditSemester = semester
            this.feedback = ''
            this.editSemesterName = ''
            this.editSemesterStCount = 0
            window.$('#editSemester').modal({show: true})
        },

        async editSemester(){
            let semester = this.nextEditSemester
            if(this.editSemesterName == '' || this.editSemesterStCount==0) this.feedback = "Please enter all fields.";
            else{
                semester.name = this.editSemesterName
                semester.numStudents = this.editSemesterStCount
                let response = await semesterService.updateSemester(semester._id, semester)
                if(response.status == "success"){
                    let index = this.semesters.findIndex(el => el._id == semester._id)
                    Vue.set(this.semesters, index, semester)
                    window.$('#editSemester').modal('hide');
                }
            }
        },

        async deleteSemester(semester){
            let response = await semesterService.deleteSemester(semester._id)
            if(response.status == "success"){
                let index = this.semesters.findIndex(el => el._id == semester._id)
                this.semesters.splice(index,1)
            }
        }
    },

    async mounted(){
        this.semesters = await semesterService.getSemesters()
    }
}
</script>

<style lang="scss" scoped>

</style>