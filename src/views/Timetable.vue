<template>
<div class="container-fluid">
  <h1>Timetable</h1>
      <calendar style="height: 800px;"
        ref="theCalendar"
        :calendars="calendarList"
        :schedules="scheduleList"
        :view="view"
        :taskView="taskView"
        :scheduleView="scheduleView"
        :theme="theme"
        :week="week"
        :disableDblClick="disableDblClick"
        :isReadOnly="isReadOnly"
        :template="template"
        :useCreationPopup="useCreationPopup"
        :useDetailPopup="useDetailPopup"
        @beforeCreateSchedule="beforeCreateSchedule"
        @clickSchedule="clickSchedule"
        @beforeUpdateSchedule="beforeUpdateSchedule" 
    />

<!-- Modal -->
<div class="modal" id="createScheduleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Create schedule</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="predmet">Ime predmeta</label>
            <input v-model="createObject.imePredmeta" type="text" class="form-control" id="predmet">
          </div>
          <div class="form-group">
            <label for="nastavnik">Ime nastavnika</label>
            <input v-model="createObject.imeNastavnika" type="text" class="form-control" id="nastavnik">
          </div>
          <div class="form-group">
            <label for="dvorana">Dvorana</label>
            <input v-model="createObject.dvorana" type="text" class="form-control" id="dvorana">
          </div>
        </form>
        <p>Početno vrijeme: <b>{{createObject.pocetnoVrijeme}}</b></p>
        <p>Završno vrijeme: <b>{{createObject.zavrsnoVrijeme}}</b></p>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="createSchedule" type="button" class="btn btn-primary">Create</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal -->
<div class="modal" id="editScheduleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Edit schedule</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="predmet">Ime predmeta</label>
            <input v-model="createObject.imePredmeta" type="text" class="form-control" id="predmet">
          </div>
          <div class="form-group">
            <label for="nastavnik">Ime nastavnika</label>
            <input v-model="createObject.imeNastavnika" type="text" class="form-control" id="nastavnik">
          </div>
          <div class="form-group">
            <label for="dvorana">Dvorana</label>
            <input v-model="createObject.dvorana" type="text" class="form-control" id="dvorana">
          </div>
        </form>
        <p>Početno vrijeme: <b>{{createObject.pocetnoVrijeme}}</b></p>
        <p>Završno vrijeme: <b>{{createObject.zavrsnoVrijeme}}</b></p>
        <p style="color: red;">{{feedback}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
        <button @click="deleteSchedule" type="button" class="btn btn-danger">Delete</button>
        <button @click="editSchedule" type="button" class="btn btn-primary">Edit</button>
      </div>
    </div>
  </div>
</div>

</div>
</template>

<script>
import $ from 'jquery';
import Vue from 'vue';
import moment from 'moment';
import { Calendar } from '@toast-ui/vue-calendar';
import schedulesService from '@/services/schedulesService'
import 'tui-calendar/dist/tui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

export default {
  name: 'Solver',
  components: {
    calendar: Calendar,
  },
    data() {
        return {
            calendarList: [
                {
                    id: '0',
                    name: 'home'
                },
                {
                    id: '1',
                    name: 'office'
                }
            ],
            scheduleList: [],
            view: 'week',
            taskView: false,
            scheduleView: ['time'],
            theme: {
                },
            week: {
                daynames: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                workweek: true,
                startDayOfWeek: 1,
                hourStart: 8,
                hourEnd: 22
            },
            disableDblClick: true,
            isReadOnly: false,
            template: {
                weekDayname: function(model) {
                  return '&nbsp;&nbsp;<span class="tui-full-calendar-dayname-name" style="font-size:20px;">' + model.dayName + '</span>';
                },
                time: function(schedule) {
                    return '<strong>' + moment(schedule.start.getTime()).format('HH:mm') + '</strong> ' +
                           '- <strong>' + moment(schedule.end.getTime()).format('HH:mm') + '</strong> <br/>' +
                           schedule.title + " " + schedule.body.dvorana + "<br/>" + 
                           schedule.body.id_nastavnika;
                },
                popupDetailDate: function(isAllDay, start, end) {
                    return (moment(start.getTime()).format('HH:mm') + ' - ' + moment(end.getTime()).format('HH:mm'));
                },
                popupDetailBody: function(schedule) {
                  return schedule.body.dvorana + "<br/>" + schedule.body.id_nastavnika;
                },
                
            },
            useCreationPopup: false,
            useDetailPopup: false,

            createObject: {
              id: '',
              imePredmeta: '',
              imeNastavnika: '',
              dvorana: '',
              startDirty: '',
              endDirty: '',
              pocetnoVrijeme: '',
              zavrsnoVrijeme: ''
            },
            feedback: ''
        }
    },
    methods: {
      resetCreateObject(){
        this.feedback = ''
        this.createObject = {
              id: '',
              imePredmeta: '',
              imeNastavnika: '',
              dvorana: '',
              startDirty: '',
              endDirty: '',
              pocetnoVrijeme: '',
              zavrsnoVrijeme: ''
          }
      },
      async beforeCreateSchedule(event){
        this.resetCreateObject()
        this.createObject.pocetnoVrijeme = moment(event.start._date).format('HH:mm')
        this.createObject.zavrsnoVrijeme = moment(event.end._date).format('HH:mm')
        this.createObject.startDirty = event.start
        this.createObject.endDirty = event.end
          
        await new Promise(r => setTimeout(r, 500));
        window.$('#createScheduleModal').modal({show: true})
      },
      async beforeUpdateSchedule(event){
        let schedule = event.schedule
        let start = (event.changes.start == undefined) ? schedule.start : event.changes.start
        let end = event.changes.end
        
        let oldStart_hhmm = moment(schedule.start._date).format('HH:mm')
        let oldEnd_hhmm = moment(schedule.end._date).format('HH:mm')
        let newStart_hhmm = moment(start._date).format('HH:mm')
        let newEnd_hhmm = moment(end._date).format('HH:mm')
        
        let index = this.scheduleList.findIndex(el => {
          let oldstart = el.start
          let oldend = el.end
          if (typeof oldstart == 'string') oldstart = moment(oldstart).format('HH:mm')
          else oldstart = moment(oldstart._date).format('HH:mm')
          if (typeof oldend == 'string') oldend = moment(oldend).format('HH:mm')
          else oldend = moment(oldend._date).format('HH:mm')
          
          return el.id == schedule.id && el.calendarId == schedule.calendarId &&
                 el.title == schedule.title && el.category == schedule.category &&
                 oldStart_hhmm == oldstart && oldEnd_hhmm == oldend &&
                 el.body.id_nastavnika == schedule.body.id_nastavnika &&
                 el.body.dvorana == schedule.body.dvorana
        })
        event.schedule.start = start
        event.schedule.end = end

        let dbObj = {_id: event.schedule.id, courseName: event.schedule.title,
                     classroomName: event.schedule.body.dvorana,
                     professorName: event.schedule.body.id_nastavnika, startDirty: start,
                     endDirty: end, startClean: newStart_hhmm, endClean: newEnd_hhmm}
        
        Vue.set(this.scheduleList, index, event.schedule)
        let response = await schedulesService.updateSchedule(dbObj._id, dbObj)
      },

      async clickSchedule(event){
        this.resetCreateObject()
        
        this.createObject.id = event.schedule.id
        this.createObject.pocetnoVrijeme = moment(event.schedule.start._date).format('HH:mm')
        this.createObject.zavrsnoVrijeme = moment(event.schedule.end._date).format('HH:mm')
        this.createObject.startDirty = event.schedule.start
        this.createObject.endDirty = event.schedule.end
        this.createObject.imePredmeta = event.schedule.title
        this.createObject.imeNastavnika = event.schedule.body.id_nastavnika
        this.createObject.dvorana = event.schedule.body.dvorana
        
        await new Promise(r => setTimeout(r, 500));
        window.$('#editScheduleModal').modal({show: true})
      },

      async createSchedule(){
        if (this.createObject.imePredmeta != '' && this.createObject.imeNastavnika != '' && this.createObject.dvorana != ''){
          let obj = {calendarId: '1', title: this.createObject.imePredmeta, category:'time',
                 start: this.createObject.startDirty, end: this.createObject.endDirty,
                 body: {dvorana: this.createObject.dvorana,id_nastavnika:this.createObject.imeNastavnika}}
          
          let dbObj = {courseName: this.createObject.imePredmeta, classroomName: this.createObject.dvorana,
                       professorName: this.createObject.imeNastavnika, startDirty: this.createObject.startDirty,
                       endDirty: this.createObject.endDirty,
                       startClean: moment(this.createObject.startDirty._date).format('HH:mm'),
                       endClean: moment(this.createObject.endDirty._date).format('HH:mm')}
          
          let response = await schedulesService.postSchedule(dbObj)
          if (response.status == "success"){
            obj.id = response.id
            this.scheduleList.push(obj)
            window.$("#createScheduleModal").modal('hide');
          }
        }
        else this.feedback = 'Unesite sva polja.'
      },
      async editSchedule(){
        if (this.createObject.imePredmeta != '' && this.createObject.imeNastavnika != '' && this.createObject.dvorana != ''){
          let obj = {id: this.createObject.id, calendarId: '1', title: this.createObject.imePredmeta, category:'time',
                 start: this.createObject.startDirty, end: this.createObject.endDirty,
                 body: {dvorana: this.createObject.dvorana,id_nastavnika:this.createObject.imeNastavnika}}
          
          let dbObj = {courseName: this.createObject.imePredmeta, classroomName: this.createObject.dvorana,
              professorName: this.createObject.imeNastavnika, startDirty: this.createObject.startDirty,
              endDirty: this.createObject.endDirty,
              startClean: moment(this.createObject.startDirty._date).format('HH:mm'),
              endClean: moment(this.createObject.endDirty._date).format('HH:mm')}
            
          let index = this.scheduleList.findIndex(el => el.id == this.createObject.id)
          let id = this.scheduleList[index].id
          let response = await schedulesService.updateSchedule(id, dbObj)
          if (response.status == "success"){
            Vue.set(this.scheduleList, index, obj)
            window.$("#editScheduleModal").modal('hide');
          }
        }
        else this.feedback = 'Unesite sva polja.'
      },
      async deleteSchedule(){
        if (this.createObject.imePredmeta != '' && this.createObject.imeNastavnika != '' && this.createObject.dvorana != ''){
          let obj = {calendarId: '1', title: this.createObject.imePredmeta, category:'time',
                 start: this.createObject.startDirty, end: this.createObject.endDirty,
                 body: {dvorana: this.createObject.dvorana,id_nastavnika:this.createObject.imeNastavnika}}
          
          let index = this.scheduleList.findIndex(el => el.id == this.createObject.id)
          let id = this.scheduleList[index].id
          let response = await schedulesService.deleteSchedule(id)
          this.scheduleList.splice(index,1)
          window.$("#editScheduleModal").modal('hide');
        }
        else this.feedback = 'Unesite sva polja.'
      }
    },
    async mounted(){
      let schedules = await schedulesService.getSchedules()
      schedules = schedules.filter(el => el.startDirty != null && el.endDirty != null)
      schedules = schedules.map(el => {
        return {
          id: el._id,
          calendarId: '1',
          title: el.courseName,
          category: 'time',
          start: el.startDirty._date,
          end: el.endDirty._date,
          body: {
            dvorana: el.classroomName,
            id_nastavnika: el.professorName
          }
      }})
      this.scheduleList = schedules
    }
}
</script>

<style lang="scss">
.tui-full-calendar-dayname{
  text-align:center;
}
.tui-full-calendar-dayname-name{
  color: black !important;
}
.tui-full-calendar-timegrid-hour{
  font-size:16px;
  color: #333 !important;
 }

.tui-full-calendar-timegrid-hour span{
  display:block !important;
  padding-top: 25px;
}

.tui-full-calendar-timegrid-hourmarker-time{
  font-size:15px !important;
}
.tui-full-calendar-dayname-container{
  overflow-y: unset;
  border-left: 1px solid rgb(229, 229, 229);
  border-right: 1px solid rgb(229, 229, 229);
}
.tui-full-calendar-timegrid-container{
  overflow-y: unset;
}
.tui-full-calendar-timegrid-right{
  border: 1px solid rgb(229, 229, 229);
  border-top: unset;
}

.tui-full-calendar-timegrid-timezone{
  //padding-top:25px;
  //border: unset !important;
  border-left: 1px solid rgb(229, 229, 229);
  border-bottom: 1px solid rgb(229, 229, 229);
  border-right: unset;
  border-top: unset;
}

.tui-full-calendar-time-date-schedule-block-wrap{
  margin-right:0px !important;
}
.tui-full-calendar-time-guide-creation{
  width:100%;
}

.tui-full-calendar-timegrid-hourmarker-line-left,
.tui-full-calendar-timegrid-hourmarker-time {
  display: none !important;
}

.modal-backdrop {
   background-color: lightgray;
}
</style>