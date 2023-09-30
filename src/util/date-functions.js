export function getISODateStr(date) {
    return date.toISOString().substring(0, 10)
}
export function getEndDate(startDateStr, days) {
    const date = new Date(startDateStr);
    const endDate = new Date(date.setDate(date.getDate() + days));
    return getISODateStr(endDate);
}
export function getDaysBetweenDates(fromDate, toDate) {
    const difference = toDate.getTime() - fromDate.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
}
export function getTime(date) {
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    if (hours < 10) {
        hours = '0' + hours
    }
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    if (seconds < 10) {
        seconds = '0' + seconds
    }
    return `${hours}:${minutes}:${seconds}`
}
export function getDateTime(date) {
    const time = getTime(date)
    return getISODateStr(date) + " " + time
}