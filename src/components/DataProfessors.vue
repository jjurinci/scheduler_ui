<template>
<div class="container-fluid" style="margin-top:40px;">
    <Toolbar class="w-75 mx-auto"/>
    <button @click="professorName = ''; feedback=''" class="btn btn-primary mb-4" data-toggle="modal" data-target="#addProfessor" style="margin-top:60px;">Add new professor</button>
    <table class="table w-75 mx-auto text-center">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col" style="word-wrap: break-word;max-width: 70px;">Options</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(prof, index) in this.professors" :key="prof._id">
                <th scope="row">{{index+1}}</th>
                <td>{{prof.name}}</td>
                <td style="word-wrap: break-word;max-width: 70px;">
                    <button @click="editProfessorModal(prof)" class="btn btn-primary mr-2">Edit</button>
                    <button @click="deleteProfessor(prof)" class="btn btn-danger">Delete</button>
                </td>
            </tr>
        </tbody>
    </table>

<!-- Modal Add -->
<div class="modal" id="addProfessor" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Add professor</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="predmet">Professor name</label>
            <input v-model="professorName" type="text" class="form-control" id="predmet">
          </div>

        </form>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="addProfessor" type="button" class="btn btn-primary">Add</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Edit -->
<div class="modal" id="editProfessor" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Edit professor</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="professor">Professor name</label>
            <input v-model="editProfessorName" type="text" class="form-control" id="professor">
          </div>

        </form>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="editProfessor" type="button" class="btn btn-primary">Edit</button>
      </div>
    </div>
  </div>
</div>

</div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import professorService from '@/services/professorService'
import Toolbar from '@/components/DataToolbar.vue'
export default {
    data(){
        return {
            professors: [],
            professorName: '',
            editProfessorName: '',
            nextEditProf: {},
            feedback: '',
            counter: 1,
        }
    },
    components: {
      Toolbar
    },
    methods: {
        async addProfessor(){
            this.feedback = ''
            if (this.professorName == '') this.feedback = "Please enter professor's name."
            else {
                let response = await professorService.postProfessor({'name':this.professorName})
                if(response.status == "success") this.professors.push({'_id': response.id ,'name': this.professorName})
                window.$('#addProfessor').modal('hide');
            }
        },
        async editProfessorModal(prof){
            this.nextEditProf = prof
            this.feedback = ''
            this.editProfessorName = ''
            window.$('#editProfessor').modal({show: true})
        },

        async editProfessor(){
            let prof = this.nextEditProf
            if(this.editProfessorName == '') this.feedback = "Please enter professor's name";
            else{
                prof.name = this.editProfessorName
                let response = await professorService.updateProfessor(prof._id, prof)
                if(response.status == "success"){
                    let index = this.professors.findIndex(el => el._id == prof._id)
                    Vue.set(this.professors, index, prof)
                    window.$('#editProfessor').modal('hide');
                }
            }
        },

        async deleteProfessor(prof){
            let response = await professorService.deleteProfessor(prof._id)
            if(response.status == "success"){
                let index = this.professors.findIndex(el => el._id == prof._id)
                this.professors.splice(index,1)
            }
        }
    },

    async mounted(){
        this.professors = await professorService.getProfessors()
    }
}
</script>

<style lang="scss" scoped>

</style>