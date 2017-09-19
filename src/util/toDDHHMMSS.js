// Takes a string of seconds and calculates a date object from that
function toDDHHMMSS(timeInSeconds) {
  console.log(timeInSeconds);
  var seconds = parseInt(timeInSeconds, 10);
  console.log(typeof seconds);
  var days = Math.floor(seconds / 86400);
  var hours = Math.floor((seconds % 86400) / 3600);
  var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
  var seconds = ((seconds % 86400) % 3600) % 60;
  if (days < 10) {
    days = "0" + days;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var time = {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
  return time;
}

module.exports = toDDHHMMSS
