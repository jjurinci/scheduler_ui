<template>
<div class="modal fade" id="editTimetable" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Edit timetable</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="timetableName">Name</label>
            <input v-model="editTimetable.name" type="text" class="form-control" id="timetableName" placeholder="Winter 2019/2020"/>
          </div>
          <p style="color: red;" class="mt-4">{{feedback}}</p>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button @click="updateTimetable" type="button" class="btn btn-primary">Edit</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
export default {
    props: {
        editTimetable: Object,
        feedback: String,
    },
    components: {
        Datepicker
    },
    methods: {
        updateTimetable(){
            this.$emit('updateTimetable')
        }
    }
}
</script>

<style scoped>

</style>