// Manage core logic by this variable
const getDateString = (Date, Language)=>{
    let Year = Date.getFullYear() 
    let Month = Date.getMonth() + 1 
    let Day = Date.getDate() 

    if (Month < 10) { Month = '0'+Month }
    if (Day < 10) { Day = '0'+Day }

    return (Language == 'th')
        ? Day +'/'+ Month +'/'+ (Year+543) 
        : Month +'/'+ Day +'/'+ Year 

    // ? Date.getDate() +'/'+ (Date.getMonth()+1) +'/'+ (Date.getFullYear()+543) 
    // : (Date.getMonth()+1) +'/'+ Date.getDate() +'/'+ Date.getFullYear()
} // getDateString

const getYMD = (Date)=>{
    let Year = Date.getFullYear() 
    let Month = Date.getMonth() + 1 
    let Day = Date.getDate() 

    if (Month < 10) { Month = '0'+Month }
    if (Day < 10) { Day = '0'+Day }

    return Year +'-'+ Month +'-'+ Day
} // getYMD

const getYMDfromDMY = (DMY,Language)=>{
    const DA = DMY.split('/') 

    return (Language == 'th') 
    ? (parseInt(DA[2]) - 543) +'-'+ DA[1] +'-'+ DA[0]
    : DA[2] +'-'+ DA[0] +'-'+ DA[1]
}

const getTimeArray = (Time)=>{
    // console.log('Time '+Time) 

    const TimeArray = Time.split(':') 

    return TimeArray.map(e => {
        return parseInt(e)
    })    
} // getTimeArray

const getDateTime = (date)=>{
    let Month   = date.getMonth() + 1 
    let Day     = date.getDate() 
    let Hour    = date.getHours() 
    let Minute  = date.getMinutes()
    let Second  = date.getSeconds()

    if (Month  < 10) { Month  = '0'+Month }
    if (Day    < 10) { Day    = '0'+Day }
    if (Hour   < 10) { Hour   = '0'+Hour }
    if (Minute < 10) { Minute = '0'+Minute }
    if (Second < 10) { Second = '0'+Second }

    return date.getFullYear() +"-"+ Month +"-"+ Day +" "+ Hour +":"+ Minute +":"+ Second 
}

const getDateTimeLang = (date, Language)=>{
    // let date = new Date(DateTime)
    // console.log('getDateTimeLang Language '+Language)

    let Year = date.getFullYear() 
    let Month = date.getMonth() + 1 
    let Day = date.getDate() 

    if (Month < 10) { Month = '0'+Month }
    if (Day < 10) { Day = '0'+Day }

    let _return = (Language == 'th')
        ? Day +'/'+ Month +'/'+ (Year+543) 
        : Month +'/'+ Day +'/'+ Year 

    return _return +' '+ getTime(date)
} // getDateTimeLang

const getTime = (date)=>{
    let Hour = date.getHours() 
    let Minute = date.getMinutes()

    if (Hour   < 10) { Hour   = '0'+Hour }
    if (Minute < 10) { Minute = '0'+Minute }

    return Hour +':'+ Minute 
}

const getWorkDayText = (WorkDay,L,Full=true) => {
    if (WorkDay == 'YYYYYYY') {
        return (L=='th') ? 'ทุกวัน' : 'All day'
    } else {
        const WeekDayArray = (Full) 
        ? [ 
            (L=='th') ? 'อาทิตย์' : 'Sunday', 
            (L=='th') ? 'จันทร์'  : 'Monday',
            (L=='th') ? 'อังคาร' : 'Tuesday',
            (L=='th') ? 'พุธ'   : 'Wednesday',
            (L=='th') ? 'พฤหัส' : 'Thursday',
            (L=='th') ? 'ศุกร์'  : 'Friday',
            (L=='th') ? 'เสาร์'  : 'Saturday'
          ]
        : [
            (L=='th') ? 'อา.': 'Sun.',
            (L=='th') ? 'จ.' : 'Mon.',
            (L=='th') ? 'อ.' : 'Tue.',
            (L=='th') ? 'พ.'   : 'Wed.',
            (L=='th') ? 'พฤ.' : 'Thu.',
            (L=='th') ? 'ศ.'  : 'Fri.',
            (L=='th') ? 'ส.'  : 'Sat.'    
          ]

        switch (WorkDay) {
            case 'YNNNNNY':
                return WeekDayArray[6] +'-'+ WeekDayArray[0] 

            case 'YNNNNYY':
                return WeekDayArray[5] +'-'+ WeekDayArray[0] 

            default:
                var _return = '', BeginDay = null, EndDay = null

                for (let i=0; i<7; i++) {
                    if (WorkDay[i] == 'Y') {
                        if (BeginDay == null) {
                            BeginDay = WeekDayArray[i] 
                        } else {
                            EndDay = WeekDayArray[i]
                        }
                    } else {
                        if (BeginDay != null) {
                            if (_return != '') {
                                _return += ', '
                            }

                            _return += BeginDay 

                            if (EndDay != null) {
                                _return += '-' + EndDay
                            }

                            BeginDay = null 
                            EndDay = null
                        }
                    }
                } // for

                if (BeginDay != null) {
                    if (_return != '') {
                        _return += ', '
                    }

                    _return += BeginDay 

                    if (EndDay != null) {
                        _return += '-' + EndDay
                    }
                }

                return _return
        } // switch
    }
} // getWorkDayText

module.exports = { 
    getDateString, getYMD, getYMDfromDMY, getTimeArray, getDateTime, 
    getDateTimeLang, getTime, getWorkDayText
}
