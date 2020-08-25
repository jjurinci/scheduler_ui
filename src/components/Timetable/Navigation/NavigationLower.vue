<template>
<div class="row w-100 mx-auto mb-4" style="padding-left:15px;">
    <div class="col-12" style="margin-bottom:40px;">
        <button @click="switchSeason('winter')"
                :class="(clickedSeason == 'winter') ? 'winterSummerBTN winterSummerBTNActive mr-2' : 'winterSummerBTN mr-2'">Winter</button>
        <button @click="switchSeason('summer')"
                :class="(clickedSeason == 'summer') ? 'winterSummerBTN winterSummerBTNActive mr-2' : 'winterSummerBTN mr-2'">Summer</button>
    </div>

    <div id="semesterCol" class="col-3" :key="clickedSeason">
        <select v-model="selectedFilter.semester"  id="semesterSelect"
                class="__selectpicker" data-live-search="true" data-width="100%" title="Filter by semester" @change="filterTimetableBySemester">
            <optgroup v-for="faculty in this.faculties" :key="faculty._id" :label="faculty.name">
                <option v-for="semester in selectedSeasonSemesters(faculty._id)" :key="semester._id" :value="semester" :data-tokens="semester.facultyName">
                    {{semester.name}}
                </option>
            </optgroup>
        </select>
    </div>

    <div id="professorCol" class="col-3">
      <select v-model="selectedFilter.professor"  
              class="__selectpicker mr-2" data-live-search="true" data-width="100%" title="Filter by professor" @change="filterTimetableByProfessor">
          
          <option v-for="professor in this.professors" :key="professor._id" :value="professor">
              {{professor.firstName + ' ' + professor.lastName}}
          </option>
      </select>
    </div>
    <div id="classroomCol" class="col-3">
      <select v-model="selectedFilter.classroom"  
              class="__selectpicker" data-live-search="true" data-width="100%" title="Filter by classroom" @change="filterTimetableByClassroom">
          
          <option v-for="classroom in this.classrooms" :key="classroom._id" :value="classroom">
              {{classroom.name}}
          </option>
      </select>
    </div>

    <div class="col-3 text-center">
        <button @click="filterTimetableAllSchedules" class="filterResetBTN w-100">Reset filter <i class="fas fa-filter"></i> </button>
    </div>

</div>
</template>

<script>
export default {
    props: {
        faculties: Array,
        facultyIdToSemesters: Object,
        professors: Array,
        classrooms: Array
    },
    data(){
        return {
            clickedSeason: 'winter',
            selectedFilter: {
                classroom: null,
                semester: null,
                professor: null
            }
        }
    },
    methods: {
        filterTimetableAllSchedules(){
            this.$emit('filterTimetableAllSchedules')
        },
        filterTimetableBySemester(){
            this.$emit('filterTimetableBySemester')
        },
        filterTimetableByProfessor(){
            this.$emit('filterTimetableByProfessor')
        },
        filterTimetableByClassroom(){
            this.$emit('filterTimetableByClassroom')
        },
        switchSeason(season){
            this.clickedSeason = season
            this.$root.$emit('seasonSwitched', season)
        },
        selectedSeasonSemesters(facultyId){
            let semesters
            if(this.clickedSeason == 'winter')
                semesters = this.facultyIdToSemesters[facultyId].filter(sem => sem.season == 'winter')
            else if(this.clickedSeason == 'summer')
                semesters = this.facultyIdToSemesters[facultyId].filter(sem => sem.season == 'summer')
            
            return semesters
        },
    },

    watch: {
        selectedFilter:{
            immediate: true,
            deep: true,
            handler(newval, oldval){
                this.$emit("selectedFilterChanged", newval)
            }
        },

        clickedSeason:{
            async handler(newval, oldval){
                window.$(function () {
                    window.$('#semesterSelect').selectpicker('render')
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.winterSummerBTN{
    background-color:white;
    font-size:20px;
    font-weight: bold;
    color:lightgray;
    outline: none;
    border: none;
}
.winterSummerBTN:hover{
    border-top: 3px solid #003366;
    color: #003366;
}

.winterSummerBTNActive{
    border-top: 3px solid #003366;
    color: #003366;
}

.filterResetBTN{
    border-radius:10px;
    outline: none;
    height: 100%;
    background-color: white;
    color: #3E6781;
    border: 1px solid #3E6781; 
    text-align:center !important;
}
.filterResetBTN i{
    font-size:20px;
    vertical-align:middle;
}
.filterResetBTN:hover{
    background-color: #7994a5;
    color: white;
}

select{
    color: gray;
    border: 1px solid #3E6781;
}
</style>