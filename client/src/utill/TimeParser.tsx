

export interface TimeParser {
    days: number,
    hours: number,
    minutes: number,
    seconds: number
}

export function ParseTime(time_in_miliseconds : number) : TimeParser {
  let delta = Math.floor(time_in_miliseconds / 1000)
  let days = Math.floor(delta / 86400)
  delta -= days * 86400
  let hours = Math.floor(delta / 3600) % 24
  delta -= hours * 3600
  let minutes = Math.floor(delta / 60) % 60
  delta -= minutes * 60
  let seconds = delta % 60
  return { days, hours, minutes, seconds }
}

export function TimeParserString(parser: TimeParser) : string {
  let str = ""
  if(parser.days !== 0) {
    str = parser.days + " days "
  }
  str = str + TimeString(parser.hours, parser.minutes, parser.seconds)
  if(parser.hours !== 0) {
    str = str + " hours"
  } else {
    str = str + " minutes"
  }
  return str
}

export function TimeString(hours: number, minutes: number, seconds: number) : string {
  let str = ""
  if(hours !== 0) {
    if(hours > 9) {
      str = String(hours)
    } else {
      str = "0" + String(hours)
    }
    str = str + ":"
  }
  if(minutes > 9) {
    str = str + String(minutes)
  } else {
    str = str + "0" + String(minutes)
  }
  str = str + ":"
  if(seconds > 9) {
    str = str + String(seconds)
  } else {
    str = str + "0" + String(seconds)
  }
  return str
}

export function splitListByDate<T>(list: Array<T>, getDate: (item: T) => Date) : Array<{date: Date, list: Array<T>}> {
  // sort by date
  list = list.slice().sort((a, b) => getDate(b).getTime() - getDate(a).getTime())
  // split list by day
  let split : Array<{date: Date, list: Array<T>}> = []
  const compareDatesHaveTheSameDay = (a: Date, b: Date) : Boolean => {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }
  const extractDate = (date: Date) : Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  for(let i=0;i<list.length;i++) {
    const date = getDate(list[i])
    if(split.length !== 0 && compareDatesHaveTheSameDay(split[split.length-1].date, date)) {
      split[split.length-1].list.push(list[i])
    } else {
      split.push({
        date: extractDate(date),
        list: [list[i]]
      })
    }
  }
  return split
}

export function getDateName(date: Date) : string {
  const now = Date.now()
  const dayTime = 24 * 60 * 60 * 1000
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const extractDate = (date: number) : Date => {
    const _date = new Date(date)
    return new Date(_date.getFullYear(), _date.getMonth(), _date.getDate())
  }
  if(extractDate(now) <= date) {
    return "Today"
  } else if(extractDate(now - dayTime) <= date) {
    return "Yesterday"
  } else if(extractDate(now - dayTime*6) <= date) {
    return days[date.getDay()]
  } else {
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
  }
}