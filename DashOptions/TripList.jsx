// src/TripList.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;

      const tripsRef = collection(db, "trips");
      const q = query(tripsRef, where("userId", "==", user.uid));
      const tripSnapshot = await getDocs(q);
      const tripsList = tripSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrips(tripsList);
    };

    fetchTrips();
  }, [user]);

  if (!user) {
    return <p>Vous devez être connecté pour voir vos voyages.</p>;
  }

  if (selectedTrip) {
    return (
      <div>
        <h1>Détails du voyage : {selectedTrip.name}</h1>
        <p><strong>Destination :</strong> {selectedTrip.destination}</p>
        <p><strong>Départ :</strong> {selectedTrip.depart}</p>
        <p><strong>Date de début :</strong> {selectedTrip.startDate}</p>
        <p><strong>Date de fin :</strong> {selectedTrip.endDate}</p>
        <p><strong>Description :</strong> {selectedTrip.description}</p>
        <p><strong>Nombre de personnes :</strong> {selectedTrip.peopleCount}</p>
        <p><strong>Budget :</strong> {selectedTrip.budget}</p>
        <p><strong>Plan IA :</strong> {selectedTrip.aiPlan}</p>
        <p><strong>Créé le :</strong> {selectedTrip.createdAt?.toDate().toLocaleString()}</p>

        <button onClick={() => setSelectedTrip(null)}>Retour à la liste</button>
        <button onClick={() => navigate('/dashboard')}>Retour au tableau de bord</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Mes Voyages</h1>
      {trips.length === 0 ? (
        <p>Aucun voyage trouvé.</p>
      ) : (
        <ul>
          {trips.map((trip) => (
            <li key={trip.id}>
              <button
                onClick={() => setSelectedTrip(trip)}
                style={{
                  background: "none",
                  border: "none",
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                {trip.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/dashboard")}>Retour au tableau de bord</button>
    </div>
  );
};

export default TripList;
