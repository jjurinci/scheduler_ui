<template>
<div class="container-fluid">
    <DataNavigation :whoIsParent="'professor'" 
                    @addProfessor="openAddProfessorModal" @editProfessor="openEditProfessorModal" @deleteProfessor="openDeleteProfessorModal"/>
    <hr style="margin-bottom:0px;"/>
    <DataNavigationLower/>

    <div class="col-12 mt-4">
      <vue-table-dynamic :params="params" @row-click="rowClick" ref="table"></vue-table-dynamic>
    </div>

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
            <label for="predmet">Professor first name</label>
            <input v-model="professorFirstName" type="text" class="form-control" id="predmet">
          </div>
          <div class="form-group">
            <label for="predmet">Professor last name</label>
            <input v-model="professorLastName" type="text" class="form-control" id="predmet">
          </div>

        </form>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="addProfessor" id="addProfessorBtn" type="button" class="btn btn-primary">Add</button>
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
            <label for="professor">Professor first name</label>
            <input v-model="editProfessorFirstName" type="text" class="form-control" id="professor">
          </div>
          <div class="form-group">
            <label for="professor">Professor last name</label>
            <input v-model="editProfessorLastName" type="text" class="form-control" id="professor">
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

<!-- Modal Delete -->
<div class="modal fade" id="deleteProfessor" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Delete professor</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h3 class="mb-4">Are you sure?</h3>
        <p>Deleting this professor will result in <b>deletion</b> of the following number of items that <b>reference this professor</b>:</p> 
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Subjects: {{deleteInfo.needsDeleteSubjects}}</li>
          <li class="list-group-item">Schedules: {{deleteInfo.needsDeleteSchedules}}</li>
        </ul>
        <p class="mt-4">And <b>modification</b> of the following number of items:</p>
        <ul class="list group list-group-flush" style="padding-left:0px;">
          <li class="list-group-item">Subjects: {{deleteInfo.needsModifySubjects}}</li>
        </ul>

        <p style="color: red;" class="mt-4">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="deleteProfessor"  type="button" class="btn btn-danger">Confirm delete</button>
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
import deleteInfoService from '@/services/deleteInfoService'
import DataNavigation from '@/components/DataNavigation.vue'
import DataNavigationLower from '@/components/DataNavigationLower.vue'

export default {
    data(){
        return {
            user: null,
            professors: [],
            professorFirstName: '',
            professorLastName: '',
            editProfessorFirstName: '',
            editProfessorLastName: '',
            editProfessorIndex: -1,
            nextEditProf: {},
            feedback: '',
            indexToProfessorId: {},

            nextDeleteProfessor: {},
            deleteInfo : {
              needsDeleteProfessors: 0,
              needsDeleteSubjects: 0,
              needsDeleteSchedules: 0,
              needsModifySubjects: 0
          },
            params: {
              data: [
                ['#', 'Name'],
              ],
              header: 'row',
              border: true,
              stripe: true,
              enableSearch: true,
              sort: [0,1],
              pagination: true,
              highlight: {row: [1]}
            }
        }
    },
    components: {
      DataNavigation,
      DataNavigationLower
    },
    methods: {
        rowClick(index, row){
          this.nextEditProf._id = this.indexToProfessorId[index]
          this.nextDeleteProfessor._id = this.indexToProfessorId[index]
          this.editProfessorFirstName = row[1].split(" ")[0]
          this.editProfessorLastName = row[1].split(" ").slice(1).join(" ")
          this.editProfessorIndex = index

          this.params.highlight.row = []
          this.params.highlight.row.push(index)
        },
        openAddProfessorModal(){
          this.feedback = ''
          window.$('#addProfessor').modal('show');
        },
        openEditProfessorModal(){
          this.feedback = ''
          window.$('#editProfessor').modal('show');
        },
        async openDeleteProfessorModal(){
          this.feedback = ''
          await this.professorDeleteInfo()
          window.$('#deleteProfessor').modal('show');
        },
        resetDeleteInfo(){
          this.deleteInfo = {
            needsDeleteProfessors: 0,
            needsDeleteSubjects: 0,
            needsDeleteSchedules: 0,
            needsModifySubjects: 0
          }
        },
        async addProfessor(){
            this.feedback = ''
            if (this.professorFirstName == '' || this.professorLastName=='') this.feedback = "Please enter all fields."
            else {
                let obj = {'firstName': this.professorFirstName, 'lastName': this.professorLastName, 'userId': this.user._id, 'free': []}
                let response = await professorService.postProfessor(obj)
                if(response.status == "success") {
                  obj._id = response.id
                  this.indexToProfessorId[this.params.data.length] = obj._id
                  this.params.data.push([this.params.data.length, obj.firstName + " " + obj.lastName])
                  this.feedback = 'Successfully Added.'
                }
                //window.$('#addProfessor').modal('hide');
            }
        },
        async editProfessorModal(prof){
            this.nextEditProf = prof
            this.feedback = ''
            this.editProfessorFirstName = ''
            this.editProfessorLastName = ''
            window.$('#editProfessor').modal({show: true})
        },

        async editProfessor(){
            let prof = this.nextEditProf
            if(this.editProfessorFirstName == '' || this.editProfessorLastName == '') this.feedback = "Please enter professor's name";
            else{
                prof.firstName = this.editProfessorFirstName
                prof.lastName = this.editProfessorLastName
                prof.userId = this.user._id
                let response = await professorService.updateProfessor(prof._id, prof)
                if(response.status == "success"){
                    let newRow = [this.editProfessorIndex, prof.firstName + " " + prof.lastName]
                    Vue.set(this.params.data, this.editProfessorIndex, newRow)
                    window.$('#editProfessor').modal('hide');
                }
            }
        },

        async deleteProfessor(){
            let response = await professorService.deleteProfessor(this.nextDeleteProfessor._id)
            if(response.status == 200){
                this.$router.go(0)
                //let index = this.professors.findIndex(el => el._id == this.nextDeleteProfessor._id)
                //this.professors.splice(index,1)
                //window.$('#deleteProfessor').modal('hide');
            }
        },

        async professorDeleteInfo(){
          this.feedback = ''
          this.resetDeleteInfo()
          let id = this.nextDeleteProfessor._id
          let response = await deleteInfoService.getInfoProfessors(id).catch(err => this.feedback = "Internal server error.")
          if(response.status == 200) this.deleteInfo = response.data
        },

    },

    async mounted(){
        this.user = JSON.parse(await localStorage.getItem('user'))
        this.professors = (await professorService.getProfessors()).filter(el => el.userId == this.user._id)
        for(let i=0;i<this.professors.length;i++){
          let p = this.professors[i]
          this.indexToProfessorId[i+1] = p._id
          let row = [i+1, p.firstName + " " + p.lastName]
          this.params.data.push(row)
        }
        if(this.params.data.length>1) this.rowClick(1, this.params.data[1])

        window.$(document).on('keypress',e => {
          let modalOpen = window.$('#addProfessor').hasClass('show')
          if(e.which == 13 && modalOpen) window.$("#addProfessorBtn").click()
        });
    }
}
</script>

<style lang="scss" scoped>

</style>