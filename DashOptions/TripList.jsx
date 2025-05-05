// src/TripList.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Assure-toi que db est bien importé
import { collection, getDocs } from "firebase/firestore";

const TripList = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const tripsCollection = collection(db, "trips");
      const tripSnapshot = await getDocs(tripsCollection);
      const tripsList = tripSnapshot.docs.map(doc => doc.data());
      setTrips(tripsList);
    };

    fetchTrips();
  }, []);

  return (
    <div>
      <h1>Mes Voyages</h1>
      <ul>
        {trips.map((trip, index) => (
          <li key={index}>{trip.name}</li> // Remplace `trip.name` par ce qui correspond à ta structure
        ))}
      </ul>
    </div>
  );
};

export default TripList;
