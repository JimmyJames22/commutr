class Time {
  constructor(time_str) {
    // take in time as "xx:xx" string
    let arr = time_str.split(":");
    this.hrs = parseInt(arr[0]);
    this.mins = parseInt(arr[1]);
    this.total_mins = this.hrs * 60 + this.mins; // store number of minutes since midnight
  }

  timeDiff(other_time) {
    return Math.abs(this.total_mins - other_time.total_mins);
  }
}

module.exports = Time;
