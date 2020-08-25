<template>
<div class="container-fluid">
    <DataNavigation :whoIsParent="'faculty'" 
                    @addFaculty="openAddFacultyModal" @editFaculty="openEditFacultyModal" @deleteFaculty="openDeleteFacultyModal"/>
    <hr style="margin-bottom:0px;"/>
    <DataNavigationLower/>

    <div class="col-12 mt-4">
      <vue-table-dynamic :params="params" @row-click="rowClick" ref="table"></vue-table-dynamic>
    </div>

<!-- Modal Add -->
<div class="modal" id="addFaculty" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Add faculty</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="predmet">Faculty name</label>
            <input v-model="facultyName" type="text" class="form-control" id="predmet">
          </div>
        </form>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="addFaculty" type="button" class="btn btn-primary">Add</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Edit -->
<div class="modal" id="editFaculty" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Edit faculty</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="faculty">Faculty name</label>
            <input v-model="editFacultyName" type="text" class="form-control" id="faculty">
          </div>

        </form>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="editFaculty" type="button" class="btn btn-primary">Edit</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Delete -->
<div class="modal fade" id="deleteFaculty" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Delete faculty</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h3 class="mb-4">Are you sure?</h3>
        <p>Deleting this faculty will result in <b>deletion</b> of the following number of items that <b>reference this faculty</b>:</p> 
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Semesters: {{deleteInfo.needsDeleteSemesters}}</li>
          <li class="list-group-item">Subjects: {{deleteInfo.needsDeleteSubjects}}</li>
          <li class="list-group-item">Schedules: {{deleteInfo.needsDeleteSchedules}}</li>
        </ul>
        <p class="mt-4">And <b>modification</b> of the following number of item:</p>
        <ul class="list group list-group-flush" style="padding-left:0px;">
          <li class="list-group-item">Subjects: {{deleteInfo.needsModifySubjects}}</li>
          <li class="list-group-item">Schedules: {{deleteInfo.needsModifySchedules}}</li>
        </ul>

        <p style="color: red;" class="mt-4">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="deleteFaculty" type="button" class="btn btn-danger">Confirm delete</button>
      </div>
    </div>
  </div>
</div>

</div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import facultyService from '@/services/facultyService'
import deleteInfoService from '@/services/deleteInfoService'
import DataNavigation from '@/components/DataNavigation.vue'
import DataNavigationLower from '@/components/DataNavigationLower.vue'

export default {
    data(){
        return {
            user: null,

            faculties: [],
            facultyName: '',
            
            editFacultyName: '',
            editFacultyIndex: -1,
            nextEditFaculty: {},
            nextDeleteFaculty: {},
            deleteInfo: {
              needsDeleteFaculties: 0,
              needsDeleteSemesters: 0,
              needsDeleteSubjects: 0,
              needsDeleteSchedules: 0,
              needsModifySubjects: 0,
              needsModifySchedules: 0
            },
            feedback: '',
            
            indexToFacultyId: {},
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
              highlight: {row: [1]},
            }
        }
    },
    components: {
      DataNavigation,
      DataNavigationLower
    },
    methods: {
        rowClick(index, row){
          this.nextEditFaculty._id = this.indexToFacultyId[index]
          this.nextDeleteFaculty._id = this.indexToFacultyId[index]
          this.editFacultyName = row[1]
          this.editFacultyIndex = index

          this.params.highlight.row = []
          this.params.highlight.row.push(index)
        },
        openAddFacultyModal(){
          this.feedback = ''
          window.$('#addFaculty').modal('show');
        },
        openEditFacultyModal(){
          this.feedback = ''
          window.$('#editFaculty').modal('show');
        },
        async openDeleteFacultyModal(){
          this.feedback = ''
          await this.facultyDeleteInfo()
          window.$('#deleteFaculty').modal('show');
        },
        resetDeleteInfo(){
            this.deleteInfo = {
              needsDeleteFaculties: 0,
              needsDeleteSemesters: 0,
              needsDeleteSubjects: 0,
              needsDeleteSchedules: 0,
              needsModifySubjects: 0,
              needsModifySchedules: 0
          }
        },
        async addFaculty(){
            this.feedback = ''
            if (this.facultyName == '') this.feedback = "Please enter all fields."
            else {
                let user = JSON.parse(await localStorage.getItem('user'))
                let obj = {'name': this.facultyName, 'userId': user._id}
                let response = await facultyService.postFaculty(obj)
                if(response.status == "success") {
                    obj._id = response.id
                    this.indexToFacultyId[this.params.data.length] = obj._id
                    this.params.data.push([this.params.data.length, obj.name])
                }
                window.$('#addFaculty').modal('hide');
            }
        },
        async editFacultyModal(faculty){
            this.nextEditFaculty = faculty
            this.feedback = ''
            this.editFacultyName = ''
            window.$('#editFaculty').modal({show: true})
        },

        async editFaculty(){
            let faculty = this.nextEditFaculty
            if(this.editFacultyName == '') this.feedback = "Please enter faculty name.";
            else{
                faculty.name = this.editFacultyName
                faculty.userId = this.user._id
                let response = await facultyService.updateFaculty(faculty._id, faculty)
                if(response.status == "success"){
                    let newRow = [this.editFacultyIndex, faculty.name]
                    Vue.set(this.params.data, this.editFacultyIndex, newRow)
                    window.$('#editFaculty').modal('hide');
                }
            }
        },

        async deleteFaculty(){
            let response = await facultyService.deleteFaculty(this.nextDeleteFaculty._id)
            
            if(response.status == 200){
              this.$router.go(0)
              //let index = this.faculties.findIndex(el => el._id == this.nextDeleteFaculty._id)
              //this.faculties.splice(index,1)
              //window.$('#deleteFaculty').modal('hide');
            }
        },
        
        async facultyDeleteInfo(faculty){
          this.feedback = ''
          let id = this.nextDeleteFaculty._id
          this.resetDeleteInfo()
          let response = await deleteInfoService.getInfoFaculties(id).catch(err => this.feedback = "Internal server error.")
          if(response.status == 200) this.deleteInfo = response.data
          
        }
    },

    async mounted(){
      this.user = JSON.parse(await localStorage.getItem("user"))
      this.faculties = (await facultyService.getFaculties()).filter(el => el.userId == this.user._id)

      for(let i=0;i<this.faculties.length;i++){
        let f = this.faculties[i]
        this.indexToFacultyId[i+1] = f._id
        let row = [i+1, f.name]
        this.params.data.push(row)
      }
      if(this.params.data.length>1) this.rowClick(1, this.params.data[1])
    }
}
</script>

<style lang="scss" scoped>

</style>