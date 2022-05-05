// weights need to be adjusted to help normalize
let route_stops_weight = 15;
let route_dist_weight = 80;
let arrival_time_weight = 0;
let departure_time_weight = 0;

function calcEfficiency(dist_delta, stops) {
  let num_stops = stops.length;

  // calc time AADs
  let arrival_ave = 0;
  let departure_ave = 0;
  for (let i = 0; i < num_stops; i++) {
    arrival_ave += stops[i].arrival_time.total_mins;
    departure_ave += stops[i].departure_time.total_mins;
  }
  arrival_ave /= num_stops;
  departure_ave /= num_stops;
  let arrival_aad = 0;
  let departure_aad = 0;
  for (let i = 0; i < num_stops; i++) {
    arrival_aad += Math.abs(arrival_ave - stops[i].arrival_time.total_mins);
    departure_aad += Math.abs(
      departure_ave - stops[i].departure_time.total_mins
    );
  }
  arrival_aad /= num_stops;
  departure_aad /= num_stops;

  return (
    num_stops * route_stops_weight +
    dist_delta * route_dist_weight -
    Math.pow(arrival_aad, 2) * arrival_time_weight -
    Math.pow(departure_aad, 2) * departure_time_weight
  );
}

module.exports = calcEfficiency;
