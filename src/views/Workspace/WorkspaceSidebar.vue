<template>
<div v-if="loaded && !noTimetables" id="workspaceSidebar" class="container-fluid shadow-workspace"  style="height:100%; overflow: auto;">
    <h5 class="text-left pt-3" style="font-weight:bold;">Subjects</h5>

    <div class="form-group">
        <!--<span class="fa fa-search searchicon"></span>-->
        <input v-model="searchTerm" @keyup="search" type="text" class="form-control text-center mt-4" placeholder="Search.."/>
        <small style="color:gray;">By professor, subject or semester name</small>
    </div>

    <div class="mb-3" style="justify-content:center; font-size:13px;">
        <span class="mr-4">
            <div class="circle mr-1" style="background:#F6986D"></div>
            Theory
        </span>
        <span class="mr-4">
            <div class="circle mr-1" style="background:#6DD0F6"></div>
            Practice
        </span>
        <span>
            <div class="circle mr-1" style="background:#C46DF6"></div>
            Seminar
        </span>
    </div> 

    <div class="box mb-3" v-for="professor in activeProfessors" :key="professor._id">
        <p class="text-left" style="color: #B4B4B4; font-size:14px;">{{professor.firstName + " " + professor.lastName}} </p>
        <ul class="list-group">
            <li v-for="subject in professorSubjects[professor._id]" :key="subject._id"
                class="list-group-item mb-2" >

                <div class="firstbox noselect" @click="clickSubject(subject,professor)"
                     style="cursor:pointer;" :title="subject.name">

                    <span class="hideOverflow"><span v-if="!subject.mandatory" class="mr-1">*</span>{{subject.name}}</span>

                    <div style="display: inline; float:right;">
                        <span v-if="subject.theoryHr>0" class="biggerCircle text-right mr-1" style="background: #F6986D;">30</span>
                        <span v-if="subject.practiceHr>0" class="biggerCircle text-right mr-1" style="background: #6DD0F6;">30</span>
                        <span v-if="subject.seminarHr>0" class="biggerCircle text-right" style="background: #C46DF6;">30</span>
                    </div>
                </div>
                <hr v-if="clickedSubject.subject._id == subject._id && clickedSubject.professor._id == professor._id" 
                    style="margin-bottom:0 ;"/>
                <div v-if="clickedSubject.subject._id == subject._id && clickedSubject.professor._id == professor._id"
                    class="secondbox mt-2">
                    
                    <div class="subjectNeedsBar" style="margin-right:10px; display:flex; justify-content:center;">
                        <div class="col-3 text-center" style="padding:0px;">
                            <span><i class="fas fa-chair"></i> {{clickedSubject.subject.numStudents}}</span>
                        </div>
                        <div v-if="clickedSubject.subject.theoryHr>0" class="col-3 text-center" style="padding:0px;">
                            <span style="color: #F6986D">
                                <i class="fas fa-tv mr-1"></i>
                                <div v-if="!clickedSubject.subject.theoryNeedsComputers" class="circle" style="width: 8px; height:8px; background-color:red;"></div>
                                <div v-else class="circle" style="width: 8px; height:8px; background-color:#7FFF00;"></div>
                            </span>
                        </div>

                        <div v-if="clickedSubject.subject.practiceHr>0" class="col-3 text-center" style="padding:0px;">
                            <span style="color: #6DD0F6">
                                <i class="fas fa-tv mr-1"></i>
                                <div v-if="!clickedSubject.subject.practiceNeedsComputers" class="circle" style="width: 8px; height:8px; background-color:red;"></div>
                                <div v-else class="circle" style="width: 8px; height:8px; background-color:#7FFF00;"></div>
                            </span>
                        </div>

                        <div v-if="clickedSubject.subject.seminarHr>0" class="col-3 text-center" style="padding:0px;">
                            <span style="color: #C46DF6">
                            <i class="fas fa-tv mr-1"></i>
                            <div v-if="!clickedSubject.subject.seminarNeedsComputers" class="circle" style="width: 8px; height:8px; background-color:red;"></div>
                            <div v-else class="circle" style="width: 8px; height:8px; background-color:#7FFF00;"></div>
                            </span>
                        </div>
                    </div>



                    <p class="text-left mt-2" style="color: #B4B4B4; font-size:14px;">Choose classroom:</p>
                    <button @click="clickClassroom(classroom)"
                         v-for="classroom in sortedClassrooms" :key="classroom._id" :class="(clickedClassroom._id == classroom._id) ? 'secondbox-button activeSecondboxBtn' : 'secondbox-button'">
                        {{classroom.name}} 
                        <span v-if="classroom.hasComputers"><i class="fas fa-tv" style="font-size:12px;"></i></span>
                    </button>
                </div>
                <hr v-if="clickedClassroom && clickedSubject.subject._id == subject._id && clickedSubject.professor._id == professor._id"
                    style="margin:12px 0px 0px 0px;"/>
                <div v-if="clickedClassroom && clickedSubject.subject._id == subject._id && clickedSubject.professor._id == professor._id"
                    class="lastbox mt-2">
                    
                    <span class="mr-3"><i class="fas fa-chair"></i> {{clickedClassroom.capacity}}</span>
                    <span>
                        <i class="fas fa-tv mr-1"></i>
                        <div v-if="!clickedClassroom.hasComputers" class="circle" style="width: 8px; height:8px; background-color:red;"></div>
                        <div v-else class="circle" style="width: 8px; height:8px; background-color:#7FFF00;"></div>
                    </span>
                </div>
            </li>
        </ul>
    </div>

</div>
</template>

<script>
import professorService from '@/services/professorService.js'
import classroomService from '@/services/classroomService.js'
import semesterService from '@/services/semesterService.js'
import subjectService from '@/services/subjectService.js'

export default {
    data(){
        return {
            user: null,
            professors: [],
            classrooms: [],
            semesters: [],
            subjects: [],
            winterProfessorSubjects: {},
            summerProfessorSubjects: {},
            professorSubjects: {},
            professorIdToObj: {},
            semesterIdToObj: {},
            clickedSubject: {
                subject: "",
                professor: ""
            },
            clickedClassroom: "",
            searchTerm:"",
            clickedSeason: 'winter',
            loaded: false,
            noTimetables: false,
        }
    },

    methods: {
        search(){
            let s = this.searchTerm.toLowerCase()
            let filteredResult = {}
            let currentResults = {}
            if(this.clickedSeason == 'winter') currentResults = this.winterProfessorSubjects
            else if(this.clickedSeason == 'summer') currentResults = this.summerProfessorSubjects
            for(let key in currentResults){
                let professor = this.professorIdToObj[key]
                
                if(professor.firstName.toLowerCase().includes(s) || professor.lastName.toLowerCase().includes(s)){
                    filteredResult[key] = currentResults[key]
                    continue
                }
                
                let semFound = false
                for(let i=0;i<currentResults[key].length; i++){
                    let subject = currentResults[key][i]
                    let foundSem = subject.semesterIds.filter(id => this.semesterIdToObj[id].name.toLowerCase().includes(s))
                    if(foundSem.length>0) {
                        filteredResult[key] = currentResults[key]
                        semFound = true
                        break
                    }
                }
                if(semFound) continue

                let found = currentResults[key].filter(subject => subject.name.toLowerCase().includes(s)) 
                if(found.length>0) filteredResult[key] = found
            }
            this.professorSubjects = filteredResult
        },
        clickSubject(subject, professor){
            let selectedCreate = {"subject": subject, "professor": professor, "classroom": null}
            this.$root.$emit('subjectClicked', selectedCreate)
            this.clickedClassroom = ''
            if(this.clickedSubject.subject != "" && this.clickedSubject.professor!="" &&
               this.clickedSubject.subject._id == subject._id && this.clickedSubject.professor._id == professor._id){
                this.clickedSubject.subject = ''
                this.clickedSubject.professor = ''
                return
            }
            this.clickedSubject.subject = subject
            this.clickedSubject.professor = professor
        },
        clickClassroom(classroom){
            let selectedCreate = {"classroom": classroom}
            this.$root.$emit("classroomClicked", selectedCreate)
            if(classroom._id == this.clickedClassroom._id) this.clickedClassroom = ''
            else this.clickedClassroom = classroom
        }
    },

    async mounted(){
        this.$root.$on('noTimetables', () => {
            this.noTimetables = true
        })

        this.user = JSON.parse(await localStorage.getItem('user'))
        this.professors = (await professorService.getProfessors()).filter(el => el.userId == this.user._id)
        this.classrooms = (await classroomService.getClassrooms()).filter(el => el.userId == this.user._id)
        this.semesters = (await semesterService.getSemesters()).filter(el => el.userId == this.user._id)
        this.subjects = (await subjectService.getSubjects()).filter(el => el.userId == this.user._id)
        this.winterSubjects = this.subjects.filter(el => el.semesterIds.some(s => s == 'winter'))
        
        for(let i=0; i<this.subjects.length; i++){
            let subject = this.subjects[i]

            let isWinter = false
            let isSummer = false
            for(let j=0; j<subject.semesterIds.length; j++){
                let sid = subject.semesterIds[j]
                let semester = this.semesters.find(el => el._id == sid)
                if(semester.season == 'winter') isWinter = true
                else if(semester.season == 'summer') isSummer = true
                if(isWinter && isSummer) break
            }

            let professors = new Set()
            if(subject.theoryProfessorIds) subject.theoryProfessorIds.forEach(professors.add, professors)
            if(subject.practiceProfessorIds) subject.practiceProfessorIds.forEach(professors.add, professors)
            if(subject.seminarProfessorIds) subject.seminarProfessorIds.forEach(professors.add, professors)
            
            professors = Array.from(professors)
            for(let i=0; i<professors.length; i++){
                let _id = professors[i]
                if(!(_id in this.professorSubjects)) this.professorSubjects[_id] = []
                if(isWinter && !(_id in this.winterProfessorSubjects)) this.winterProfessorSubjects[_id] = []
                if(isSummer && !(_id in this.summerProfessorSubjects)) this.summerProfessorSubjects[_id] = []
                this.professorSubjects[_id].push(subject)
                if(isWinter) this.winterProfessorSubjects[_id].push(subject)
                if(isSummer) this.summerProfessorSubjects[_id].push(subject)
            }
        }


        for(let i=0; i<this.professors.length; i++)
            this.professorIdToObj[this.professors[i]._id] = this.professors[i]
        
        for(let i=0;i<this.semesters.length;i++)
            this.semesterIdToObj[this.semesters[i]._id] = this.semesters[i]
        
        this.professorSubjects = this.winterProfessorSubjects
        this.$root.$on('seasonSwitched', season => {
            if(this.clickedSeason == season) return;
            this.clickedSeason = season
            if(season == 'winter') this.professorSubjects = this.winterProfessorSubjects
            else if(season == 'summer') this.professorSubjects = this.summerProfessorSubjects
        })

        this.loaded = true
    },

    computed: {
        activeProfessors: function() {
            let res = this.professors.filter(el => {
                if(el._id in this.professorSubjects && this.professorSubjects[el._id].length>0) return true
            })
            return res
        },
        sortedClassrooms: function(){
            let classrooms = this.classrooms.sort((a,b) => {
                 if(a.hasComputers == b.hasComputers) return b.capacity - a.capacity
                 return a.hasComputers ? 1 : -1
            })
            return classrooms 
        }
    }
}
</script>

<style lang="scss" scoped>
#workspaceSidebar{
    height:100%;
    background-color: #E4E4E4;
}

.box{
    background-color: white;
    border-radius: 8px;
    padding: 10px 25px 20px 25px;
}

.box:last-child{
    margin-bottom:70px !important;
}

.firstbox{
    //padding: 0px 5px 0px 15px;
    padding: 10px 5px 10px 15px;
}

.list-group-item{
    text-align: left;
    //padding: 10px 0px 10px 0px;
    padding:0;
    font-size:13px;
    border: 1px solid lightgray;
    border-radius: 5px;

    -webkit-box-shadow: 0px 0px 4px 0.5px rgba(0,0,0,0.16);
    -moz-box-shadow: 0px 0px 4px 0.5px rgba(0,0,0,0.16);
    box-shadow: 0px 0px 4px 0.5px rgba(0,0,0,0.16);
}

.list-group-item span{
    display: inline-block;
    vertical-align: middle;
}

.hideOverflow{
    display: inline-block;
    max-width: 64%;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
}

.biggerCircle{
    background: #f00;
    width: 25px;
    line-height: 25px;
    border-radius: 50%;
    display:inline-block;
    text-align: center !important;
    color:white;
    //float: right;
}

.circle {
    background: #f00;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display:inline-block;
}

.searchicon{
    font-size:13px;
    position: absolute;
    z-index: 2;
    display: block;
    width: 2.375rem;
    height: 2.375rem;
    line-height: 2.375rem;
    text-align: center;
    pointer-events: none;
    color: #aaa;
}

.shadow-workspace{
    -webkit-box-shadow: inset 2px 0px 16px -6px rgba(0,0,0,0.2), inset -2px 0px 16px -6px rgba(0,0,0,0.2);
    -moz-box-shadow: inset 2px 0px 16px -6px rgba(0,0,0,0.2), inset -2px 0px 16px -6px rgba(0,0,0,0.2);
    box-shadow: inset 2px 0px 16px -6px rgba(0,0,0,0.2), inset -2px 0px 16px -6px rgba(0,0,0,0.2);
}

.secondbox{
    background-color: white;
    padding: 0px 5px 10px 15px;
}

.secondbox-button{
    background-color:white;
    border: 1px solid gray;
    
    border-radius: 3px;
    margin: 0px 3px 6px 0px;
}
.activeSecondboxBtn{
    background-color:#707070;
    color: white;
}

.lastbox{
    padding: 0px 5px 10px 15px;
    text-align:center;
}

.lastbox i{
    font-size:20px;
}

.subjectNeedsBar{
    font-size:15px;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
</style>