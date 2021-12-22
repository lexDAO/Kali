// functions to format data for display to user

export function convertVotingPeriod(seconds) {
  let time;
  let text;

  if (seconds < 3600) {
    time = seconds / 60;
    if (time == 1) {
      text = "minute";
    } else {
      text = "minutes";
    }
  } else if (seconds < 86400) {
    time = seconds / 3600;
    if (time == 1) {
      text = "day";
    } else {
      text = "days";
    }
  } else {
    time = seconds / 86400;
    if (time == 1) {
      text = "day";
    } else {
      text = "days";
    }
  }
  return time + " " + text;
}

export function votingPeriodToSeconds(period, type) {
  let amount;
  if (type == "min") {
    amount = period * 60;
  }
  if (type == "hour") {
    amount = period * 60 * 60;
  }
  if (type == "day") {
    amount = period * 60 * 60 * 24;
  }
  return amount;
}

export function toDecimals(amount, decimals) {
  console.log("to decimals");
  var stringf = "1";
  for (var i = 0; i < decimals; i++) {
    stringf = stringf + "0";
  }

  return amount * stringf;
}

export function unixToDate(unix) {
  var a = new Date(unix * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}
