"use client";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState } from "react";

const MapComponent = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const mapStyles = {
    height: "250px",
    width: "100%",
  };

  const handleMapClick = (event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      console.log("LOCATION");
      console.log(selectedLocation.lat);
      console.log(selectedLocation.lng);
      localStorage.setItem("latitude", selectedLocation.lat);
      localStorage.setItem("longitude", selectedLocation.lng);
    }
  };

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={{ lat: 24.860966, lng: 66.990501 }}
        onClick={handleMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
      <div
        className="cursor-pointer w-fit mt-3 font-semibold text-sm mb-1 bg-[#20332c] transition duration-500 ease-in-out hover:bg-[#257830] text-[#fff] hover:text-[#fff] outline-none border-0 px-7 py-3 rounded-md sm:rounded-sm"
        onClick={handleConfirmLocation}
      >
        Confirm Location on Map
      </div>
    </>
  );
};

const WrappedMapComponent = () => {
  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyCLNX0Qokx5Fu3s8kqN1NAp3tABdIr8xzE">
        <MapComponent />
      </LoadScript>
    </>
  );
};

export default WrappedMapComponent;
