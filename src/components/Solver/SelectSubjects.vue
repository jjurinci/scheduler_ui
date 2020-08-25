<template>
<div class="container-fluid">
    <SolverNavigation :whoIsParent="'selectSubjects'" @winterSubjects="swapSubjectsToWinter" @summerSubjects="swapSubjectsToSummer" @detailsSubject="detailsModal"/>
    <hr/>
    
    <h4 class="mb-4">Select all subjects that you want to include.</h4>
    <button @click="nextStep()" class="nextBTN">Next</button>

      
    <div class="col-12 mt-4">
      <vue-table-dynamic :params="params" @row-click="rowClick" ref="table"></vue-table-dynamic>
    </div>

    <!-- Modal Details -->
    <div class="modal" id="detailModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Subject Details</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form v-if="nextDetailSubject" :key="nextDetailSubject._id">
                    <div class="row">
                        <div class="col-12 mb-4">
                            <label for="subjectName">Subject name</label>
                            <input v-model="nextDetailSubject.name" type="text" class="form-control" id="subjectName" disabled style="cursor: not-allowed;">
                        </div>

                        <div class="col-4">
                            <label for="theoryhr">Theory (hr)</label>
                            <input v-model="nextDetailSubject.theoryHr" type="number" class="form-control" id="theoryhr" disabled style="cursor: not-allowed;">
                        </div>
                        <div class="col-4">
                            <label for="practicehr">Practice (hr)</label>
                            <input v-model="nextDetailSubject.practiceHr" type="number" class="form-control" id="practicehr" disabled style="cursor: not-allowed;">
                        </div>
                        <div class="col-4">
                            <label for="seminarhr">Seminar (hr)</label>
                            <input v-model="nextDetailSubject.seminarHr" type="number" class="form-control" id="seminarhr" disabled style="cursor: not-allowed;">
                        </div>

                        <div id="theoryCol_details" class="col-12 mt-4">
                            <label for="theoryProfessors"><b>Theory</b> professors</label>
                            <select v-model="nextDetailSubject.selectedTheoryProfessor" 
                                    class="__selectpicker" data-live-search="true" data-width="100%"
                                    data-live-search-placeholder="Search">
                                <option disabled v-for="professor in nextDetailSubject.theoryProfessors" :key="professor._id" :value="professor">
                                    {{professor.firstName + ' ' + professor.lastName}}
                                </option>
                            </select>
                        </div>

                        <div id="practiceCol_details" class="col-12 mt-4">
                            <label for="practiceProfessors"><b>Practice</b> professors</label>
                            <select v-model="nextDetailSubject.selectedPracticeProfessor" 
                                    class="__selectpicker" data-live-search="true" data-width="100%">
                                <option disabled v-for="professor in nextDetailSubject.practiceProfessors" :key="professor._id" :value="professor">
                                    {{professor.firstName + ' ' + professor.lastName}}
                                </option>
                            </select>
                        </div>
                        
                        <div id="seminarCol_details" class="col-12 mt-4">
                            <label for="seminarProfessors"><b>Seminar</b> professors</label>
                            <select v-model="nextDetailSubject.selectedSeminarProfessor"  
                                    class="__selectpicker" data-live-search="true" data-width="100%">
                                <option disabled v-for="professor in nextDetailSubject.seminarProfessors" :key="professor._id" :value="professor">
                                    {{professor.firstName + ' ' + professor.lastName}}
                                </option>
                            </select>
                        </div>
                        
                        <div id="semesterCol" class="col-12 mt-4">
                            <label for="allSemesters"><b>All</b> semesters</label>
                            <select v-model="nextDetailSubject.semesters"  
                                    class="__selectpicker" data-live-search="true" data-width="100%" multiple>
                                <optgroup v-for="faculty in this.faculties" :key="faculty._id" :label="faculty.name" disabled style="cursor: not-allowed;">
                                    <option v-for="semester in facultyIdToSemesters[faculty._id]" :key="semester._id" :value="semester" :data-tokens="semester.facultyName">
                                        {{semester.name}}
                                    </option>
                                </optgroup>
                            </select>
                        </div>

                        <div class="col-4 mt-4 mx-auto">
                            <input v-model="nextDetailSubject.mandatory" class="form-check-input" type="checkbox" id="MandatoryCheckbox" disabled style="cursor: not-allowed;">
                            <label class="form-check-label" for="MandatoryCheckbox">Mandatory</label>
                        </div>

                        <div v-if="nextDetailSubject.theoryHr > 0" class="col-4 mt-4 mx-auto">
                            <input v-model="nextDetailSubject.theoryNeedsComputers" class="form-check-input" type="checkbox" id="TheoryCompCheckbox" disabled style="cursor: not-allowed;">
                            <label class="form-check-label" for="TheoryCompCheckbox">Theory needs computers</label>
                        </div>
                        
                        <div v-if="nextDetailSubject.practiceHr > 0" class="col-4 mt-4 mx-auto">
                            <input v-model="nextDetailSubject.practiceNeedsComputers" class="form-check-input" type="checkbox" id="PracticeCompCheckbox" value="option2" disabled style="cursor: not-allowed;">
                            <label class="form-check-label" for="PracticeCompCheckbox">Practice needs computers</label>
                        </div>
                                        
                        <div v-if="nextDetailSubject.seminarHr > 0" class="col-4 mt-4 mx-auto">
                            <input v-model="nextDetailSubject.seminarNeedsComputers" class="form-check-input" type="checkbox" id="SeminarCompCheckbox" value="option2" disabled style="cursor: not-allowed;">
                            <label class="form-check-label" for="SeminarCompCheckbox">Seminar needs computers</label>
                        </div>

                        <div v-if="!nextDetailSubject.mandatory" class="col-12 mt-4">
                            <label for="NonMandatoryNumOfStudents"><b>Estimated</b> number of students</label> <br/>
                            <input v-model="nextDetailSubject.numStudents" class="form-control w-75 mx-auto" type="number" id="NonMandatoryNumOfStudents" disabled style="cursor: not-allowed;">
                            <small>Since the subject is not mandatory.</small>
                        </div>
                        
                    </div>
                </form>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
                <!--<button @click="saveDetailData()" type="button" class="btn btn-primary">Save</button>-->
            </div>
            </div>
        </div>
    </div>

    <!-- Modal Group -->
    <div class="modal" ref="groupModal" id="groupModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Subject Groups</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form v-if="nextGroupSubject" :key="nextGroupSubject._id">
                    <div class="row">
                        <div class="col-12 mb-4">
                            <label for="subjectName">Subject name</label>
                            <input v-model="nextGroupSubject.name" type="text" class="form-control" id="subjectName" disabled style="cursor: not-allowed;">
                        </div>

                        <div class="col-12 mb-4">
                            <div class="btn-group">
                                <button v-if="nextGroupSubject.theoryHr > 0"
                                        @click.prevent="switchGroupType('theory')"
                                        :class="nextGroupSubject.type == 'theory' ? 'btn btn-primary' : 'btn btn-outline-primary'">Theory</button>
                                <button v-if="nextGroupSubject.practiceHr > 0"
                                        @click.prevent="switchGroupType('practice')"
                                        :class="nextGroupSubject.type == 'practice' ? 'btn btn-primary' : 'btn btn-outline-primary'">Practice</button>
                                <button v-if="nextGroupSubject.seminarHr > 0"
                                        @click.prevent="switchGroupType('seminar')"
                                        :class="nextGroupSubject.type == 'seminar' ? 'btn btn-primary' : 'btn btn-outline-primary'">Seminar</button>
                            </div>
                        </div>

                        <div class="col-12 mb-4" id="theoryCol_group">
                            <div class="col-12 mb-4">
                                <p v-if="!nextGroupSubject.theoryNumGroups">Current groups: 1</p>
                                <p v-else>Current groups: {{nextGroupSubject.theoryNumGroups}}</p>
                            </div>

                            <div class="col-12 mb-4">
                                <label for="numGroupsInputTheory">New number of groups</label>
                                <input v-model="nextGroupSelect.theoryNumGroups" type="number" class="form-control w-25 mx-auto text-center" id="numGroupsInputTheory"/>
                            </div>

                            <div v-for="group in Number(nextGroupSelect.theoryNumGroups)" :key="group" class="col-12 mt-4">
                                <label for="theoryProfessors">Theory professors <b>group {{group}}</b></label>
                                <select v-model="nextGroupSelect.theoryGroupProfessors[group-1]" 
                                        class="__selectpicker" data-live-search="true" data-width="100%"
                                        data-live-search-placeholder="Search">

                                    <option v-for="professor in nextGroupSubject.theoryProfessors" :key="professor._id" :value="professor">
                                        {{professor.firstName + ' ' + professor.lastName}}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="col-12 mb-4" id="practiceCol_group">
                            <div class="col-12 mb-4">
                                <p v-if="!nextGroupSubject.practiceNumGroups">Current groups: 1</p>
                                <p v-else>Current groups: {{nextGroupSubject.practiceNumGroups}}</p>
                            </div>

                            <div class="col-12 mb-4">
                                <label for="numGroupsInputPractice">New number of groups</label>
                                <input v-model="nextGroupSelect.practiceNumGroups" type="number" class="form-control w-25 mx-auto text-center" id="numGroupsInputPractice"/>
                            </div>
                            
                            <div v-for="group in Number(nextGroupSelect.practiceNumGroups)" :key="group" class="col-12 mt-4">
                                <label>Practice professors <b>group {{group}}</b></label>
                                <select v-model="nextGroupSelect.practiceGroupProfessors[group-1]" 
                                        class="__selectpicker" data-live-search="true" data-width="100%"
                                        data-live-search-placeholder="Search">

                                    <option v-for="professor in nextGroupSubject.practiceProfessors" :key="professor._id" :value="professor">
                                        {{professor.firstName + ' ' + professor.lastName}}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="col-12 mb-4" id="seminarCol_group">
                            <div class="col-12 mb-4">
                                <p v-if="!nextGroupSubject.seminarNumGroups">Current groups: 1</p>
                                <p v-else>Current groups: {{nextGroupSubject.seminarNumGroups}}</p>
                            </div>

                            <div class="col-12 mb-4">
                                <label for="numGroupsInputSeminar">New number of groups</label>
                                <input v-model="nextGroupSelect.seminarNumGroups" type="number" class="form-control w-25 mx-auto text-center" id="numGroupsInputSeminar"/>
                            </div>

                            <div v-for="group in Number(nextGroupSelect.seminarNumGroups)" :key="group" class="col-12 mt-4">
                                <label>Seminar professors <b>group {{group}}</b></label>
                                <select v-model="nextGroupSelect.seminarGroupProfessors[group-1]" 
                                        class="__selectpicker" data-live-search="true" data-width="100%"
                                        data-live-search-placeholder="Search">

                                    <option v-for="professor in nextGroupSubject.seminarProfessors" :key="professor._id" :value="professor">
                                        {{professor.firstName + ' ' + professor.lastName}}
                                    </option>
                                </select>
                            </div>
                        </div>


                    </div>
                </form>

            </div>
            <div class="modal-footer">
                <small style="margin-right: auto; width:60%; text-align:left;">
                    Tip: Save before switching to
                    <span v-if="nextGroupSubject.type != 'theory'">Theory / </span>
                    <span v-if="nextGroupSubject.type != 'practice'">Practice / </span>
                    <span v-if="nextGroupSubject.type != 'seminar'">Seminar</span>
                     tabs to store changes.
                </small>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
                <button @click="saveGroupData()" type="button" class="btn btn-primary">Save</button>
            </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import subjectService from '@/services/subjectService'
import semesterService from '@/services/semesterService'
import professorService from '@/services/professorService'
import facultyService from '@/services/facultyService'
import SolverNavigation from './SolverNavigation.vue'
import Vue from 'vue';
export default {
    props: {
      propData : Object,
    },
    components: {
        SolverNavigation
    },
    data(){
        return {
            user: null,
            subjects: [],
            semesters: [],
            faculties: [],
            professors: [],
            facultyIdToSemesters: {},
            professoridToProfessorObj: {},
            semesterIdToSemesterObj: {},

            currentSubjects: [],
            winterSubjects: [],
            summerSubjects: [],
            selectedSeason: 'winter',

            nextDetailSubject: null,

            nextGroupSubject: {
                _id: '',
                name: '',
                type: '',
                theoryProfessors: [],
                practiceProfessors: [],
                seminarProfessors: []

            },
            nextGroupSelect: {
                theoryNumGroups: 1,
                practiceNumGroups: 1,
                seminarNumGroups: 1,
                theoryGroupProfessors: [],
                practiceGroupProfessors: [],
                seminarGroupProfessors: []
            },
            greenFeedback: '',
            redFeedback: '',

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
              highlight: {row: [1]},
              showCheck: true,
            },
            indexToSubject: {},
        }
    },

    methods: {
        rowClick(index, row){
            this.nextDetailSubject = this.indexToSubject[row[0]]
            this.params.highlight.row = []
            this.params.highlight.row.push(index)
        },
        async swapSubjectsToWinter(){
            if(this.selectedSeason == 'winter') return
            this.selectedSeason = 'winter'
            this.currentSubjects = this.winterSubjects
            this.indexToSubject = {}
            this.params.data = []
            this.params.data.push(['#', 'Name', 'Theory (hr)', 'Practice (hr)', 'Seminar (hr)', 'Mandatory', 'Students'])
            for(let i=0;i<this.currentSubjects.length;i++){
                let s = this.currentSubjects[i]
                this.indexToSubject[i+1] = s
                let row = [i+1, s.name, s.theoryHr, s.practiceHr, s.seminarHr, s.mandatory, s.numStudents]
                this.params.data.push(row)
            }
            await new Promise(r => setTimeout(r, 1000));
            await this.$refs.table.setAllRowChecked(true)

        },
        async swapSubjectsToSummer(){
            if(this.selectedSeason == 'summer') return
            this.selectedSeason = 'summer'
            this.currentSubjects = this.summerSubjects
            this.indexToSubject = {}
            
            this.params.data = []
            this.params.data.push(['#', 'Name', 'Theory (hr)', 'Practice (hr)', 'Seminar (hr)', 'Mandatory', 'Students'])
            for(let i=0;i<this.currentSubjects.length;i++){
                let s = this.currentSubjects[i]
                this.indexToSubject[i+1] = s
                let row = [i+1, s.name, s.theoryHr, s.practiceHr, s.seminarHr, s.mandatory, s.numStudents]
                this.params.data.push(row)
            }
            await new Promise(r => setTimeout(r, 1000));
            await this.$refs.table.setAllRowChecked(true)
        },
        nextStep(){
            this.currentSubjects = []

            let filtered = this.$refs.table.getCheckedRowDatas()
            if(filtered.length == 0) return
            for(let i=0; i<filtered.length; i++){
                let el = filtered[i]
                if(el[0] in this.indexToSubject) this.currentSubjects.push(this.indexToSubject[el[0]])  
            }
            let semesters = new Set()
            let professors = new Set()
            
            this.currentSubjects.forEach(subject => {
                //extract unique semesters
                subject.semesters.forEach(semester => semesters.add(semester))

                //extract unique professors
                let profs = []
                if(subject.theoryGroupProfessors && subject.theoryGroupProfessors.length > 0) profs = profs.concat(subject.theoryGroupProfessors)
                else if(subject.selectedTheoryProfessor) profs = profs.concat(subject.selectedTheoryProfessor)
                else if(subject.theoryHr > 0) profs = profs.concat(subject.theoryProfessors[0])
                
                if(subject.practiceGroupProfessors && subject.practiceGroupProfessors.length > 0) profs = profs.concat(subject.practiceGroupProfessors)
                else if(subject.selectedPracticeProfessor) profs = profs.concat(subject.selectedPracticeProfessor)
                else if(subject.practiceHr > 0) profs = profs.concat(subject.practiceProfessors[0])

                if(subject.seminarGroupProfessors && subject.seminarGroupProfessors.length > 0) profs = profs.concat(subject.seminarGroupProfessors)
                else if(subject.selectedSeminarProfessor) profs = profs.concat(subject.selectedSeminarProfessor)
                else if(subject.seminarHr > 0) profs = profs.concat(subject.seminarProfessors[0])

                profs.forEach(prof => professors.add(prof))
            })

            this.propData.subjects = this.currentSubjects
            this.propData.professors = Array.from(professors)
            this.propData.semesters = Array.from(semesters)

            let propData = this.propData
            this.$router.push({ name: 'Solver Semesters', params: {propData: propData} })
        },
        resetGroupObj(){
            this.nextGroupSubject = {
                _id: '',
                name: '',
                type: '',
                theoryProfessors: [],
                practiceProfessors: [],
                seminarProfessors: []
            }
            this.nextGroupSelect = {
                theoryNumGroups: 1,
                practiceNumGroups: 1,
                seminarNumGroups: 1,
                theoryGroupProfessors: [],
                practiceGroupProfessors: [],
                seminarGroupProfessors: []
            },
            this.greenFeedback = ''
            this.redFeedback = ''
        },

        renderSelect(){
            window.$(function(){
                window.$('.__selectpicker').selectpicker('render')
            })
        },

        saveDetailData(){
            let ds = this.nextDetailSubject
            let index = this.currentSubjects.findIndex(el => el._id == this.nextDetailSubject._id)
            if(this.nextDetailSubject.theoryHr > 0)
                this.currentSubjects[index].selectedTheoryProfessor = ds.selectedTheoryProfessor
            if(this.nextDetailSubject.practiceHr > 0)
                this.currentSubjects[index].selectedPracticeProfessor = ds.selectedPracticeProfessor
            if(this.nextDetailSubject.seminarHr > 0)
                this.currentSubjects[index].selectedSeminarProfessor = ds.selectedSeminarProfessor
        },

        saveGroupData(){
            let gs = this.nextGroupSelect
            let index = this.currentSubjects.findIndex(el => el._id == this.nextGroupSubject._id)
            if(this.nextGroupSubject.type == 'theory' && gs.theoryGroupProfessors.length > 0){
                this.currentSubjects[index].theoryNumGroups = gs.theoryNumGroups
                this.currentSubjects[index].theoryGroupProfessors = gs.theoryGroupProfessors
                this.nextGroupSubject.theoryNumGroups = gs.theoryNumGroups
                this.nextGroupSubject.theoryGroupProfessors = gs.theoryGroupProfessors
            }
            else if(this.nextGroupSubject.type == 'practice' && gs.practiceGroupProfessors.length > 0){
                this.currentSubjects[index].practiceNumGroups = gs.practiceNumGroups
                this.currentSubjects[index].practiceGroupProfessors = gs.practiceGroupProfessors
                this.nextGroupSubject.practiceNumGroups = gs.practiceNumGroups
                this.nextGroupSubject.practiceGroupProfessors = gs.practiceGroupProfessors
            }
            else if(this.nextGroupSubject.type == 'seminar' && gs.seminarGroupProfessors.length > 0){
                this.currentSubjects[index].seminarNumGroups = gs.seminarNumGroups
                this.currentSubjects[index].seminarGroupProfessors = gs.seminarGroupProfessors
                this.nextGroupSubject.seminarNumGroups = gs.seminarNumGroups
                this.nextGroupSubject.seminarGroupProfessors = gs.seminarGroupProfessors
            }
            this.$forceUpdate()
        },
        switchGroupType(type){
            this.nextGroupSubject.type = type
            this.nextGroupSubject = Object.assign({},this.nextGroupSubject) //to trigger watcher
           
           if(type == 'theory' && this.nextGroupSubject.theoryProfessors.length > 0 && !this.nextGroupSubject.theoryGroupProfessors){
                this.nextGroupSelect.theoryGroupProfessors[0] = this.nextGroupSubject.theoryProfessors[0]
                this.nextGroupSelect.practiceNumGroups = 1
                this.nextGroupSelect.seminarNumGroups = 1
                this.nextGroupSelect.practiceGroupProfessors = []
                this.nextGroupSelect.seminarGroupProfessors = []
            }
            else if(type == 'theory' && this.nextGroupSubject.theoryGroupProfessors){
                this.nextGroupSelect.theoryGroupProfessors = this.nextGroupSubject.theoryGroupProfessors
                this.nextGroupSelect.theoryNumGroups = this.nextGroupSubject.theoryNumGroups
            }
            if(type == 'practice' && this.nextGroupSubject.practiceProfessors.length > 0 && !this.nextGroupSubject.practiceGroupProfessors){
                this.nextGroupSelect.practiceGroupProfessors[0] = this.nextGroupSubject.practiceProfessors[0]
                this.nextGroupSelect.theoryNumGroups = 1
                this.nextGroupSelect.seminarNumGroups = 1
                this.nextGroupSelect.theoryGroupProfessors = []
                this.nextGroupSelect.seminarGroupProfessors = []
            }
            else if(type == 'practice' && this.nextGroupSubject.practiceGroupProfessors){
                this.nextGroupSelect.practiceGroupProfessors = this.nextGroupSubject.practiceGroupProfessors
                this.nextGroupSelect.practiceNumGroups = this.nextGroupSubject.practiceNumGroups
            }
            
            if(type == 'seminar' && this.nextGroupSubject.seminarProfessors.length > 0 && !this.nextGroupSubject.seminarGroupProfessors){
                this.nextGroupSelect.seminarGroupProfessors[0] = this.nextGroupSubject.seminarProfessors[0]
                this.nextGroupSelect.theoryNumGroups = 1
                this.nextGroupSelect.practiceNumGroups = 1
                this.nextGroupSelect.theoryGroupProfessors = []
                this.nextGroupSelect.practiceGroupProfessors = []
            }
            else if(type == 'seminar' && this.nextGroupSubject.seminarGroupProfessors){
                this.nextGroupSelect.seminarGroupProfessors = this.nextGroupSubject.seminarGroupProfessors
                this.nextGroupSelect.seminarNumGroups = this.nextGroupSubject.seminarNumGroups
            }
            
            //this.nextGroupSubject.__ob__.dep.notify()
            this.renderSelect()
            this.$forceUpdate()
        },
        async addGroupModal(subject){
            this.resetGroupObj()
            this.nextGroupSubject = subject
            this.nextGroupSubject.type = 'theory'
            
            let changed = false
            if(this.nextGroupSubject.theoryNumGroups){
                this.nextGroupSelect.theoryNumGroups = this.nextGroupSubject.theoryNumGroups
                this.nextGroupSelect.theoryGroupProfessors = this.nextGroupSubject.theoryGroupProfessors
                changed = true
            }
            if(this.nextGroupSubject.practiceNumGroups){
                this.nextGroupSelect.practiceNumGroups = this.nextGroupSubject.practiceNumGroups
                this.nextGroupSelect.practiceGroupProfessors = this.nextGroupSubject.practiceGroupProfessors
            }
            if(this.nextGroupSubject.seminarNumGroups){
                this.nextGroupSelect.seminarNumGroups = this.nextGroupSubject.seminarNumGroups
                this.nextGroupSelect.seminarGroupProfessors = this.nextGroupSubject.seminarGroupProfessors
            }

            if(!changed && this.nextGroupSubject.theoryProfessors.length > 0)
                this.nextGroupSelect.theoryGroupProfessors[0] = this.nextGroupSubject.theoryProfessors[0]
            
            await this.renderSelect()
            this.typeHandler('theory')
            window.$('#groupModal').modal({show: true})
        },
        async detailsModal(){
            if(this.nextDetailSubject.theoryProfessors.length > 0 && !this.nextDetailSubject.selectedTheoryProfessor)
                this.nextDetailSubject.selectedTheoryProfessor = this.nextDetailSubject.theoryProfessors[0]
            if(this.nextDetailSubject.practiceProfessors.length > 0 && !this.nextDetailSubject.selectedPracticeProfessor)
                this.nextDetailSubject.selectedPracticeProfessor = this.nextDetailSubject.practiceProfessors[0]
            if(this.nextDetailSubject.seminarProfessors.length > 0 && !this.nextDetailSubject.selectedSeminarProfessor){
                this.nextDetailSubject.selectedSeminarProfessor = this.nextDetailSubject.seminarProfessors[0]
            }

            await this.renderSelect()
            this.$forceUpdate()
            
            if(this.nextDetailSubject.theoryHr <= 0 || this.nextDetailSubject.theoryHr == "")
                document.getElementById('theoryCol_details').style.display = "none";
            if(this.nextDetailSubject.practiceHr <= 0 || this.nextDetailSubject.practiceHr == "")
                document.getElementById('practiceCol_details').style.display = "none";
            if(this.nextDetailSubject.seminarHr <= 0 || this.nextDetailSubject.seminarHr == "")
                document.getElementById('seminarCol_details').style.display = "none";            
                
            window.$('#detailModal').modal({show: true})
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
        typeHandler(newval){
            if(newval == 'theory'){
                document.getElementById('theoryCol_group').style.display = "block"
                document.getElementById('practiceCol_group').style.display = "none"
                document.getElementById('seminarCol_group').style.display = "none"
            }
            else if(newval == 'practice'){
                document.getElementById('theoryCol_group').style.display = "none"
                document.getElementById('practiceCol_group').style.display = "block"
                document.getElementById('seminarCol_group').style.display = "none"
            }
            else if(newval == 'seminar'){
                document.getElementById('theoryCol_group').style.display = "none"
                document.getElementById('practiceCol_group').style.display = "none"
                document.getElementById('seminarCol_group').style.display = "block"
            }
        },

        selectAll(included = true){
            this.currentSubjects.forEach(subject => {
                subject.included = included
            })
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
                     userId: s.userId,
                     included: true
                 }
            })
            this.winterSubjects = this.subjects.filter(s => s.semesters.some(sem => sem.season == 'winter'))
            this.summerSubjects = this.subjects.filter(s => s.semesters.some(sem => sem.season == 'summer'))
        },
    },
    async mounted(){
        this.user = JSON.parse(await localStorage.getItem('user'))
        this.faculties = (await facultyService.getFaculties()).filter(el => el.userId == this.user._id)
        this.semesters = (await semesterService.getSemesters()).filter(el => el.userId == this.user._id)
        this.professors = (await professorService.getProfessors()).filter(el => el.userId == this.user._id )
        this.prepareData()
        await this.getSubjects()
        this.currentSubjects = this.winterSubjects

        for(let i=0;i<this.currentSubjects.length;i++){
            let s = this.currentSubjects[i]
            this.indexToSubject[i+1] = s
            let row = [i+1, s.name, s.theoryHr, s.practiceHr, s.seminarHr, s.mandatory, s.numStudents]
            this.params.data.push(row)
        }
        if(this.params.data.length>1) this.rowClick(1, this.params.data[1])
        
        await new Promise(r => setTimeout(r, 1000));
        this.$refs.table.setAllRowChecked(true)
    },

    watch:{
        "nextGroupSelect.theoryNumGroups": function(newval, oldval) {
            if(this.nextGroupSubject.theoryGroupProfessors) return
            for(let group=0; group<newval; group++){
                if(this.nextGroupSubject.theoryProfessors.length > 0)
                    this.nextGroupSelect.theoryGroupProfessors[group] = this.nextGroupSubject.theoryProfessors[0]
                else this.nextGroupSelect.theoryGroupProfessors[group] = {}
            }
            this.renderSelect()
        },
        "nextGroupSelect.practiceNumGroups": function(newval, oldval) {
            if(this.nextGroupSubject.practiceGroupProfessors) return
            for(let group=0; group<newval; group++)
                if(this.nextGroupSubject.practiceProfessors.length > 0)
                    this.nextGroupSelect.practiceGroupProfessors[group] = this.nextGroupSubject.practiceProfessors[0]
                else this.nextGroupSelect.practiceGroupProfessors[group] = {}           
            this.renderSelect()
        },
        "nextGroupSelect.seminarNumGroups": function(newval, oldval) {
            if(this.nextGroupSubject.seminarGroupProfessors) return
            for(let group=0; group<newval; group++)
                if(this.nextGroupSubject.seminarProfessors.length > 0)
                    this.nextGroupSelect.seminarGroupProfessors[group] = this.nextGroupSubject.seminarProfessors[0]
                else this.nextGroupSelect.seminarGroupProfessors[group] = {}     
            this.renderSelect()
        },
        "nextGroupSubject.type": {
            //immediate: true,
            handler(newval, oldval){
                this.typeHandler(newval)
            },
        },
    }
}
</script>

<style lang="scss" scoped>
input[type=checkbox] {
    transform: scale(1.5);
}

.nextBTN{
    border-radius:10px;
    outline: none;
    height: 100%;
    font-size: 20px;
    background-color: #3E6781;
    color: white;
    border: 1px solid #3E6781; 
    text-align:center !important;
    width: 150px;
    height:40px;
}
</style>