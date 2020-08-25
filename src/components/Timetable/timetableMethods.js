import facultyService from '@/services/facultyService'
import semesterService from '@/services/semesterService'
import subjectService from '@/services/subjectService'
import schedulesService from '@/services/schedulesService'
import professorService from '@/services/professorService'
import timetableService from '@/services/timetableService'
import classroomService from '@/services/classroomService'
import { calendarOptions } from './calendarOptions'
import Vue from 'vue'
import moment from 'moment'

const methods = {
    renderSelect(){
        window.$(function () {
            window.$('.__selectpicker').selectpicker('render')
        })
    },

    formatDate(date) {
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return month + '/' + day + '/' + year;
    },

    databaseReadyDate(date){
        return date.toISOString()
    },

    async getTimetables(){
        let timetables = (await timetableService.getTimetables()).filter(el => el.userId == this.user._id)
        .map(el => {
            return {
                _id: el._id,
                name: el.name,
                startDate: new Date(el.startDate),
                endDate: new Date(el.endDate),
                weeks: el.weeks,
                userId: el.userId
            }
        })
        return timetables
    },

    async addTimetable(){
        this.feedback = ''
        let c = this.createTimetable
        if (c.name == '') {
            this.feedback = 'Enter a valid name.'
            return
        }

        let diffTime = c.endDate - c.startDate
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays <= 0) this.feedback = 'End date has to be later than the start date.'
        else {
            let diffWeeks = Math.ceil(diffDays / 7)
            let obj = {
                'name': c.name, 'startDate': c.startDate, 'endDate': c.endDate,
                'weeks': diffWeeks, 'userId': this.user._id
            }
            let dbObj = {
                'name': c.name, 'startDate': this.formatDate(c.startDate), 'endDate': this.formatDate(c.endDate),
                'weeks': diffWeeks, 'userId': this.user._id
            }

            let response = await timetableService.postTimetable(dbObj)
            if (response.status == "success") {
                obj.id = response.id
                this.$router.go(0) //for now just refresh page
                this.timetables.push(obj)
                this.timetables = this.timetables.slice()
                window.$("#addTimetable").modal('hide');
            }
        }
    },

    async updateTimetable() {
        this.feedback = ''
        let c = this.editTimetable
        if (c.name == '') {
            this.feedback = 'Enter a valid name.'
            return
        }
        
        let obj = {'name': c.name, 'startDate': c.startDate, 'endDate': c.endDate,
                   'weeks': c.weeks, 'userId': this.user._id
            }
        let dbObj = {'name': c.name, 'startDate': this.formatDate(c.startDate), 'endDate': this.formatDate(c.endDate),
                     'weeks': c.weeks, 'userId': this.user._id}
            
        let response = await timetableService.updateTimetable(this.editTimetable._id, dbObj)
        if (response.status == 200) {
            obj.id = response.id
            this.$router.go(0) //for now just refresh page
            this.timetables.push(obj)
            this.timetables = this.timetables.slice()
            window.$("#editTimetable").modal('hide');
        }
    },

    async saveSolverTimetableToDB(timetable){
        if (this.solverTimetableSaved[timetable._id]){
            this.feedback = "Timetable is already saved."
            window.$('#timetableFeedback').modal({ show: true })
            return
        }
        let response = await timetableService.postTimetable(timetable).catch(err => this.feedback = err.message)
        if (response.status == "success"){
            this.allSchedules.forEach(async (schedule) => {
                if(schedule.body.timetableId != timetable._id) return
                let responseSchedule = await schedulesService.postSchedule(schedule).catch(err => this.feedback = err.message)
            })
            this.solverTimetableSaved[timetable._id] = true
            this.feedback = `Successfully saved ${timetable.name}.`
        }
        else this.feedback = "Something went wrong."
        window.$('#timetableFeedback').modal({ show: true })
    },

    loadEditTimetableData(timetable){
        this.editTimetable._id = timetable._id
        this.editTimetable.name = timetable.name,
        this.editTimetable.startDate = new Date(timetable.startDate)
        this.editTimetable.endDate = new Date(timetable.endDate)
        this.editTimetable.weeks = timetable.weeks
    },

    changeTimetable(selectedTimetable){
        this.selectedTimetable = selectedTimetable
        this.filterTimetableAllSchedules()
        //this.calendarOptions.scheduleList = this.allSchedules.filter(schedule => schedule.body.timetableId == this.selectedTimetable._id)
    },

    filterTimetableBySemester(){
        this.atFilter = 'semester'
        this.selectedFilter.professor = null
        this.selectedFilter.classroom = null
        let semester = this.selectedFilter.semester
        calendarOptions.scheduleList = this.allSchedules.filter(schedule => (schedule.body.semesterIds.includes(semester._id) && schedule.body.timetableId == this.selectedTimetable._id))
        this.renderSelect()
    },

    filterTimetableByProfessor(){
        this.atFilter = 'professor'
        this.selectedFilter.semester = null
        this.selectedFilter.classroom = null
        let professor = this.selectedFilter.professor
        calendarOptions.scheduleList = this.allSchedules.filter(schedule => schedule.body.professorId == professor._id && schedule.body.timetableId == this.selectedTimetable._id)
        this.renderSelect()
    },
    filterTimetableByClassroom(){
        this.atFilter = 'classroom'
        this.selectedFilter.semester = null
        this.selectedFilter.professor = null
        let classroom = this.selectedFilter.classroom
        calendarOptions.scheduleList = this.allSchedules.filter(schedule => schedule.body.classroomId == classroom._id && schedule.body.timetableId == this.selectedTimetable._id)
        this.renderSelect()
    },

    filterTimetableAllSchedules(){
        this.atFilter = 'all'
        this.selectedFilter.semester = null
        this.selectedFilter.professor = null
        this.selectedFilter.classroom = null
        calendarOptions.scheduleList = this.allSchedules.filter(schedule => schedule.body.timetableId == this.selectedTimetable._id)
        this.renderSelect()
    },

    async beforeCreateSchedule(event) {
        this.feedback = ''
        if (this.selectedCreate.subject.theoryProfessors.length > 0)
            this.selectedCreate.theoryProfessor = this.selectedCreate.subject.theoryProfessors[0]
        if (this.selectedCreate.subject.practiceProfessors.length > 0)
            this.selectedCreate.practiceProfessor = this.selectedCreate.subject.practiceProfessors[0]
        if (this.selectedCreate.subject.seminarProfessors.length > 0)
            this.selectedCreate.seminarProfessor = this.selectedCreate.subject.seminarProfessors[0]
        if (this.classrooms.length > 0 && !this.selectedCreate.classroom) this.selectedCreate.classroom = this.classrooms[0]

        this.selectedCreate.helpFaculties = this.selectedCreate.subject.semesters.map(el => { return { '_id': el.facultyId, 'name': el.facultyName } })
        this.selectedCreate.helpFaculties = [...new Set(this.selectedCreate.helpFaculties)]

        this.selectedCreate.type = 'theory'
        this.updateModal('theory')
        this.selectedCreate.time.dirtyStart = event.start._date
        this.selectedCreate.time.dirtyEnd = event.end._date
        this.selectedCreate.time.start_time.HH = moment(event.start._date).format('HH:mm').slice(0, 2)
        this.selectedCreate.time.start_time.mm = moment(event.start._date).format('HH:mm').slice(3, 5)
        this.selectedCreate.time.end_time.HH = moment(event.end._date).format('HH:mm').slice(0, 2)
        this.selectedCreate.time.end_time.mm = moment(event.end._date).format('HH:mm').slice(3, 5)
        this.renderSelect()
        
        //await new Promise(r => setTimeout(r, 500));
        window.$('#createScheduleModal').modal({ show: true })
    },

    async beforeUpdateSchedule(event){
        let schedule = event.schedule

        let start = (event.changes.start == undefined) ? schedule.start : event.changes.start
        let end = event.changes.end

        let oldStart_hhmm = moment(schedule.start._date).format('HH:mm')
        let oldEnd_hhmm = moment(schedule.end._date).format('HH:mm')
        let newStart_hhmm = moment(start._date).format('HH:mm')
        let newEnd_hhmm = moment(end._date).format('HH:mm')


        event.schedule.start = start
        event.schedule.end = end

        let obj = {
            id: event.schedule.id, calendarId: event.schedule.calendarId, title: event.schedule.title, category: event.schedule.category,
            start: start._date, end: end._date,
            body: event.schedule.body
        }

        let dbObj = {
            start: this.databaseReadyDate(start._date),
            end: this.databaseReadyDate(end._date),
            body: {
                startHHmm: newStart_hhmm, endHHmm: newEnd_hhmm
            }
        }
        let index = calendarOptions.scheduleList.findIndex(el => el.id == schedule.id)
        Vue.set(calendarOptions.scheduleList, index, obj)
        index = this.allSchedules.findIndex(el => el.id == schedule.id)
        this.allSchedules[index] = obj
        let response = await schedulesService.updateSchedule(event.schedule.id, dbObj)
    },

    async clickSchedule(event){
        this.feedback = ''
        this.selectedCreate.id = event.schedule.id
        this.selectedCreate.editSubject = await this.subjects.find(el => el._id == event.schedule.body.subjectId)
        this.selectedCreate.classroom = await this.classrooms.find(el => el._id == event.schedule.body.classroomId)
        let type = event.schedule.body.type
        
        this.selectedCreate.type = ''
        //this.$forceUpdate()
        this.selectedCreate.type = event.schedule.body.type
        
        if (type == 'theory') {
            this.selectedCreate.theoryProfessor = await this.professors.find(el => el._id == event.schedule.body.professorId)
            this.selectedCreate.practiceProfessor = (this.selectedCreate.editSubject.practiceProfessors.length > 0) ? this.selectedCreate.editSubject.practiceProfessors[0] : ''
            this.selectedCreate.seminarProfessor = (this.selectedCreate.editSubject.seminarProfessors.length > 0) ? this.selectedCreate.editSubject.seminarProfessors[0] : ''
        }
        if (type == 'practice') {
            this.selectedCreate.practiceProfessor = await this.professors.find(el => el._id == event.schedule.body.professorId)
            this.selectedCreate.theoryProfessor = (this.selectedCreate.editSubject.theoryProfessors.length > 0) ? this.selectedCreate.editSubject.theoryProfessors[0] : ''
            this.selectedCreate.seminarProfessor = (this.selectedCreate.editSubject.seminarProfessors.length > 0) ? this.selectedCreate.editSubject.seminarProfessors[0] : ''
        }
        if (type == 'seminar') {
            this.selectedCreate.seminarProfessor = await this.professors.find(el => el._id == event.schedule.body.professorId)
            this.selectedCreate.theoryProfessor = (this.selectedCreate.editSubject.theoryProfessors.length > 0) ? this.selectedCreate.editSubject.theoryProfessors[0] : ''
            this.selectedCreate.practiceProfessor = (this.selectedCreate.editSubject.practiceProfessors.length > 0) ? this.selectedCreate.editSubject.practiceProfessors[0] : ''
        }

        this.selectedCreate.time.start_time.HH = moment(event.schedule.start._date).format('HH:mm').slice(0, 2)
        this.selectedCreate.time.start_time.mm = moment(event.schedule.start._date).format('HH:mm').slice(3, 5)
        this.selectedCreate.time.end_time.HH = moment(event.schedule.end._date).format('HH:mm').slice(0, 2)
        this.selectedCreate.time.end_time.mm = moment(event.schedule.end._date).format('HH:mm').slice(3, 5)
        this.selectedCreate.time.dirtyStart = event.schedule.start
        this.selectedCreate.time.dirtyEnd = event.schedule.end
        this.selectedCreate.group = event.schedule.body.group
        this.selectedCreate.initialType = event.schedule.body.type

        this.renderSelect()
        window.$('#editScheduleModal').modal({ show: true })
    },

    validSelectedCreate(){
        let s = this.selectedCreate
        let theoryHrPerWeek = Math.ceil(s.subject.theoryHr / this.selectedTimetable.weeks)
        let practiceHrPerWeek = Math.ceil(s.subject.practiceHr / this.selectedTimetable.weeks)
        let seminarHrPerWeek = Math.ceil(s.subject.seminarHr / this.selectedTimetable.weeks)

        let startHr = this.selectedCreate.time.start_time.HH
        let startMM = this.selectedCreate.time.start_time.mm
        let endHr = this.selectedCreate.time.end_time.HH
        let endMM = this.selectedCreate.time.end_time.mm
        let startInputTime = new Date(Date.now()).setHours(startHr, startMM, 0, 0)
        let endInputTime = new Date(Date.now()).setHours(endHr, endMM, 0, 0)
        let duration = endInputTime - startInputTime

        let durationHr = duration / (1000 * 60 * 60)
        let suggestedTheoryEndTime = moment(new Date(startInputTime + (theoryHrPerWeek * 60 * 60 * 1000))).format('HH:mm')
        let suggestedPracticeEndTime = moment(new Date(startInputTime + (practiceHrPerWeek * 60 * 60 * 1000))).format('HH:mm')
        let suggestedSeminarEndTime = moment(new Date(startInputTime + (seminarHrPerWeek * 60 * 60 * 1000))).format('HH:mm')

        if (durationHr <= 0) this.feedback = `Difference between two hours cannot be ${durationHr}`
        else if (s.type == 'theory' && parseFloat(durationHr) != parseFloat(theoryHrPerWeek)) this.feedback = `Theory requires exactly ${theoryHrPerWeek} hours per week and you selected ${durationHr.toFixed(2)} hour(s). Suggested end time is ${suggestedTheoryEndTime}.`
        else if (s.type == 'practice' && parseFloat(durationHr) != parseFloat(practiceHrPerWeek)) this.feedback = `Practice requires exactly ${practiceHrPerWeek} per week and you selected ${durationHr.toFixed(2)} hour(s). Suggested end time is ${suggestedPracticeEndTime}.`
        else if (s.type == 'seminar' && parseFloat(durationHr) != parseFloat(seminarHrPerWeek)) this.feedback = `Seminar requires exactly ${seminarHrPerWeek} per week and you selected ${durationHr.toFixed(2)} hour(s). Suggested end time is ${suggestedSeminarEndTime}.`
        else if (s.classroom == null) this.feedback = "Please enter a valid classroom."
        else if (s.classroom.capacity < s.subject.numStudents)
            this.feedback = `Classroom capacity (${s.classroom.capacity}) is lesser than subject students (${s.subject.numStudents}).`
        else if (s.type == 'theory' && s.subject.theoryNeedsComputers && !s.classroom.hasComputers)
            this.feedback = "Subject theory needs computers but the classroom doesn't have them."
        else if (s.type == 'practice' && s.subject.practiceNeedsComputers && !s.classroom.hasComputers)
            this.feedback = "Subject practice needs computers but the classroom doesn't have them."
        else if (s.type == 'seminar' && s.subject.seminarNeedsComputers && !s.classsroom.hasComputers)
            this.feedback = "Subject seminar needs computers but the classroom doesn't have them."
        else return true

        return false
    },

    extractVariables(edit = false){
        let extracted = {}
        let s = (edit) ? this.selectedCreate.editSubject : this.selectedCreate.subject

        if (this.selectedCreate.type == 'theory') {
            extracted.duration = Math.ceil(s.theoryHr / this.selectedTimetable.weeks)
            extracted.needsComputers = (s.theoryNeedsComputers) ? true : false
            extracted.professorId = this.selectedCreate.theoryProfessor._id
            extracted.professorFirstName = this.selectedCreate.theoryProfessor.firstName
            extracted.professorLastName = this.selectedCreate.theoryProfessor.lastName
        }
        else if (this.selectedCreate.type == 'practice') {
            extracted.duration = Math.ceil(s.practiceHr / this.selectedTimetable.weeks)
            extracted.needsComputers = (s.practiceNeedsComputers) ? true : false
            extracted.professorId = this.selectedCreate.practiceProfessor._id
            extracted.professorFirstName = this.selectedCreate.practiceProfessor.firstName
            extracted.professorLastName = this.selectedCreate.practiceProfessor.lastName
        }
        else if (this.selectedCreate.type == 'seminar') {
            extracted.duration = Math.ceil(s.seminarHr / this.selectedTimetable.weeks)
            extracted.needsComputers = (s.seminarNeedsComputers) ? true : false
            extracted.professorId = this.selectedCreate.seminarProfessor._id
            extracted.professorFirstName = this.selectedCreate.seminarProfessor.firstName
            extracted.professorLastName = this.selectedCreate.seminarProfessor.lastName
        }

        extracted.classroomId = this.selectedCreate.classroom._id
        extracted.classroomName = this.selectedCreate.classroom.name
        extracted.semesterIds = s.semesters.map(el => el._id)
        extracted.type = this.selectedCreate.type

        let startHr = this.selectedCreate.time.start_time.HH
        let startMM = this.selectedCreate.time.start_time.mm
        let endHr = this.selectedCreate.time.end_time.HH
        let endMM = this.selectedCreate.time.end_time.mm
        let startDate = new Date((new Date(this.selectedCreate.time.dirtyStart)).setHours(startHr, startMM, 0, 0))
        let endDate = new Date((new Date(this.selectedCreate.time.dirtyEnd)).setHours(endHr, endMM, 0, 0))

        extracted.start = startDate.toISOString()
        extracted.end = endDate.toISOString()
        extracted.startHHmm = moment(startDate).format('HH:mm')
        extracted.endHHmm = moment(endDate).format('HH:mm')

        let scheduleGroups = calendarOptions.scheduleList.filter(x => (x.body.type == this.selectedCreate.type && x.title == s.name))
        scheduleGroups.sort((a, b) => a.body.group - b.body.group)
        let hole = -1
        for (let i = 0; i < scheduleGroups.length; i++) {
            if (edit && i == this.selectedCreate.group) continue
            if (i + 1 != scheduleGroups[i].body.group) {
                hole = i + 1
                break
            }
        }
        extracted.group = (hole == -1) ? scheduleGroups.length + 1 : hole
        return extracted
    },

    async createSchedule(){
        if (!this.validSelectedCreate()) return

        let s = this.selectedCreate.subject
        let extracted = this.extractVariables()

        let dbObj = {
            calendarId: '1', title: s.name, category: 'time',
            start: extracted.start, end: extracted.end,
            body: {
                name: s.name,
                type: extracted.type,
                group: extracted.group,
                duration: extracted.duration,
                mandatory: s.mandatory,
                needsComputers: extracted.needsComputers,
                numStudents: s.numStudents,
                classroomName: extracted.classroomName,
                professorFirstName: extracted.professorFirstName,
                professorLastName: extracted.professorLastName,
                startHHmm: extracted.startHHmm,
                endHHmm: extracted.endHHmm,
                professorId: extracted.professorId,
                classroomId: extracted.classroomId,
                subjectId: s._id,
                semesterIds: extracted.semesterIds,
                timetableId: this.selectedTimetable._id,
                userId: this.user._id
            }

        }

        let response = await schedulesService.postSchedule(dbObj)
        if (response.status == "success") {
            dbObj.id = response.id
            calendarOptions.scheduleList.push(dbObj)
            this.allSchedules.push(dbObj)
            window.$("#createScheduleModal").modal('hide');
        }
    },

    async editSchedule() {
        if (!this.validSelectedCreate()) return

        let s = this.selectedCreate.editSubject
        let extracted = this.extractVariables(true)

        let dbObj = {
            calendarId: '1', title: s.name, category: 'time',
            start: extracted.start, end: extracted.end,
            body: {
                name: s.name,
                type: extracted.type,
                group: extracted.group,
                duration: extracted.duration,
                mandatory: s.mandatory,
                needsComputers: extracted.needsComputers,
                numStudents: s.numStudents,
                classroomName: extracted.classroomName,
                professorFirstName: extracted.professorFirstName,
                professorLastName: extracted.professorLastName,
                startHHmm: extracted.startHHmm,
                endHHmm: extracted.endHHmm,
                professorId: extracted.professorId,
                classroomId: extracted.classroomId,
                subjectId: s._id,
                semesterIds: extracted.semesterIds,
                timetableId: this.selectedTimetable._id,
                userId: this.user._id
            }
        }
        let index = calendarOptions.scheduleList.findIndex(el => el.id == this.selectedCreate.id)
        let response = await schedulesService.replaceSchedule(this.selectedCreate.id, dbObj)
        if (response.status == "success") {
            dbObj.id = this.selectedCreate.id
            Vue.set(calendarOptions.scheduleList, index, dbObj)
            this.allSchedules[index] = dbObj
            window.$("#editScheduleModal").modal('hide');
        }
    },

    async deleteSchedule() {
        let index = calendarOptions.scheduleList.findIndex(el => el.id == this.selectedCreate.id)
        let id = calendarOptions.scheduleList[index].id
        let response = await schedulesService.deleteSchedule(id)
        calendarOptions.scheduleList.splice(index, 1)

        let indexAll = this.allSchedules.findIndex(el => el.id == this.selectedCreate.id)
        this.allSchedules.splice(indexAll, 1)
        window.$("#editScheduleModal").modal('hide');
    },

    lastMondayDate(date) {
        //let date_ = new Date(date.valueOf())
        let day = date.getDay()
        if (day == 0) date.setDate(date.getDate() - 6)
        else date.setDate(date.getDate() - (day - 1))
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    },

    prepareData(){
        for (let i in this.faculties) {
            let faculty = this.faculties[i]
            this.facultyIdToSemesters[faculty._id] = []
            for (let j in this.semesters) {
                let semester = this.semesters[j]
                if (faculty._id == semester.facultyId) {
                    this.facultyIdToSemesters[faculty._id].push(semester)
                    semester.facultyName = faculty.name;
                }
            }
        }
        for (let i in this.professors) {
            let professor = this.professors[i]
            this.professoridToProfessorObj[professor._id] = professor
        }
        for (let i in this.semesters) {
            let semester = this.semesters[i]
            this.semesterIdToSemesterObj[semester._id] = semester
        }
    },

    async getSubjects(){
        let subjects = (await subjectService.getSubjects()).filter(el => el.userId == this.user._id)
        subjects = subjects.map(s => {
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
                userId: s.userId
            }
        })
        this.winterSubjects = subjects.filter(s => s.semesters.some(sem => sem.season == 'winter'))
        this.summerSubjects = subjects.filter(s => s.semesters.some(sem => sem.season == 'summer'))

        return subjects
    },

    async getSchedules(){
        let schedules = (await schedulesService.getSchedules()).filter(el => el.body.userId == this.user._id)
            .map(el => {
                el.id = el._id
                let now = new Date(Date.now())
                let scheduled = new Date(el.start)
                if (this.lastMondayDate(now) != this.lastMondayDate(scheduled)) {
                    let diffTime = Math.abs(now - scheduled);
                    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    let numOfWeeks = Math.floor(diffDays / 7)

                    let startDate = new Date(el.start)
                    let endDate = new Date(el.end)
                    if (now > scheduled) {
                        startDate.setDate(startDate.getDate() + (7 * numOfWeeks))
                        endDate.setDate(endDate.getDate() + (7 * numOfWeeks))
                    }
                    else {
                        startDate.setDate(startDate.getDate() - (7 * numOfWeeks))
                        endDate.setDate(endDate.getDate() - (7 * numOfWeeks))
                    }
                    el.start = startDate.toISOString()
                    el.end = endDate.toISOString()
                }
                return el
            })
        calendarOptions.scheduleList = this.allSchedules.filter(el => { if (this.timetables.length > 0) return (el.body.timetableId == this.timetables[0]._id) })
        return schedules
    },

    async getFaculties(){
        let faculties = (await facultyService.getFaculties()).filter(el => el.userId == this.user._id)
        return faculties
    },

    async getSemesters(){
        let semesters = (await semesterService.getSemesters()).filter(el => el.userId == this.user._id)
        return semesters
    },

    async getProfessors(){
        let professors = (await professorService.getProfessors()).filter(el => el.userId == this.user._id)
        return professors
    },

    async getClassrooms(){
        let classrooms = (await classroomService.getClassrooms()).filter(el => el.userId == this.user._id)
        return classrooms
    },

    async adjustDatepickerStyle() {
        window.$(function () {
            window.$('#startDatepicker').addClass('form-control')
            window.$('#startDatepicker').css('background-color', 'white')
            window.$('#endDatepicker').addClass('form-control')
            window.$('#endDatepicker').css('background-color', 'white')
        })
    },

    async adjustEditDatepickerStyle() {
        window.$(function () {
            window.$('#startDatepickerEdit').addClass('form-control')
            window.$('#startDatepickerEdit').css('background-color', 'white')
            window.$('#endDatepickerEdit').addClass('form-control')
            window.$('#endDatepickerEdit').css('background-color', 'white')
        })
    },

    loadStyling(){
        window.$(this.$refs.createScheduleModal).on("hide.bs.modal", () => { this.selectedCreate.type = ''; })
        window.$(this.$refs.editScheduleModal).on("hide.bs.modal", () => { this.selectedCreate.type = ''; })
        window.$(document).ready(() => {
            window.$('.__selectpicker').selectpicker();
            if (this.timetables.length > 0 && this.selectedTimetable == null) this.selectedTimetable = this.timetables[0]
            if (this.subjects.length > 0 && this.selectedCreate.subject == null) this.selectedCreate.subject = this.subjects[0]
            this.selectedCreate.editSubject = this.selectedCreate.subject
            this.loaded = true
            this.renderSelect()
        })
    },
    updateModal(newValue) {
        if (newValue == 'theory') {
            document.getElementById('theoryCol').style.display = "block";
            document.getElementById('practiceCol').style.display = "none";
            document.getElementById('seminarCol').style.display = "none";
            if (this.selectedCreate.editSubject != null) {
                document.getElementById('theoryColEdit').style.display = "block";
                document.getElementById('practiceColEdit').style.display = "none";
                document.getElementById('seminarColEdit').style.display = "none";
            }
        }
        else if (newValue == 'practice') {
            document.getElementById('theoryCol').style.display = "none";
            document.getElementById('practiceCol').style.display = "block";
            document.getElementById('seminarCol').style.display = "none";
            if (this.selectedCreate.editSubject != null) {
                document.getElementById('theoryColEdit').style.display = "none";
                document.getElementById('practiceColEdit').style.display = "block";
                document.getElementById('seminarColEdit').style.display = "none";
            }
        }
        else if (newValue == 'seminar') {
            document.getElementById('theoryCol').style.display = "none";
            document.getElementById('practiceCol').style.display = "none";
            document.getElementById('seminarCol').style.display = "block";
            if (this.selectedCreate.editSubject != null) {
                document.getElementById('theoryColEdit').style.display = "none";
                document.getElementById('practiceColEdit').style.display = "none";
                document.getElementById('seminarColEdit').style.display = "block";
            }
        }
    },

    selectedTimetableChanged(selectedTimetable){
        this.selectedTimetable = selectedTimetable
    },
    selectedCreateChanged(selectedCreate){
        this.selectedCreate = selectedCreate
    },
    selectedFilterChanged(selectedFilter){
        this.selectedFilter = selectedFilter
    },
    timetablesChanged(timetables){
        this.timetables = timetables
    }
}

export default methods