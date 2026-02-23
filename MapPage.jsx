import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const MapPage = () => {
  const [toilets, setToilets] = useState([]);
  const [userLoc, setUserLoc] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(p => {
      setUserLoc({ lat: p.coords.latitude, lng: p.coords.longitude });
    });

    return onSnapshot(collection(db, "toilets"), (snapshot) => {
      setToilets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const getMarkerIcon = (grade) => {
    if (['A', 'B'].includes(grade)) return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    if (grade === 'C') return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  };

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: "YOUR_GOOGLE_KEY" });

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="h-screen w-full">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={userLoc}
        zoom={15}
      >
        {toilets.map(t => (
          <Marker 
            key={t.id} 
            position={{ lat: t.lat, lng: t.lng }} 
            icon={getMarkerIcon(t.grade)}
            onClick={() => window.location.href = `/toilet/${t.id}`}
          />
        ))}
      </GoogleMap>
    </div>
  );
};