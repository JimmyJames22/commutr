import Ride from './RideButton';
import {
    withGoogleMap,
    GoogleMap,
    Marker,
  } from "react-google-maps";

function Map(props) {

    const mapOptions = {
        disableDefaultUI: true
      };

    console.log("Props:", props)
    console.log("Found this things:", props.passengers)



    const MapWithAMarker = withGoogleMap(p =>
        
        

        <GoogleMap
          defaultZoom={10}
          defaultCenter={{ lat: props.pos[0], lng: props.pos[1]}}
          options={mapOptions}
        >
          <Marker
            position={{ lat: props.pos[0], lng: props.pos[1] }}
          />
          
          {props.passengers.length > 1 ? (
            <>{props.passengers.map((passenger) =>(
            <Marker
            key={passenger.place_id}
            position={{ lat: passenger.lat_lng[0], lng: passenger.lat_lng[1] }}
            />
            ))}</>
          ) : (
          <></>
          )}
          
        </GoogleMap>
      );
      
      

    return(
            <div className="map-wrapper-div">
                <>
                <MapWithAMarker
                    containerElement={<div style={{ height: `100%`}} />}
                    mapElement={<div className="map-div"/>}
                />
                </>
            </div>
    )
}

export default Map