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
          defaultCenter={{ lat: -34.397, lng: 150.644 }}
          options={mapOptions}
        >
          <Marker
            position={{ lat: -34.397, lng: 150.644 }}
          />
        </GoogleMap>
      );
      
      

    return(
            <div className="map-wrapper-div">
                <>
                <MapWithAMarker
                    containerElement={<div style={{ height: `80%`, paddingTop:`15px` }} />}
                    mapElement={<div style={ { height: `125%`, width: `100%` } } />}
                />
                </>
            </div>
    )
}

export default Map