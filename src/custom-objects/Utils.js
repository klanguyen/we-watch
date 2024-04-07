export function debounce(fn, wait){
    let timer;
    return function(...args){
        if(timer) {
            clearTimeout(timer); // clear any pre-existing timer
        }
        const context = this; // get the current context
        timer = setTimeout(()=>{
            fn.apply(context, args); // call the function if time expires
        }, wait);
    }
}

export function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

export function formatReleaseDate(inputDate) {
    let date = new Date(inputDate);
    if (!isNaN(date.getTime())) {
        let day = date.getDate().toString();
        let month = (date.getMonth() + 1).toString();
        // Months use 0 index.

        return (month[1] ? month : '0' + month[0]) + '-' +
            (day[1] ? day : '0' + day[0]) + '-' +
            date.getFullYear();
    }
}

export function transformRuntime(inputTime) {
    let hours = Math.floor(inputTime / 60);
    let minutes = inputTime % 60;

    return hours + 'h ' + minutes + 'm';
}

export function transformVoteAvg(inputVote) {
    return Math.round(inputVote*10)/10
}

export function transformVoteCt(voteCt, decimal = 1) {
    if(voteCt >= 1000) {
        let x = ('' + voteCt).length;
        let p = Math.pow;
        decimal = p(10,decimal);
        x -= x%3;
        return Math.round(voteCt*decimal/p(10,x))/decimal + " kMGTPE"[x/3]
    } else {
        return voteCt;
    }
}
