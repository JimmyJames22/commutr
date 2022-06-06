/** @format */

import Ride from "./RideButton";
import { useState, useEffect } from "react";
import { withGoogleMap, GoogleMap, Marker, Polyline } from "react-google-maps";
const { decode } = require("@googlemaps/polyline-codec");

function Map(props) {
  const mapOptions = {
    disableDefaultUI: true,
  };

  const [polycords, setPolycords] = useState([]);

  const addCord = (cord) => {
    setPolycords((state) => [...state, cord]);
  };

  useEffect(() => {
    setPolycords((polycords) => []);

    if (decode(props.polyline).length > 1) {
      var myobj;
      for (var i = 0; i < decode(props.polyline).length; i++) {
        myobj = {
          lat: decode(props.polyline)[i][0],
          lng: decode(props.polyline)[i][1],
        };
        console.log(myobj);
        addCord(myobj);
        console.log("intermediate polyline:", polycords);
      }
      console.log("Polyline now:", polycords);
    }
  }, []);

  const pathCoordinates = [];

  const MapWithAMarker = withGoogleMap((p) => (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: props.pos[0], lng: props.pos[1] }}
      options={mapOptions}
    >
      <Marker position={{ lat: props.pos[0], lng: props.pos[1] }} />

      {props.passengers.length > 1 ? (
        <>
          {props.passengers.map((passenger) => (
            <Marker
              key={passenger.place_id}
              position={{
                lat: passenger.lat_lng[0],
                lng: passenger.lat_lng[1],
              }}
            />
          ))}
        </>
      ) : (
        <></>
      )}
      {props.destination.length >= 1 ? (
        <Marker
          position={{
            lat: props.destination[0].lat_lng[0],
            lng: props.destination[0].lat_lng[1],
          }}
        />
      ) : (
        <></>
      )}
      <Polyline
        path={polycords}
        geodesic={false}
        options={{
          strokeColor: "#ff2527",
          strokeOpacity: 1,
          strokeWeight: 6,
          icons: [
            {
              icon: "hello",
              offset: "0",
              repeat: "10px",
            },
          ],
        }}
      />
    </GoogleMap>
  ));

  return (
    <div className="map-wrapper-div">
      <>
        <MapWithAMarker
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div className="map-div" />}
        />
      </>
    </div>
  );
}

export default Map;
