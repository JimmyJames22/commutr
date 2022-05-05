import Ride from './RideButton';
import {
    withGoogleMap,
    GoogleMap,
    Marker,
  } from "react-google-maps";

function Map() {

    const mapOptions = {
        disableDefaultUI: true
      };



    const MapWithAMarker = withGoogleMap(props =>
        
        <GoogleMap
          defaultZoom={8}
          defaultCenter={{ lat: 42.23959, lng: -71.08112 }}
          options={mapOptions}
        >
          <Marker
            position={{ lat: 42.23959, lng: -71.08112 }}
          />
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