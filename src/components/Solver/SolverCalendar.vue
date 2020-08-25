<template>
<div class="container-fluid">
    <Timetable v-if="loaded" :propTimetables="timetableObjs" :propAllSchedules="allSchedules"/>
</div>
</template>

<script>
import solverService from '@/services/solverService'
import {hours, getRealDate} from '@/common/teachingHours'
import Timetable from '@/components/Timetable/Timetable.vue'
export default {
    props:{
        propData: Object
    },
    components: {
        Timetable
    },
    data(){
        return {
            timetables: [],
            
            timetableObjs: [],
            allSchedules: [],
            loaded: false
        }
    },
    methods: {
        mongoObjectId () {
            var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
            return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {return (Math.random() * 16 | 0).toString(16);}).toLowerCase();
        }
    },
    async mounted(){
        this.timetables = this.propData.finalTimetables.timetables
        this.oldPropData = this.propData.oldPropData
        let userId = this.propData.finalTimetables.userId
        let solverId = this.propData.finalTimetables.solverId
        let startDate = "10/05/2020"
        let endDate = "01/29/2021"
        let weeks = this.oldPropData.weeks
        
        for(let i=0; i<this.timetables.length; i++){
            let timetable_id = this.mongoObjectId()
            let name = this.timetables[i].grade.best
            this.timetableObjs.push({
                "_id": timetable_id,
                "name": name,
                "startDate": startDate,
                "endDate": endDate,
                "weeks": weeks,
                "userId": userId,
                "solverId": solverId 
            })

            this.timetables[i].timetable = this.timetables[i].timetable.map(el => {
                let realDates = getRealDate(el.time.day, el.time.hour, el.schedule.duration)
                return {
                    "id": this.mongoObjectId(),//el.schedule._id,
                    "calendarId": 1,
                    "title": el.schedule.name,
                    "category": "time",
                    "start": realDates.start,
                    "end": realDates.end,
                    "body": {
                        "name": el.schedule.name,
                        "type": el.schedule.type,
                        "group": el.schedule.group,
                        "mandatory": el.schedule.mandatory,
                        "needsComputers": el.schedule.needsComputers,
                        "numStudents": el.schedule.numStudents,
                        "classroomName": el.schedule.classroomName,
                        "professorFirstName": el.schedule.professorFirstName,
                        "professorLastName": el.schedule.professorLastName,
                        "startHHmm": hours[el.time.hour]["startHHmm"],
                        "endHHmm": hours[el.time.hour + el.schedule.duration - 1]["endHHmm"],
                        "professorId": el.schedule.professorId,
                        "classroomId": el.schedule.classroomId,
                        "subjectId": el.schedule.subjectId,
                        "semesterIds": el.schedule.semesterIds,
                        "timetableId": timetable_id,
                        'userId': el.schedule.userId,
                        "solverId": el.schedule.solverId,
                    }
                }
            })
            this.allSchedules = this.allSchedules.concat(this.timetables[i].timetable)
        }
        this.loaded = true

    }
}
</script>

<style lang="scss" scoped>

</style>