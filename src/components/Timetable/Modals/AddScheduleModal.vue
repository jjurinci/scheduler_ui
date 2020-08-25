<template>
<div class="modal" ref="createScheduleModal" id="createScheduleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Create schedule</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form v-if="selectedCreate.subject" :key="selectedCreate.subject._id">
          <div class="row">
            <div class="col-12 mb-4">
              <label for="predmet">Name</label>
              <input v-model="selectedCreate.subject.name" type="text" class="form-control" id="predmet" disabled style="cursor: not-allowed;">
            </div>

            <div id="semCol" class="col-12 mb-4">
                    <label for="allSemesters">Semesters</label>
                    <select v-model="selectedCreate.subject.semesters" class="__selectpicker" data-live-search="true" data-width="100%" multiple>
                      <option v-for="semester in selectedCreate.subject.semesters" :key="semester._id" :value="semester" :data-tokens="semester.facultyName" disabled>
                          {{semester.name + " (" + semester.facultyName + ")"}}
                      </option>
                    </select>
              </div>

            <div class="col-12 mb-4">
              <div class="btn-group">
                <button v-if="selectedCreate.subject.theoryHr > 0"
                        @click.prevent="selectedCreate.type = 'theory'"
                        :class="selectedCreate.type == 'theory' ? 'btn btn-primary' : 'btn btn-outline-primary'">Theory</button>
                <button v-if="selectedCreate.subject.practiceHr > 0"
                        @click.prevent="selectedCreate.type = 'practice'"
                        :class="selectedCreate.type == 'practice' ? 'btn btn-primary' : 'btn btn-outline-primary'">Practice</button>
                <button v-if="selectedCreate.subject.seminarHr > 0"
                        @click.prevent="selectedCreate.type = 'seminar';"
                        :class="selectedCreate.type == 'seminar' ? 'btn btn-primary' : 'btn btn-outline-primary'">Seminar</button>
              </div>
            </div>

            <div id="theoryCol" class="col-12 mt-3">
              <label for="theoryProfessors"><b>Theory</b> professor</label>
              <select v-model="selectedCreate.theoryProfessor" 
                      class="__selectpicker" data-live-search="true" data-width="100%">
                  <option v-for="professor in selectedCreate.subject.theoryProfessors" :key="professor._id" :value="professor">
                      {{professor.firstName + ' ' + professor.lastName}}
                  </option>
              </select>
            </div>

          <div id="practiceCol" class="col-12 mt-3">
              <label for="practiceProfessors"><b>Practice</b> professor</label>
              <select v-model="selectedCreate.practiceProfessor" 
                      class="__selectpicker" data-live-search="true" data-width="100%">
                  <option v-for="professor in selectedCreate.subject.practiceProfessors" :key="professor._id" :value="professor">
                      {{professor.firstName + ' ' + professor.lastName}}
                  </option>
                  {{selectedCreate.subject.practiceProfessors}}
              </select>
          </div>
          
          <div id="seminarCol" class="col-12 mt-3">
              <label for="seminarProfessors"><b>Seminar</b> professor</label>
              <select v-model="selectedCreate.seminarProfessor"  
                      class="__selectpicker" data-live-search="true" data-width="100%">
                  <option v-for="professor in selectedCreate.subject.seminarProfessors" :key="professor._id" :value="professor">
                      {{professor.firstName + ' ' + professor.lastName}}
                  </option>
              </select>
          </div>

          <div id="classromCol" class="col-12 mt-4 mb-4">
              <label for="classroom"><b>Classroom</b></label>
              <select v-model="selectedCreate.classroom"
                      class="__selectpicker" data-live-search="true" data-width="100%">
                  <option v-for="classroom in sortedClassrooms" :key="classroom._id" :value="classroom">
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
        
        <p v-if="selectedCreate.type=='theory' && selectedCreate.subject.theoryNeedsComputers" title="Needs computers" style="margin-right:auto;"><i class="fas fa-desktop mr-2" style="font-size:30px;"></i><small>Theory needs computers</small></p>
        <p v-if="selectedCreate.type=='practice' && selectedCreate.subject.practiceNeedsComputers" title="Needs computers" style="margin-right:auto;"><i class="fas fa-desktop mr-2" style="font-size:30px;"></i><small>Practice needs computers</small></p>
        <p v-if="selectedCreate.type=='seminar' && selectedCreate.subject.seminarNeedsComputers" title="Needs computers" style="margin-right:auto;"><i class="fas fa-desktop mr-2" style="font-size:30px;"></i><small>Seminar needs computers</small></p>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="createSchedule" type="button" class="btn btn-primary">Create</button>
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
        feedback: String,
    },
    components: {
        VueTimepicker,
    },
    methods: {
        createSchedule(){
            this.$emit('createSchedule')
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