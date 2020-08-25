<template>
<div class="row w-100 mt-3" style="padding:0; margin:0;">
    <div class="col-4">
        <h2 class="text-left mr-4" style="font-weight: bold;">Timetable</h2>
    </div>

    <div id="timetableCol" class="col-6 offset-2 text-right" :key="this.timetables.length" style="padding:0px;">
        <select 
                v-model="selectedTimetable_mut" id="test"
                class="__selectpicker" data-live-search="true" data-width="50%" title="Select timetable">
            <option v-for="timetable in this.timetables" :key="timetable._id" :value="timetable">
                {{timetable.name}}
            </option>
        </select>
        <div v-if="getDataFromDB" class="d-inline">
            <button @click="openAddTimetableModal" data-toggle="modal" data-target="#addTimetable" class="topBTN d-inline ml-2 mr-1"><i class="fas fa-plus-circle"></i></button>
            <button @click="openEditTimetableModal" data-toggle="modal" data-target="#editTimetable" class="topBTN d-inline mr-1"><i class="fas fa-edit"></i></button>
            <button @click="openDeleteTimetableModal" data-toggle="modal" data-target="#deleteModal" class="topBTN d-inline trash"><i class="fas fa-trash-alt"></i></button>
        </div>
        <div v-else class="d-inline">
            <button @click="saveSolverTimetableToDB" class="topBTN d-inline ml-2 mr-1" style="width:150px;"><i class="fas fa-save"></i> Save timetable</button>
        </div>

    </div>

    <!-- to be refactored -->
    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Delete timetable</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <h3 class="mb-4">Are you sure?</h3>
                <p>Deleting this timetable will result in <b>deletion</b> of the following number of items that <b>reference this timetable</b>:</p> 
                <ul class="list-group list-group-flush">
                <li class="list-group-item">Schedules: {{deleteInfo.needsDeleteSchedules}}</li>
                </ul>
                <p style="color: red;" class="mt-4">{{feedbackModal}}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
                <button @click="deleteTimetable"  type="button" class="btn btn-danger">Confirm delete</button>
            </div>
            </div>
        </div>
    </div>

</div>
</template>

<script>
import deleteInfoService from '@/services/deleteInfoService.js'
import timetableService from '@/services/timetableService.js'
export default {
    props: {
        timetables: Array,
        allSubjects: Array,
        getDataFromDB: Boolean
    },
    data(){
        return {
            selectedTimetable_mut: {},
            deleteInfo: {
                needsDeleteTimetables: 0,
                needsDeleteSchedules: 0
            },
            feedbackModal: ''
        }
    },
    methods: {
        saveSolverTimetableToDB(){
            this.$emit('saveSolverTimetableToDB', this.selectedTimetable_mut, this.allSubjects)
        },
        openAddTimetableModal(){
            this.$emit('adjustDatepickerStyle')
        },
        openEditTimetableModal(){
            this.$emit('adjustEditDatepickerStyle')
            this.$emit('loadEditTimetableData', this.selectedTimetable_mut)
        },

        changeTimetable(timetable){
            this.$emit('changeTimetable', timetable)
        },
        resetDeleteInfo(){
          this.deleteInfo = {
            needsDeleteTimetables: 0,
            needsDeleteSchedules: 0
          }
        },
        async openDeleteTimetableModal(){
          this.feedbackModal = ''
          this.resetDeleteInfo()
          let response = await deleteInfoService.getInfoTimetables(this.selectedTimetable_mut._id).catch(err => this.feedbackModal = "Internal server error.")
          if(response.status == 200) this.deleteInfo = response.data
        },
        async deleteTimetable(){
            let response = await timetableService.deleteTimetable(this.selectedTimetable_mut._id).catch(err => this.feedbackModal = err.message)
            if(response.status == 200){
                this.$router.go(this.$router.currentRoute) //for now just refresh the page
                let index = this.timetables.findIndex(el => el._id == this.selectedTimetable_mut._id)
                this.timetables.splice(index,1)
                window.$('#deleteModal').modal('hide');
            }
        },
        
        renderSelect(){
            window.$(function () {
                window.$('.__selectpicker').selectpicker('render')
            })
        },
    },
    async mounted(){
        if(this.timetables.length>0) this.selectedTimetable_mut = this.timetables[0]
        window.$('.__selectpicker').selectpicker('render')
    },
    watch: {
        selectedTimetable_mut:{
            //immediate: true,
            deep: true,
            async handler(newval, oldval){
                this.changeTimetable(newval)
            },
        },
    }
}
</script>

<style lang="scss" scoped>
.topBTN{
    height: 40px;
    width: 40px;
    outline: none;
    border-radius:10px;
    background-color: white;
    color: #3E6781;
    border: 1px solid #3E6781; 
    text-align:center !important;
}
.topBTN i{
    font-size:20px;
    vertical-align:middle;
}
.topBTN:hover{
    background-color: #3E6781;
    color: white;
}

.trash:hover{
    background-color:red !important;
    border: 1px solid white !important;
}

.center{
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    height: 50%;
    width: 50%;
    background: red;
}
</style>