import { calendarOptions } from './calendarOptions'
const data = {
        allSchedules: [],
        calendarOptions,
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
        feedback: '',

        /* */
        user: null,
        faculties: [],
        semesters: [],
        professors: [],
        subjects: [],
        classrooms: [],
        facultyIdToSemesters: {},
        professoridToProfessorObj: {},
        semesterIdToSemesterObj: {},
        summerSubjects: [],
        winterSubjects: [],

        createTimetable: {
            name: '',
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now())
        },
        editTimetable: {
            name: '',
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now())
        },
        timetables: [],
        solverTimetableSaved: {},

        selectedTimetable: null,
        selectedFilter: {
            semester: null,
            professor: null,
            classroom: null
        },
        edit: false,
        selectedCreate: {
            id: '',
            subject: null,
            editSubject: null,
            classroom: null,
            theoryProfessor: null,
            practiceProfessor: null,
            seminarProfessor: null,
            type: '',
            initialType: '',
            group: 1,
            time: {
                start_time: { HH: '08', mm: '00' },
                end_time: { HH: '09', mm: '00' },
                dirtyStart: null,
                dirtyEnd: null
            },
            helpFaculties: []
        },
        atFilter: 'all',
        loaded: false
    }

export default data