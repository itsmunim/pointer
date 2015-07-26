function getReadableTime(date){
    var today = Date.now();
    var timeElapsed = today -date;
    if(timeElapsed < 0) return 'Invalid time';
    var secs = timeElapsed/1000;
    var mins = secs/60;
    var hours = mins/60;
    var days = hours/24;

    if(days >= 1 && days < 7) return Math.ceil(days) + ' day/s ago';
    else if(days > 7) return 'More than a week ago';

    if(hours >= 1 && hours < 24) return Math.ceil(hours) + ' hour/s ago';

    if(mins >= 1 && mins < 60) return Math.ceil(mins) + ' min/s ago';

    if(secs >= 1 && secs < 60) return 'A few seconds ago';
    else return 'Just now';

}
