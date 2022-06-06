/** @format */

import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import Map from "./Map";
import Profile from "./ProfileButton";
import Ride from "./RideButton";
import axios from "axios";
const { decode } = require("@googlemaps/polyline-codec");

function HomePage() {
  const [passengers, setPassengers] = useState([]);
  const [polycords, setPolycords] = useState([]);

  const addCord = (cord) => {
    setPolycords((state) => [...state, cord]);
  };

  const polyFunct = (polyline) => {
    setPolycords((polycords) => []);
    console.log(polyline.length);

    if (polyline.length > 1) {
      var myobj;
      for (var i = 0; i < polyline.length; i++) {
        myobj = {
          lat: polyline[i][0],
          lng: polyline[i][1],
        };
        console.log(myobj);
        addCord(myobj);
        console.log("intermediate polyline:", polycords);
      }
      console.log("Polyline now:", polycords);
    }
  };

  const pathCoordinates = [];

  useEffect(() => {
    if (localStorage.getItem("userData") != null) {
      console.log("Running function");
      getRoute();
      polyFunct(decode(polyline));
    }
  }, [passengers]);

  const [destination, setDestination] = useState([]);
  const [polyline, setPolyline] = useState("");

  function getRoute() {
    axios({
      method: "POST",
      url: "http://localhost:8000/api/findRoute",
      // "http://192.168.50.129:8000/api/findRoute,"
      data: {
        _id: data._id,
        destination_id: data.destination_id,
      },
    }).then((response) => {
      console.log("Got passengers:", response.data);
      console.log("Got polyline:", response.data.polyline);
      setPolyline(response.data.polyline);
      console.log("Polyline state:", polyline);

      if (passengers.length != response.data.routes.length) {
        setPassengers([]);
        setDestination([]);

        for (const item of response.data.routes) {
          setPassengers((arr) => [...arr, item]);
        }
        for (const item of response.data.dest) {
          setDestination((arr) => [...arr, item]);
        }

        console.log("destination state:", destination);
        console.log("Passengers state:", passengers);
        console.log("Polyline state:", polyline);

        //if data doesn't have route id in it save it to localstorage.
        if (localStorage.getItem("passengers") == null) {
          localStorage.setItem("passengers", passengers);
          console.log("Saved passengers:", passengers);
        }
      }
    });
  }
  const data = JSON.parse(localStorage.getItem("userData"));
  console.log(data);

  if (localStorage.getItem("userData") == null) {
    return <Navigate to="/login" />;
  }

  if (data.org_id != null) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="home-wrapper">
      <div className="home-div">
        <div className="form-inner">
          <Map
            pos={data.lat_lng}
            passengers={passengers}
            destination={destination}
            polyline={polycords}
          />
          <h1
            className="main-logo"
            onClick={() => {
              window.location.reload(false);
            }}
          >
            Commut<text className="r">r</text>
          </h1>
          <Profile passengers={passengers} />
        </div>
        <Ride
          pos={data.lat_lng}
          passengers={passengers}
          destination={destination}
          isDriver={data.isDriver}
        />
      </div>
    </div>
  );
}

export default HomePage;
