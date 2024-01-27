import React, { useState } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import './MapContainer.scss';

const MapContainer = ({ sendData, lat, lng, google }) => {

  return (
    <div className='post-map'>
      <Map
        google={google}
        initialCenter={{ lat: lat, lng: lng }}
        zoom={16}
      >
          <Marker
            position={{ lat: lat , lng: lng }}
            name={'Your marker text'} // Text for the marker
          />
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAF9fZ_nHPq8L5g8HjqbzWCY-NUwRZVe-c' // Replace with your Google Maps API key
})(MapContainer);