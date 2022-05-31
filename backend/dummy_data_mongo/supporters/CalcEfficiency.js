// weights need to be adjusted to help normalize
let route_stops_weight = 10000;
let route_time_weight = 10;
let arrival_time_weight = 0.0000005;
let departure_time_weight = 0.0000005;

function sumEfficiency(drivers) {
  let efficiency_back = 0;
  for (let i = 0; i < drivers.length; i++) {
    let driver = drivers[i];
    let new_eff = calcEfficiency(
      driver.max_dur - driver.new_route.total_dur,
      driver.new_route.stops
    );
    efficiency_back += new_eff;
    driver.new_route.efficiency = new_eff;
  }

  return efficiency_back;
}

function calcEfficiency(dur_delta, stops) {
  let num_stops = stops.length;

  let arrival_aad_ave = 0;
  let departure_aad_ave = 0;

  for (let j = 0; j < 7; j++) {
    let arrival_counter = 0;
    let departure_counter = 0;

    let arrival_sum = 0;
    let departure_sum = 0;

    for (let i = 0; i < num_stops; i++) {
      let arrival_time = stops[i].arrival_times[j];
      if (arrival_time.commuting && arrival_time.time != -1) {
        arrival_sum += arrival_time.time;
        arrival_counter++;
      }

      let departure_time = stops[i].departure_times[j];
      if (departure_time.commuting && departure_time.time != -1) {
        departure_sum += departure_time.time;
        departure_counter++;
      }
    }

    if (arrival_counter == 0) {
      arrival_sum = 0;
    } else {
      arrival_sum /= arrival_counter;
    }

    if (departure_counter == 0) {
      departure_sum = 0;
    } else {
      departure_sum /= departure_counter;
    }

    let arrival_aad = 0;
    let departure_aad = 0;

    for (let i = 0; i < num_stops; i++) {
      let arrival_time = stops[i].arrival_times[j];
      if (arrival_time.commuting && arrival_time.time != -1) {
        arrival_aad += Math.abs(arrival_time.time - arrival_sum);
      }

      let departure_time = stops[i].departure_times[j];
      if (departure_time.commuting && departure_time.time != -1) {
        departure_aad += Math.abs(departure_time.time - departure_sum);
      }
    }

    if (arrival_counter == 0) {
      arrival_aad_ave += 0;
    } else {
      arrival_aad_ave += arrival_aad /= arrival_counter;
    }

    if (departure_counter == 0) {
      departure_aad_ave += 0;
    } else {
      departure_aad_ave += departure_aad /= departure_counter;
    }
  }

  arrival_aad_ave /= 7;
  departure_aad_ave /= 7;

  return (
    num_stops * route_stops_weight +
    dur_delta * route_time_weight -
    Math.pow(arrival_aad_ave, 2) * arrival_time_weight -
    Math.pow(departure_aad_ave, 2) * departure_time_weight
  );
}

module.exports = { calcEfficiency, sumEfficiency };
