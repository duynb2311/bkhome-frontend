import React, { useState } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import './Map.scss';

const MapContainer = ({ sendData, google }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapClick = (mapProps, map, clickEvent) => {
    const lat = clickEvent.latLng.lat();
    const lng = clickEvent.latLng.lng();
    setSelectedLocation({ lat, lng });
    sendData({ lat, lng });
  };

  return (
    <div className='map'>
      <Map
        google={google}
        initialCenter={{ lat: 21.002046692523585, lng: 105.85283758242755 }}
        zoom={15}
        onClick={handleMapClick}
      >
        {selectedLocation && (
          <Marker
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            name={'Your marker text'} // Text for the marker
          />
        )}
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAF9fZ_nHPq8L5g8HjqbzWCY-NUwRZVe-c' // Replace with your Google Maps API key
})(MapContainer);