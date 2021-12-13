export function convertVotingPeriod(seconds) {
    let time;
    let text;

    if(seconds < 3600) {
        time = seconds / 60;
        if(time == 1) {text = "minute";} else {text = "minutes";}
    } else if(seconds < 86400) {
        time = seconds / (3600);
        if(time == 1) {text = "day";} else {text = "days";}
    } else {
        time = seconds / (86400);
        if(time == 1) {text = "day";} else {text = "days";}
    }
    return time + " " + text;
}

export function votingPeriodToSeconds(period, type) {
    let amount;
    if(type=="minutes") {
      amount = period * 60;
    }
    if(type=="hours") {
      amount = period * 60 * 60;
    }
    if(type=="days") {
      amount = period * 60 * 60 * 24;
    }
    return amount;
}
