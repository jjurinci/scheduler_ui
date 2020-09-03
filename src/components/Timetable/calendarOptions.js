import moment from 'moment'

const calendarOptions = {
    calendarList: [
        {
            id: '1',
            name: 'Schedule calendar'
        }
    ],
    scheduleList: [],
    view: 'week',
    taskView: false,
    scheduleView: ['time'],
    theme: {
    },
    week: {
        daynames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        workweek: true,
        startDayOfWeek: 1,
        hourStart: 8,
        hourEnd: 22
    },
    disableDblClick: true,
    isReadOnly: false,
    template: {
        weekDayname: function (model) {
            return '&nbsp;&nbsp;<span class="tui-full-calendar-dayname-name" style="font-size:20px;">' + model.dayName + '</span>';
        },
        time: function (schedule) {
            let mandatory_str = "*"
            if (schedule.body.mandatory) mandatory_str = ""
            /*return '<strong>' + moment(schedule.start._date).format('HH:mm') + '</strong> ' +
                '- <strong>' + moment(schedule.end._date).format('HH:mm') + '</strong> <br/>' +
                schedule.title + " " + "(" + schedule.body.type + "-" + schedule.body.group + ") " + mandatory_str + "<br/>" + 
                schedule.body.classroomName + "<br/>" + schedule.body.professorFirstName + " " + schedule.body.professorLastName;*/

            let letter = (schedule.body.type == 'theory') ? 'T' : (schedule.body.type == 'practice') ? 'P' : 'S'
            return schedule.title + " (" + letter + '-' + schedule.body.group + ")" + mandatory_str + "<br>" + schedule.body.classroomName
        },
        popupDetailDate: function (isAllDay, start, end) {
            return (moment(start.getTime()).format('HH:mm') + ' - ' + moment(end.getTime()).format('HH:mm'));
        },
        popupDetailBody: function (schedule) {
            return schedule.body.classroomName + "<br/>" + schedule.body.professorFirstName + " " + schedule.body.professorLastName;
        },

    },
    useCreationPopup: false,
    useDetailPopup: false,
}

export {calendarOptions}