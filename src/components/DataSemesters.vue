<template>
<div class="container-fluid">
    <DataNavigation :whoIsParent="'semester'" 
                    @addSemester="openAddSemesterModal" @editSemester="openEditSemesterModal" @deleteSemester="openDeleteSemesterModal"/>
    <hr style="margin-bottom:0px;"/>
    <DataNavigationLower/>

    <div class="col-12 mt-4">
      <vue-table-dynamic :params="params" @row-click="rowClick" ref="table"></vue-table-dynamic>
    </div>

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
            <label for="predmet">Faculty</label>
            <select v-model="selectedFaculty" class="form-control">
              <option v-for="faculty in this.faculties" :key="faculty._id" :value="faculty">
                {{faculty.name}}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="predmet">Semester name</label>
            <input v-model="semesterName" type="text" class="form-control" id="predmet">
          </div>
          <div class="form-group">
            <label for="season">Season</label>
            <select v-model="semesterSeason" class="form-control">
              <option value="winter">Winter</option>
              <option value="summer">Summer</option>
            </select>
          </div>
          <div class="form-group">
            <label for="predmet">Semester student count</label>
            <input v-model="semesterCount" type="number" class="form-control" id="predmet">
          </div>
        <p style="color: red;">{{feedback}}</p>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="addSemester" id="addSemesterBtn" type="button" class="btn btn-primary">Add</button>
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
            <label for="predmet">Faculty</label>
            <select v-model="selectedFaculty" class="form-control">
              <option v-for="faculty in this.faculties" :key="faculty._id" :value="faculty">
                {{faculty.name}}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="professor">Semester name</label>
            <input v-model="editSemesterName" type="text" class="form-control" id="professor">
          </div>
          <div class="form-group">
            <label for="season">Season</label>
            <select v-model="editSemesterSeason" class="form-control">
              <option value="winter">Winter</option>
              <option value="summer">Summer</option>
            </select>
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

<!-- Modal Delete -->
<div class="modal fade" id="deleteSemester" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
        <p>Deleting this semester will result in <b>deletion</b> of the following number of items that <b>reference this semester</b>:</p> 
        <ul class="list-group list-group-flush">
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
        <button @click="deleteSemester"  type="button" class="btn btn-danger">Confirm delete</button>
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
import facultyService from '@/services/facultyService'
import deleteInfoService from '@/services/deleteInfoService'
import DataNavigation from '@/components/DataNavigation.vue'
import DataNavigationLower from '@/components/DataNavigationLower.vue'

export default {
    data(){
        return {
            user: null,

            faculties: [],
            selectedFaculty: {},

            semesters: [],
            semesterName: '',
            semesterSeason: 'winter',
            semesterCount: 0,

            editSemesterName: '',
            editSemesterSeason: 'winter',
            editSemesterStCount: 0,
            editSemesterIndex: -1,
            nextEditSemester: {},
            feedback: '',
            
            deleteInfo: {
              needsDeleteSemesters: 0,
              needsDeleteSubjects: 0,
              needsDeleteSchedules: 0,
              needsModifySubjects: 0,
              needsModifySchedules: 0
          },
          indexToSemesterId: {},
          params: {
            data: [
              ['#', 'Name', 'Faculty', 'Students', "Season"],
            ],
            header: 'row',
            border: true,
            stripe: true,
            enableSearch: true,
            sort: [0,1,2,3,4],
            pagination: true,
            highlight: {row: [1]}
          }
        }
    },
    components: {
      DataNavigation,
      DataNavigationLower,
    },
    methods: {
        rowClick(index, row){
          this.nextEditSemester._id = this.indexToSemesterId[index] 
          this.editSemesterName = row[1]
          this.editSemesterSeason = row[4]
          this.editSemesterStCount = row[3]
          this.editSemesterIndex = index
          if(this.faculties.length>0) this.selectedFaculty = this.faculties[0]
          this.nextDeleteSemester = {
            _id: this.indexToSemesterId[index],
          }


          this.params.highlight.row = []
          this.params.highlight.row.push(index)
        },

        openAddSemesterModal(){
          this.feedback = ''
          window.$('#addSemester').modal('show');
        },
        openEditSemesterModal(){
          this.feedback = ''
          window.$('#editSemester').modal('show');
        },
        async openDeleteSemesterModal(){
          this.feedback = ''
          await this.semesterDeleteInfo()
          window.$('#deleteSemester').modal('show');
        },
        resetDeleteInfo(){
          this.deleteInfo = {
            needsDeleteSemesters: 0,
            needsDeleteSubjects: 0,
            needsDeleteSchedules: 0,
            needsModifySubjects: 0,
            needsModifySchedules: 0
          }
        },
        async addSemester(){
            this.feedback = ''
            if (this.semesterName == '' || this.semesterCount == 0) this.feedback = "Please enter all fields."
            else {
                let obj = {'name': this.semesterName,'season': this.semesterSeason, 'numStudents': parseInt(this.semesterCount), 'facultyId': this.selectedFaculty._id, 'userId': this.user._id}
                let response = await semesterService.postSemester(obj)
                if(response.status == "success") {
                    obj._id = response.id
                    this.indexToSemesterId[this.params.data.length] = obj._id
                    let newRow = [this.params.data.length, obj.name, this.getFacultyNameById(obj.facultyId), obj.numStudents, obj.season]
                    this.params.data.push(newRow)
                    this.feedback = "Successfully added."
                }
                //window.$('#addSemester').modal('hide');
            }
        },
        async editSemesterModal(semester){
            this.nextEditSemester = semester
            this.selectedFaculty = {}
            this.feedback = ''
            this.editSemesterName = ''
            this.editSemesterSeason = 'winter'
            this.editSemesterStCount = 0
            window.$('#editSemester').modal({show: true})
        },

        async editSemester(){
            let semester = this.nextEditSemester
            if(this.editSemesterName == '' || this.editSemesterStCount==0) this.feedback = "Please enter all fields.";
            else{
                semester.name = this.editSemesterName
                semester.season = this.editSemesterSeason
                semester.numStudents = this.editSemesterStCount
                semester.facultyId = this.selectedFaculty._id
                semester.userId = this.user._id
                let response = await semesterService.updateSemester(semester._id, semester)
                if(response.status == "success"){
                    let newRow = [this.editSemesterIndex, semester.name, this.getFacultyNameById(semester.facultyId), semester.numStudents, semester.season]
                    Vue.set(this.params.data, this.editSemesterIndex, newRow)
                    window.$('#editSemester').modal('hide');
                }
            }
        },

        async deleteSemester(){
            let response = await semesterService.deleteSemester(this.nextDeleteSemester._id)
            if(response.status == 200){
                this.$router.go(0) //for now
                //let index = this.semesters.findIndex(el => el._id == this.nextDeleteSemester._id)
                //this.semesters.splice(index,1)
                //window.$('#deleteSemester').modal('hide');
            }
        },

        async semesterDeleteInfo(){
          this.feedback = ''
          let id = this.nextDeleteSemester._id
          this.resetDeleteInfo()
          //this.nextDeleteSemester = semester
          let response = await deleteInfoService.getInfoSemesters(id).catch(err => this.feedback = "Internal server error.")
          if(response.status == 200) this.deleteInfo = response.data
        },

        getFacultyNameById(faculty_id){
          let faculty = this.faculties.find(el => el._id == faculty_id && el.userId == this.user._id)
          if(!faculty) return ""
          return faculty.name
        }
    },

    async mounted(){
      this.user = JSON.parse(await localStorage.getItem('user'))
      this.semesters = (await semesterService.getSemesters()).filter(el => el.userId == this.user._id)
      this.faculties = (await facultyService.getFaculties()).filter(el => el.userId == this.user._id)

      for(let i=0;i<this.semesters.length;i++){
        let s = this.semesters[i]
        this.indexToSemesterId[i+1] = s._id
        let row = [i+1, s.name, this.getFacultyNameById(s.facultyId), parseInt(s.numStudents), s.season]
        this.params.data.push(row)
      }
      if(this.params.data.length>1) this.rowClick(1, this.params.data[1])
      window.$(document).on('keypress',e => {
        let modalOpen = window.$('#addSemester').hasClass('show')
        if(e.which == 13 && modalOpen) window.$("#addSemesterBtn").click()
      });
    }
}
</script>

<style lang="scss" scoped>

</style>