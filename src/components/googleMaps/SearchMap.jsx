import React, { useState } from 'react';
import { Map, Marker, GoogleApiWrapper, Circle } from 'google-maps-react';
import './SearchMap.scss';

const MapContainer = ({ sendData, google, radius }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleMapClick = (mapProps, map, clickEvent) => {
        const lat = clickEvent.latLng.lat();
        const lng = clickEvent.latLng.lng();
        setSelectedLocation({ lat, lng });
        sendData({ lat, lng });
    };

    return (
        <div className='search-map'>
            <Map
                google={google}
                initialCenter={{ lat: 21.002046692523585, lng: 105.85283758242755 }}
                zoom={13}
                onClick={handleMapClick}
            >
            {selectedLocation && (
                <Marker
                    position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                    name={'Your marker text'} // Text for the marker
                />
            )}
                {selectedLocation && (
                    <Circle
                        center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                        radius={parseInt(radius)} // Radius in meters
                        strokeColor="transparent"
                        strokeOpacity={0}
                        strokeWeight={5}
                        fillColor="#FF0000"
                        fillOpacity={0.2}
                    />
                )}
            </Map>
        </div>
    );
};

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAF9fZ_nHPq8L5g8HjqbzWCY-NUwRZVe-c' // Replace with your Google Maps API key
})(MapContainer);