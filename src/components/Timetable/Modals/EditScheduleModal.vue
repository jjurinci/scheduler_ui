<template>
    <div class="modal" ref="editScheduleModal" id="editScheduleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Edit schedule</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form v-if="selectedCreate.editSubject" :key="selectedCreate.editSubject._id">
          <div class="row">
            <div class="col-12 mb-4">
              <label for="predmet">Name</label>
              <input v-model="selectedCreate.editSubject.name" type="text" class="form-control" id="predmet" disabled style="cursor: not-allowed;">
              <small v-if="selectedCreate.type == selectedCreate.initialType">Group {{selectedCreate.group}}</small>
            </div>

            <div id="semCol" class="col-12 mb-4">
                    <label for="allSemesters">Semesters</label>
                    <select v-model="selectedCreate.editSubject.semesters" class="__selectpicker" data-live-search="true" data-width="100%" multiple>
                      <option v-for="semester in selectedCreate.editSubject.semesters" :key="semester._id" :value="semester" :data-tokens="semester.facultyName" disabled>
                          {{semester.name + " (" + semester.facultyName + ")"}}
                      </option>
                    </select>
              </div>

            <div class="col-12 mb-4">
              <div class="btn-group">
                <button v-if="selectedCreate.editSubject.theoryHr > 0"
                        @click.prevent="selectedCreate.type = 'theory'"
                        :class="selectedCreate.type == 'theory' ? 'btn btn-primary' : 'btn btn-outline-primary'">Theory</button>
                <button v-if="selectedCreate.editSubject.practiceHr > 0"
                        @click.prevent="selectedCreate.type = 'practice'"
                        :class="selectedCreate.type == 'practice' ? 'btn btn-primary' : 'btn btn-outline-primary'">Practice</button>
                <button v-if="selectedCreate.editSubject.seminarHr > 0"
                        @click.prevent="selectedCreate.type = 'seminar';"
                        :class="selectedCreate.type == 'seminar' ? 'btn btn-primary' : 'btn btn-outline-primary'">Seminar</button>
              </div>
            </div>

            <div id="theoryColEdit" class="col-12 mt-3">
              <label for="theoryProfessors"><b>Theory</b> professor</label>
              <select v-model="selectedCreate.theoryProfessor" 
                      class="__selectpicker" data-live-search="true" data-width="100%">
                  <option v-for="professor in selectedCreate.editSubject.theoryProfessors" :key="professor._id" :value="professor">
                      {{professor.firstName + ' ' + professor.lastName}}
                  </option>
              </select>
            </div>

          <div id="practiceColEdit" class="col-12 mt-3">
              <label for="practiceProfessors"><b>Practice</b> professor</label>
              <select v-model="selectedCreate.practiceProfessor" 
                      class="__selectpicker" data-live-search="true" data-width="100%">
                  <option v-for="professor in selectedCreate.editSubject.practiceProfessors" :key="professor._id" :value="professor">
                      {{professor.firstName + ' ' + professor.lastName}}
                  </option>
                  {{selectedCreate.editSubject.practiceProfessors}}
              </select>
          </div>
          
          <div id="seminarColEdit" class="col-12 mt-3">
              <label for="seminarProfessors"><b>Seminar</b> professor</label>
              <select v-model="selectedCreate.seminarProfessor"  
                      class="__selectpicker" data-live-search="true" data-width="100%">
                  <option v-for="professor in selectedCreate.editSubject.seminarProfessors" :key="professor._id" :value="professor">
                      {{professor.firstName + ' ' + professor.lastName}}
                  </option>
              </select>
          </div>

          <div id="classromCol" class="col-12 mt-4 mb-4">
              <label for="classroom"><b>Classroom</b></label>
              <select v-model="selectedCreate.classroom"
                      class="__selectpicker" data-live-search="true" data-width="100%">
                  <option v-for="classroom in this.classrooms" :key="classroom._id" :value="classroom">
                      {{classroom.name + ' | capacity: ' + classroom.capacity + " | pc: " + ((classroom.hasComputers == true) ? "yes" : "no")}}
                  </option>
              </select>
          </div>

          <div class="col-12">
            <p><b>Start</b> and <b>end</b> time</p>
            <p>
              <vue-timepicker v-model="selectedCreate.time.start_time" placeholder="Start Time" manual-input></vue-timepicker>
              <span class="ml-2 mr-2"> to </span>
              <vue-timepicker v-model="selectedCreate.time.end_time" placeholder="End Time" manual-input></vue-timepicker>
            </p>
          </div>

          </div>
        </form>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        
        <p v-if="selectedCreate.type=='theory' && selectedCreate.editSubject.theoryNeedsComputers" title="Needs computers" style="margin-right:auto;"><i class="fas fa-desktop mr-2" style="font-size:30px;"></i><small>Theory needs computers</small></p>
        <p v-if="selectedCreate.type=='practice' && selectedCreate.editSubject.practiceNeedsComputers" title="Needs computers" style="margin-right:auto;"><i class="fas fa-desktop mr-2" style="font-size:30px;"></i><small>Practice needs computers</small></p>
        <p v-if="selectedCreate.type=='seminar' && selectedCreate.editSubject.seminarNeedsComputers" title="Needs computers" style="margin-right:auto;"><i class="fas fa-desktop mr-2" style="font-size:30px;"></i><small>Seminar needs computers</small></p>
        <button type="button" @click="deleteSchedule" class="btn btn-danger">Delete</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="editSchedule" type="button" class="btn btn-primary">Edit</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import VueTimepicker from 'vue2-timepicker'
export default {
    props: {
        selectedCreate: Object,
        classrooms: Array,
        feedback: String
    },
    
    components: {
        VueTimepicker
    },

    methods: {
        editSchedule(){
            this.$emit('editSchedule')
        },
        deleteSchedule(){
            this.$emit('deleteSchedule')
        }
    },
    computed:{
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

<style scoped>

</style>