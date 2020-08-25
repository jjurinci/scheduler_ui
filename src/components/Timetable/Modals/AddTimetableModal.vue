<template>
<div class="modal fade" id="addTimetable" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Create timetable</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="timetableName">Name</label>
            <input v-model="createTimetable.name" type="text" class="form-control" id="timetableName" placeholder="Winter 2019/2020"/>
          </div>
          
          <div class="form-group">
            <label for="timetableName">Start date</label>
            <datepicker v-model="createTimetable.startDate" id="startDatepicker" style="background-color:white;"></datepicker>
            <small>Start date of a year's semester</small>
          </div>
          
          <div class="form-group">
            <label for="timetableName">End date</label>
            <datepicker v-model="createTimetable.endDate" id="endDatepicker"></datepicker>
            <small>End date of a year's semester</small>
          </div>
          <p style="color: red;" class="mt-4">{{feedback}}</p>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button @click="addTimetable" type="button" class="btn btn-primary">Create</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
export default {
    props: {
        createTimetable: Object,
        feedback: String,
    },
    components: {
        Datepicker
    },
    methods: {
        addTimetable(){
            this.$emit('addTimetable')
        }
    }
}
</script>

<style scoped>

</style>