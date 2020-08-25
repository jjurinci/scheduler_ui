export let hours = {
    0: {"startHHmm":'08:00', "endHHmm": "08:45", "start": {"hh":8, "mm":0}, "end": {"hh":8, "mm":45}},
    1: { "startHHmm": '08:50', "endHHmm": "09:35", "start": { "hh": 8, "mm": 50 }, "end": { "hh": 9, "mm": 35 } },
    2: { "startHHmm": '10:00', "endHHmm": "10:45", "start": { "hh": 10, "mm": 0 }, "end": { "hh": 10, "mm": 45 } },
    3: { "startHHmm": '10:50', "endHHmm": "11:35", "start": { "hh": 10, "mm": 50 }, "end": { "hh": 11, "mm": 35 } },
    4: { "startHHmm": '11:40', "endHHmm": "12:25", "start": { "hh": 11, "mm": 40 }, "end": { "hh": 12, "mm": 25 } },
    5: { "startHHmm": '12:30', "endHHmm": "13:15", "start": { "hh": 12, "mm": 30 }, "end": { "hh": 13, "mm": 15 } },
    6: { "startHHmm": '13:15', "endHHmm": "14:00", "start": { "hh": 13, "mm": 15 }, "end": { "hh": 14, "mm": 0 } },
    7: { "startHHmm": '14:00', "endHHmm": "14:40", "start": { "hh": 14, "mm": 0 }, "end": { "hh": 14, "mm": 40 } },
    8: { "startHHmm": '14:45', "endHHmm": "15:25", "start": { "hh": 14, "mm": 45 }, "end": { "hh": 15, "mm": 25 } },
    9: { "startHHmm": '15:30', "endHHmm": "16:10", "start": { "hh": 15, "mm": 30 }, "end": { "hh": 16, "mm": 10 } },
    10: { "startHHmm": '16:15', "endHHmm": "16:55", "start": { "hh": 16, "mm": 15 }, "end": { "hh": 16, "mm": 55 } },
    11: { "startHHmm": '17:00', "endHHmm": "17:40", "start": { "hh": 17, "mm": 0 }, "end": { "hh": 17, "mm": 40 } },
    12: { "startHHmm": '17:45', "endHHmm": "18:25", "start": { "hh": 17, "mm": 45 }, "end": { "hh": 18, "mm": 25 } },
    13: { "startHHmm": '18:30', "endHHmm": "19:10", "start": { "hh": 18, "mm": 30 }, "end": { "hh": 19, "mm": 10 } },
    14: { "startHHmm": '19:15', "endHHmm": "20:00", "start": { "hh": 19, "mm": 15 }, "end": { "hh": 20, "mm": 0 } },
    15: { "startHHmm": '20:05', "endHHmm": "20:50", "start": { "hh": 20, "mm": 5 }, "end": { "hh": 20, "mm": 50 } }
}

function lastMondayDate(date){
    //let date_ = new Date(date.valueOf())
    let day = date.getDay()
    if (day == 0) date.setDate(date.getDate() - 6)
    else date.setDate(date.getDate() - (day - 1))
    return date
}

export function getRealDate (dayNumber, hourNumber, duration){
    let startDate = lastMondayDate(new Date())
    let endDate = lastMondayDate(new Date())

    startDate.setDate(startDate.getDate() + dayNumber)
    endDate.setDate(endDate.getDate() + dayNumber)

    let start_hh = hours[hourNumber].start.hh
    let start_mm = hours[hourNumber].start.mm

    let realEndHourNumber = hourNumber + duration - 1
    let end_hh = hours[realEndHourNumber].end.hh
    let end_mm = hours[realEndHourNumber].end.mm

    startDate.setHours(start_hh, start_mm, 0, 0)
    endDate.setHours(end_hh, end_mm, 0, 0)

    startDate = startDate.toISOString()
    endDate = endDate.toISOString()
    
    return {"start": startDate, "end": endDate}
}
