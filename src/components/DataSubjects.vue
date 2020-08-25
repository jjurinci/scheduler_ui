<template>
<div class="container-fluid">
    <DataNavigation :whoIsParent="'subject'" 
                    @addSubject="openAddSubjectModal" @editSubject="openEditSubjectModal" @deleteSubject="openDeleteSubjectModal"/>
    <hr style="margin-bottom:0px;"/>
    <DataNavigationLower/>
    
    <div class="col-12 mt-4">
      <vue-table-dynamic :params="params" @row-click="rowClick" ref="table"></vue-table-dynamic>
    </div>

<!-- Modal Add -->
<div class="modal" id="addSubject" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Add subject</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
         <form v-if="loaded">
            <div class="row">
                <div class="col-12 mb-4">
                    <label for="subjectName">Subject name</label>
                    <input v-model="createSubject.name" type="text" class="form-control" id="subjectName">
                </div>

                <div class="col-4">
                    <label for="theoryhr">Theory (hr)</label>
                    <input v-model="createSubject.theoryHr" @change="renderSelect" type="number" class="form-control" id="theoryhr">
                </div>
                <div class="col-4">
                    <label for="practicehr">Practice (hr)</label>
                    <input v-model="createSubject.practiceHr" @change="renderSelect" type="number" class="form-control" id="practicehr">
                </div>
                <div class="col-4">
                    <label for="seminarhr">Seminar (hr)</label>
                    <input v-model="createSubject.seminarHr" @change="renderSelect" type="number" class="form-control" id="seminarhr">
                </div>

                <div id="theoryCol" class="col-12 mt-4">
                    <label for="theoryProfessors"><b>Theory</b> professors</label>
                    <select v-model="createSubject.theoryProfessors" 
                            class="__selectpicker" data-live-search="true" data-width="100%" multiple>
                        <option v-for="professor in this.professors" :key="professor._id" :value="professor">
                            {{professor.firstName + ' ' + professor.lastName}}
                        </option>
                    </select>
                    </div>

                <div id="practiceCol" class="col-12 mt-4">
                    <label for="practiceProfessors"><b>Practice</b> professors</label>
                    <select v-model="createSubject.practiceProfessors" 
                            class="__selectpicker" data-live-search="true" data-width="100%" multiple>
                        <option v-for="professor in this.professors" :key="professor._id" :value="professor">
                            {{professor.firstName + ' ' + professor.lastName}}
                        </option>
                    </select>
                </div>
                
                <div id="seminarCol" class="col-12 mt-4">
                    <label for="seminarProfessors"><b>Seminar</b> professors</label>
                    <select v-model="createSubject.seminarProfessors"  
                            class="__selectpicker" data-live-search="true" data-width="100%" multiple>
                        <option v-for="professor in this.professors" :key="professor._id" :value="professor">
                            {{professor.firstName + ' ' + professor.lastName}}
                        </option>
                    </select>
                </div>
                
                <div id="semesterCol" class="col-12 mt-4">
                    <label for="allSemesters"><b>All</b> semesters</label>
                    <select v-model="createSubject.semesters"  
                            class="__selectpicker" data-live-search="true" data-width="100%" multiple>
                        <optgroup v-for="faculty in this.faculties" :key="faculty._id" :label="faculty.name">
                            <option v-for="semester in facultyIdToSemesters[faculty._id]" :key="semester._id" :value="semester" :data-tokens="semester.facultyName">
                                {{semester.name}}
                            </option>
                        </optgroup>
                    </select>
                </div>

                <div class="col-4 mt-4 mx-auto">
                    <input v-model="createSubject.mandatory" class="form-check-input" type="checkbox" id="MandatoryCheckbox">
                    <label class="form-check-label" for="MandatoryCheckbox">Mandatory</label>
                </div>

                <div v-if="createSubject.theoryHr > 0" class="col-4 mt-4 mx-auto">
                    <input v-model="createSubject.theoryNeedsComputers" class="form-check-input" type="checkbox" id="TheoryCompCheckbox">
                    <label class="form-check-label" for="TheoryCompCheckbox">Theory needs computers</label>
                </div>
                
                <div v-if="createSubject.practiceHr > 0" class="col-4 mt-4 mx-auto">
                    <input v-model="createSubject.practiceNeedsComputers" class="form-check-input" type="checkbox" id="PracticeCompCheckbox" value="option2">
                    <label class="form-check-label" for="PracticeCompCheckbox">Practice needs computers</label>
                </div>
                                
                <div v-if="createSubject.seminarHr > 0" class="col-4 mt-4 mx-auto">
                    <input v-model="createSubject.seminarNeedsComputers" class="form-check-input" type="checkbox" id="SeminarCompCheckbox" value="option2">
                    <label class="form-check-label" for="SeminarCompCheckbox">Seminar needs computers</label>
                </div>

                <div v-if="!createSubject.mandatory" class="col-12 mt-4">
                    <label for="NonMandatoryNumOfStudents"><b>Estimated</b> number of students</label> <br/>
                    <input v-model="createSubject.numStudents" class="form-control w-75 mx-auto" type="number" id="NonMandatoryNumOfStudents">
                    <small>Since the subject is not mandatory.</small>
                </div>
                
            </div>
        </form>

        <p class="mt-4" style="color:red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="addSubject" id="addSubjectBtn" type="button" class="btn btn-primary">Add</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Edit -->
<div class="modal" id="editSubject" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Edit subject</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
         <form v-if="loaded">
            <div class="row">
                <div class="col-12 mb-4">
                    <label for="subjectName">Subject name</label>
                    <input v-model="createSubject.name" type="text" class="form-control" id="subjectName">
                </div>

                <div class="col-4">
                    <label for="theoryhr">Theory (hr)</label>
                    <input v-model="createSubject.theoryHr" @change="renderSelect" type="number" class="form-control" id="theoryhr">
                </div>
                <div class="col-4">
                    <label for="practicehr">Practice (hr)</label>
                    <input v-model="createSubject.practiceHr" @change="renderSelect" type="number" class="form-control" id="practicehr">
                </div>
                <div class="col-4">
                    <label for="seminarhr">Seminar (hr)</label>
                    <input v-model="createSubject.seminarHr" @change="renderSelect" type="number" class="form-control" id="seminarhr">
                </div>

                <div id="theoryCol_edit" class="col-12 mt-4">
                    <label for="theoryProfessors"><b>Theory</b> professors</label>
                    <select v-model="createSubject.theoryProfessors" 
                            class="__selectpicker" data-live-search="true" data-width="100%" multiple
                            data-live-search-placeholder="Search">
                        <option v-for="professor in this.professors" :key="professor._id" :value="professor">
                            {{professor.firstName + ' ' + professor.lastName}}
                        </option>
                    </select>
                    </div>

                <div id="practiceCol_edit" class="col-12 mt-4">
                    <label for="practiceProfessors"><b>Practice</b> professors</label>
                    <select v-model="createSubject.practiceProfessors" 
                            class="__selectpicker" data-live-search="true" data-width="100%" multiple>
                        <option v-for="professor in this.professors" :key="professor._id" :value="professor">
                            {{professor.firstName + ' ' + professor.lastName}}
                        </option>
                    </select>
                </div>
                
                <div id="seminarCol_edit" class="col-12 mt-4">
                    <label for="seminarProfessors"><b>Seminar</b> professors</label>
                    <select v-model="createSubject.seminarProfessors"  
                            class="__selectpicker" data-live-search="true" data-width="100%" multiple>
                        <option v-for="professor in this.professors" :key="professor._id" :value="professor">
                            {{professor.firstName + ' ' + professor.lastName}}
                        </option>
                    </select>
                </div>
                
                <div id="semesterCol" class="col-12 mt-4">
                    <label for="allSemesters"><b>All</b> semesters</label>
                    <select v-model="createSubject.semesters"  
                            class="__selectpicker" data-live-search="true" data-width="100%" multiple>
                        <optgroup v-for="faculty in this.faculties" :key="faculty._id" :label="faculty.name">
                            <option v-for="semester in facultyIdToSemesters[faculty._id]" :key="semester._id" :value="semester" :data-tokens="semester.facultyName">
                                {{semester.name}}
                            </option>
                        </optgroup>
                    </select>
                </div>

                <div class="col-4 mt-4 mx-auto">
                    <input v-model="createSubject.mandatory" class="form-check-input" type="checkbox" id="MandatoryCheckbox">
                    <label class="form-check-label" for="MandatoryCheckbox">Mandatory</label>
                </div>

                <div v-if="createSubject.theoryHr > 0" class="col-4 mt-4 mx-auto">
                    <input v-model="createSubject.theoryNeedsComputers" class="form-check-input" type="checkbox" id="TheoryCompCheckbox">
                    <label class="form-check-label" for="TheoryCompCheckbox">Theory needs computers</label>
                </div>
                
                <div v-if="createSubject.practiceHr > 0" class="col-4 mt-4 mx-auto">
                    <input v-model="createSubject.practiceNeedsComputers" class="form-check-input" type="checkbox" id="PracticeCompCheckbox" value="option2">
                    <label class="form-check-label" for="PracticeCompCheckbox">Practice needs computers</label>
                </div>
                                
                <div v-if="createSubject.seminarHr > 0" class="col-4 mt-4 mx-auto">
                    <input v-model="createSubject.seminarNeedsComputers" class="form-check-input" type="checkbox" id="SeminarCompCheckbox" value="option2">
                    <label class="form-check-label" for="SeminarCompCheckbox">Seminar needs computers</label>
                </div>

                <div v-if="!createSubject.mandatory" class="col-12 mt-4">
                    <label for="NonMandatoryNumOfStudents"><b>Estimated</b> number of students</label> <br/>
                    <input v-model="createSubject.numStudents" class="form-control w-75 mx-auto" type="number" id="NonMandatoryNumOfStudents">
                    <small>Since the subject is not mandatory.</small>
                </div>
                
            </div>
        </form>

        <p class="mt-4" style="color:red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="editSubject" type="button" class="btn btn-primary">Edit</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Delete -->
<div class="modal fade" id="deleteSubject" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Delete subject</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h3 class="mb-4">Are you sure?</h3>
        <p>Deleting this subject will result in <b>deletion</b> of the following number of items that <b>reference this subject</b>:</p> 
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Schedules: {{deleteInfo.needsDeleteSchedules}}</li>
        </ul>
        <p style="color: red;" class="mt-4">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="deleteSubject"  type="button" class="btn btn-danger">Confirm delete</button>
      </div>
    </div>
  </div>
</div>

</div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import subjectService from '@/services/subjectService'
import semesterService from '@/services/semesterService'
import professorService from '@/services/professorService'
import facultyService from '@/services/facultyService'
import deleteInfoService from '@/services/deleteInfoService'

import DataNavigation from '@/components/DataNavigation.vue'
import DataNavigationLower from '@/components/DataNavigationLower.vue'

export default {
    data(){
        return {
            loaded: false,

            user: null,
            faculties: [],
            semesters: [],
            professors: [],
            subjects: [],

            facultyIdToSemesters: {},
            professoridToProfessorObj: {},
            semesterIdToSemesterObj: {},

            createSubject: {
                name: '',
                theoryHr: 30,
                practiceHr: 30,
                seminarHr: 0,
                mandatory: true,
                theoryNeedsComputers: false,
                practiceNeedsComputers: false,
                seminarNeedsComputers: false,
                theoryProfessors: [],
                practiceProfessors: [],
                seminarProfessors: [],
                numStudents: 40,
                semesters: [],
            },
            feedback: '',

            nextDeleteSubject: {},
            deleteInfo: {
                needsDeleteSubjects: 0,
                needsDeleteSchedules: 0
            },
            editSubjectIndex: -1,
            indexToSubject: {},
            params: {
              data: [
                ['#', 'Name', 'Theory (hr)', 'Practice (hr)', 'Seminar (hr)', 'Mandatory', 'Students'],
              ],
              header: 'row',
              border: true,
              stripe: true,
              enableSearch: true,
              sort: [0,1,2,3,4,5,6],
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
          this.createSubject = this.indexToSubject[index]
          this.nextDeleteSubject._id = this.createSubject._id
          this.editSubjectIndex = index

          this.params.highlight.row = []
          this.params.highlight.row.push(index)
        },
        openAddSubjectModal(){
          this.feedback = ''
          this.resetFormData()
          window.$('#addSubject').modal('show');
        },
        openEditSubjectModal(){
          this.feedback = ''
          this.editSubjectModal()
          //window.$('#editSubject').modal('show');
        },
        async openDeleteSubjectModal(){
          this.feedback = ''
          await this.subjectDeleteInfo()
          window.$('#deleteSubject').modal('show');
        },

        resetDeleteInfo(){
          this.deleteInfo = {
            needsDeleteSubjects: 0,
            needsDeleteSchedules: 0
          }
        },

        isEmptyObject(obj){
            return Object.keys(obj).length === 0;
        },

        resetFormData(){
            this.createSubject =  {
                name: '',
                theoryHr: 30,
                practiceHr: 30,
                seminarHr: 0,
                mandatory: true,
                theoryNeedsComputers: false,
                practiceNeedsComputers: false,
                seminarNeedsComputers: false,
                theoryProfessors: [],
                practiceProfessors: [],
                seminarProfessors: [],
                semesters: [],
                numStudents: 40,
            },
            this.feedback = ''
            window.$(function(){
                window.$('.__selectpicker').selectpicker('render')
            })
        },

        validForm(){
            this.feedback = ''
            let c = this.createSubject
            if(c.name == '') this.feedback = "Enter subject name."
            else if((c.theoryHr <= 0 && c.practiceHr <= 0 && c.seminarHr <= 0) ||
                    (c.theoryHr == "" && c.practiceHr == "" && c.seminarHr == "" )) this.feedback = "All three: theory, practice and seminar cannot be empty."
            else if(c.theoryHr > 0 && c.theoryProfessors.length == 0) this.feedback = "Enter theory professors."
            else if(c.practiceHr > 0 && c.practiceProfessors.length == 0) this.feedback = "Enter practice professors."
            else if(c.seminarHr > 0 && c.seminarProfessors.length == 0) this.feedback = "Enter seminar professors."
            else if(!c.mandatory && (c.numStudents <= 0 || c.numStudents == "")) this.feedback = "Enter estimated number of students."
            else if(c.semesters.length == 0) this.feedback = "Enter semesters."
            else return true

            return false
        },

        async addSubject(){
            if (!this.validForm()) return
            let c = this.createSubject
            if(c.theoryHr < 0 || c.theoryHr == "") c.theoryHr = 0
            if(c.practiceHr < 0 || c.practiceHr == "") c.practiceHr = 0
            if(c.seminarHr < 0 || c.seminarHr == "") c.seminarHr = 0
            c.theoryHr = parseInt(c.theoryHr)
            c.practiceHr = parseInt(c.practiceHr)
            c.seminarHr = parseInt(c.seminarHr)

            let semesterIds = c.semesters.map(s => s._id)
            let numStudents = c.numStudents
            if(c.mandatory) numStudents = c.semesters.reduce((acc, cur) => parseInt(acc) + parseInt(cur.numStudents), 0)
            numStudents = parseInt(numStudents)
             
            let theoryProfessorIds = (c.theoryProfessors.length>0) ? c.theoryProfessors.map(p => p._id) : []
            let practiceProfessorIds = (c.practiceProfessors.length>0) ? c.practiceProfessors.map(p => p._id) : []
            let seminarProfessorIds = (c.seminarProfessors.length>0) ? c.seminarProfessors.map(s => s._id) : []

            let obj = {'name': c.name, 'theoryHr': c.theoryHr, 'practiceHr': c.practiceHr, 'seminarHr': c.seminarHr,
                       'mandatory': c.mandatory, 'theoryNeedsComputers': c.theoryNeedsComputers, 'practiceNeedsComputers': c.practiceNeedsComputers,
                       'seminarNeedsComputers': c.seminarNeedsComputers, 'theoryProfessors': c.theoryProfessors, 'practiceProfessors': c.practiceProfessors,
                       'seminarProfessors': c.seminarProfessors, 'semesters':c.semesters ,'numStudents':numStudents,
                       'userId': this.user._id}

            let dbObj = {'name': c.name, 'theoryHr': c.theoryHr, 'practiceHr': c.practiceHr, 'seminarHr': c.seminarHr,
                       'mandatory': c.mandatory, 'theoryNeedsComputers': c.theoryNeedsComputers, 'practiceNeedsComputers': c.practiceNeedsComputers,
                       'seminarNeedsComputers': c.seminarNeedsComputers, 'theoryProfessorIds': theoryProfessorIds, 'practiceProfessorIds': practiceProfessorIds,
                       'seminarProfessorIds': seminarProfessorIds, 'semesterIds':semesterIds ,'numStudents':numStudents,
                       'userId': this.user._id}
            
            let response = await subjectService.postSubject(dbObj)
            if(response.status == "success") {
                obj._id = response.id
                this.indexToSubject[this.params.data.length] = obj
                this.params.data.push([this.params.data.length, obj.name, obj.theoryHr, obj.practiceHr, obj.seminarHr, obj.mandatory, obj.numStudents])
            }
            window.$('#addSubject').modal('hide');
        
        },
        async editSubjectModal(){
            this.feedback = ''
            this.nextEditSubject = this.createSubject
            window.$('#editSubject').modal({show: true})
            if(this.nextEditSubject.theoryHr <= 0 || this.nextEditSubject.theoryHr == "")
                document.getElementById('theoryCol_edit').style.display = "none";
            if(this.nextEditSubject.practiceHr <= 0 || this.nextEditSubject.practiceHr == "")
                document.getElementById('practiceCol_edit').style.display = "none";
            if(this.nextEditSubject.seminarHr <= 0 || this.nextEditSubject.seminarHr == "")
                document.getElementById('seminarCol_edit').style.display = "none";
            this.renderSelect()
        },

        async editSubject(){
            if(!this.validForm()) return
            let c = this.createSubject
            if(c.theoryHr < 0 || c.theoryHr == "") c.theoryHr = 0
            if(c.practiceHr < 0 || c.practiceHr == "") c.practiceHr = 0
            if(c.seminarHr < 0 || c.seminarHr == "") c.seminarHr = 0
            c.theoryHr = parseInt(c.theoryHr)
            c.practiceHr = parseInt(c.practiceHr)
            c.seminarHr = parseInt(c.seminarHr)

            let semesterIds = c.semesters.map(s => s._id)
            let numStudents = c.numStudents
            if(c.mandatory) numStudents = c.semesters.reduce((acc, cur) => parseInt(acc) + parseInt(cur.numStudents), 0)
            numStudents = parseInt(numStudents)

            let theoryProfessorIds = (c.theoryProfessors.length>0) ? c.theoryProfessors.map(p => p._id) : []
            let practiceProfessorIds = (c.practiceProfessors.length>0) ? c.practiceProfessors.map(p => p._id) : []
            let seminarProfessorIds = (c.seminarProfessors.length>0) ? c.seminarProfessors.map(s => s._id) : []

            let obj = {'_id': c._id, 'name': c.name, 'theoryHr': c.theoryHr, 'practiceHr': c.practiceHr, 'seminarHr': c.seminarHr,
                       'mandatory': c.mandatory, 'theoryNeedsComputers': c.theoryNeedsComputers, 'practiceNeedsComputers': c.practiceNeedsComputers,
                       'seminarNeedsComputers': c.seminarNeedsComputers, 'theoryProfessors': c.theoryProfessors, 'practiceProfessors': c.practiceProfessors,
                       'seminarProfessors': c.seminarProfessors, 'semesters':c.semesters ,'numStudents':numStudents,
                       'userId': this.user._id}

            let dbObj = {'name': c.name, 'theoryHr': c.theoryHr, 'practiceHr': c.practiceHr, 'seminarHr': c.seminarHr,
                       'mandatory': c.mandatory, 'theoryNeedsComputers': c.theoryNeedsComputers, 'practiceNeedsComputers': c.practiceNeedsComputers,
                       'seminarNeedsComputers': c.seminarNeedsComputers, 'theoryProfessorIds': theoryProfessorIds, 'practiceProfessorIds': practiceProfessorIds,
                       'seminarProfessorIds': seminarProfessorIds, 'semesterIds':semesterIds ,'numStudents':numStudents,
                       'userId': this.user._id}

            let response = await subjectService.updateSubject(obj._id, dbObj)
            if(response.status == "success"){
                let newRow = [this.editSubjectIndex, obj.name, obj.theoryHr, obj.practiceHr, obj.seminarHr, obj.mandatory, obj.numStudents]
                Vue.set(this.params.data, this.editSubjectIndex, newRow)
                window.$('#editSubject').modal('hide');
            }
        },

        async deleteSubject(){
            let response = await subjectService.deleteSubject(this.nextDeleteSubject._id)
            if(response.status == 200){
                this.$router.go(0)
                //let index = this.subjects.findIndex(el => el._id == this.nextDeleteSubject._id)
                //this.subjects.splice(index,1)
                //window.$('#deleteSubject').modal('hide');
            }
        },

        async subjectDeleteInfo(subject){
          this.feedback = ''
          this.resetDeleteInfo()
          //this.nextDeleteSubject = subject
          let id = this.nextDeleteSubject._id
          let response = await deleteInfoService.getInfoSubjects(id).catch(err => this.feedback = "Internal server error.")
          if(response.status == 200) this.deleteInfo = response.data
          
        },

        getFacultyNameById(faculty_id){
          let faculty = this.faculties.find(el => el._id == faculty_id && el.userId == this.user._id)
          if(!faculty) return ""
          return faculty.name
        },

        prepareData(){
            for(let i in this.faculties){
                let faculty = this.faculties[i]
                this.facultyIdToSemesters[faculty._id] = []
                for(let j in this.semesters){
                    let semester = this.semesters[j]
                    if(faculty._id == semester.facultyId){
                        this.facultyIdToSemesters[faculty._id].push(semester)
                        semester.facultyName = faculty.name;
                    }
                }
            }
            for(let i in this.professors){
                let professor = this.professors[i]
                this.professoridToProfessorObj[professor._id] = professor
            }
            for(let i in this.semesters){
                let semester = this.semesters[i]
                this.semesterIdToSemesterObj[semester._id] = semester
            }
        },
        async getSubjects(){
            let subjects_ = (await subjectService.getSubjects()).filter(el => el.userId == this.user._id)
            this.subjects = subjects_.map(s => {
                 return {
                     _id: s._id,
                     name: s.name,
                     theoryHr: s.theoryHr,
                     practiceHr: s.practiceHr,
                     seminarHr: s.seminarHr,
                     mandatory: s.mandatory,
                     theoryNeedsComputers: s.theoryNeedsComputers,
                     practiceNeedsComputers: s.practiceNeedsComputers,
                     seminarNeedsComputers: s.seminarNeedsComputers,
                     theoryProfessors: s.theoryProfessorIds.map(id => this.professoridToProfessorObj[id]),
                     practiceProfessors: s.practiceProfessorIds.map(id => this.professoridToProfessorObj[id]),
                     seminarProfessors: s.seminarProfessorIds.map(id => this.professoridToProfessorObj[id]),
                     semesters: s.semesterIds.map(id => this.semesterIdToSemesterObj[id]),
                     numStudents: s.numStudents,
                     userId: s.userId
                 }
            })
        },
        renderSelect(){
            window.$(function(){
                window.$('.__selectpicker').selectpicker('render')
            })
        }
    },

    async mounted(){
      this.user = JSON.parse(await localStorage.getItem('user'))
      this.faculties = (await facultyService.getFaculties()).filter(el => el.userId == this.user._id)
      this.semesters = (await semesterService.getSemesters()).filter(el => el.userId == this.user._id)
      this.professors = (await professorService.getProfessors()).filter(el => el.userId == this.user._id )
      this.prepareData()
      await this.getSubjects()

      for(let i=0;i<this.subjects.length;i++){
        let s = this.subjects[i]
        this.indexToSubject[i+1] = s
        let row = [i+1, s.name, s.theoryHr, s.practiceHr, s.seminarHr, s.mandatory, s.numStudents]
        this.params.data.push(row)
      }
      if(this.params.data.length>1) this.rowClick(1, this.params.data[1])
      
      window.$(document).ready(function() {
          window.$('.__selectpicker').selectpicker();
          document.getElementById('seminarCol').style.display = "none";
      })

      window.$(document).on('keypress',e => {
          let modalOpen = window.$('#addSubject').hasClass('show')
          if(e.which == 13 && modalOpen) window.$("#addSubjectBtn").click()
      });
      this.loaded = true
    },

    watch: {
        "createSubject.theoryHr": function(newVal, oldVal){
            if(newVal > 0){
                document.getElementById('theoryCol').style.display = "block";
                document.getElementById('theoryCol_edit').style.display = "block";
            }
            else{
                document.getElementById('theoryCol').style.display = "none";
                document.getElementById('theoryCol_edit').style.display = "none";
                this.createSubject.theoryProfessors = []
            }
        },
        "createSubject.practiceHr": function(newVal, oldVal){
            if(newVal > 0){
                document.getElementById('practiceCol').style.display = "block";
                document.getElementById('practiceCol_edit').style.display = "block";

            }
            else{
                document.getElementById('practiceCol').style.display = "none";
                document.getElementById('practiceCol_edit').style.display = "none";
                this.createSubject.practiceProfessors = []
            }
        },
        "createSubject.seminarHr": function(newVal, oldVal){
            if(newVal > 0){
                document.getElementById('seminarCol').style.display = "block";
                document.getElementById('seminarCol_edit').style.display = "block";
            }
            else{
                document.getElementById('seminarCol').style.display = "none";
                document.getElementById('seminarCol_edit').style.display = "none";
                this.createSubject.seminarProfessors = []
            }
        },
    }
}
</script>

<style lang="scss" scoped>

</style>