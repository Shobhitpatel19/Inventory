import React, { useEffect, useState } from "react";

const LocationButton = () => {
  const [location, setLocation] = useState(null);

  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: location,
      zoom: 15,
    });
    const marker = new window.google.maps.Marker({
      position: location,
      map: map,
      title: "Your Location",
    });
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${"AIzaSyDhvO5sKSYze_wCkHH3eC3ls73Dqyatpnw"}&callback=initMap`;
    script.async = true;
    document.body.appendChild(script);
  }, [location]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <button onClick={getLocation}>Get Location</button>
      {location && (
        <p>
          Your location: {location.lat}, {location.lng}
        </p>
      )}
      {location && <div id="map" style={{ height: '400px' }} onLoad={initMap}></div>}
    </div>
  );
};

export default LocationButton;
