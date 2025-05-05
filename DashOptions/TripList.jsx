import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import '../beauty/TripList.css';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedTripsToDelete, setSelectedTripsToDelete] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Fonction pour formatter le plan IA en sections lisibles
  const formatAIPlan = (aiPlan) => {
    if (!aiPlan) return null;
    
    // Vérifier si le plan contient le mot "jour" qui indique une structure par journée
    if (aiPlan.includes("jour")) {
      // Diviser par les jours (jour 1, jour 2, etc.)
      const dayRegex = /jour \d+/gi;
      const days = aiPlan.split(dayRegex);
      const matches = aiPlan.match(dayRegex);
      
      if (matches) {
        return (
          <div className="ai-plan-container">
            <h3>Itinéraire détaillé</h3>
            <div className="ai-plan-overview">
              {aiPlan.split('title:')[1]?.split('date:')[0] && (
                <p><strong>Titre:</strong> {aiPlan.split('title:')[1].split('date:')[0].trim()}</p>
              )}
              {aiPlan.split('budget:')[1]?.split('activities:')[0] && (
                <p><strong>Budget:</strong> {aiPlan.split('budget:')[1].split('activities:')[0].trim()}</p>
              )}
              {aiPlan.split('activities:')[1]?.split('accommodation:')[0] && (
                <p><strong>Activités prévues:</strong> {aiPlan.split('activities:')[1].split('accommodation:')[0].trim()}</p>
              )}
              {aiPlan.split('accommodation:')[1]?.split('jour 1')[0] && (
                <p><strong>Hébergement:</strong> {aiPlan.split('accommodation:')[1].split('jour 1')[0].trim()}</p>
              )}
            </div>
            <div className="ai-plan-days">
              {matches.map((day, index) => (
                <div key={index} className="ai-plan-day">
                  <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                  <div className="ai-plan-day-content">
                    {days[index + 1] && (
                      <p>{days[index + 1].split(/jour \d+/i)[0].trim()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {aiPlan.includes("budget :") && (
              <div className="ai-plan-budget-breakdown">
                <h4>Répartition du budget</h4>
                <p>{aiPlan.split(/budget :/i)[1].trim()}</p>
              </div>
            )}
          </div>
        );
      }
    }
    
    // Si la structure par jour n'est pas détectée, afficher avec un formatage de base
    return (
      <div className="ai-plan-simple">
        {aiPlan.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
  };

  const toggleTripSelection = (tripId) => {
    if (selectedTripsToDelete.includes(tripId)) {
      setSelectedTripsToDelete(selectedTripsToDelete.filter(id => id !== tripId));
    } else {
      setSelectedTripsToDelete([...selectedTripsToDelete, tripId]);
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedTripsToDelete([]);
  };

  const deleteSelectedTrips = async () => {
    if (selectedTripsToDelete.length === 0) return;
    
    setIsDeleting(true);
    
    try {
      // Supprimer chaque voyage sélectionné
      for (const tripId of selectedTripsToDelete) {
        await deleteDoc(doc(db, "trips", tripId));
      }
      
      // Mettre à jour la liste des voyages
      setTrips(trips.filter(trip => !selectedTripsToDelete.includes(trip.id)));
      setSelectedTripsToDelete([]);
      setIsDeleteMode(false);
    } catch (error) {
      console.error("Erreur lors de la suppression des voyages:", error);
      alert("Une erreur s'est produite lors de la suppression des voyages.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return <div className="trip-container">
      <p className="empty-trips">Vous devez être connecté pour voir vos voyages.</p>
    </div>;
  }

  if (selectedTrip) {
    return (
      <div className="trip-container">
        <div className="trip-details">
          <h1>Détails du voyage : {selectedTrip.name}</h1>
          <div className="trip-info-grid">
            <div className="trip-info-item">
              <strong>Destination :</strong> {selectedTrip.destination}
            </div>
            <div className="trip-info-item">
              <strong>Départ :</strong> {selectedTrip.depart}
            </div>
            <div className="trip-info-item">
              <strong>Date de début :</strong> {selectedTrip.startDate}
            </div>
            <div className="trip-info-item">
              <strong>Date de fin :</strong> {selectedTrip.endDate}
            </div>
            <div className="trip-info-item">
              <strong>Description :</strong> {selectedTrip.description}
            </div>
            <div className="trip-info-item">
              <strong>Nombre de personnes :</strong> {selectedTrip.peopleCount}
            </div>
            <div className="trip-info-item">
              <strong>Budget :</strong> {selectedTrip.budget}
            </div>
            <div className="trip-info-item">
              <strong>Créé le :</strong> {selectedTrip.createdAt?.toDate().toLocaleString()}
            </div>
          </div>
          
          <div className="ai-plan-section">
            <h2>Plan de voyage</h2>
            {formatAIPlan(selectedTrip.aiPlan)}
          </div>
          
          <div className="buttons-container">
            <button className="button button-secondary" onClick={() => setSelectedTrip(null)}>Retour à la liste</button>
            <button className="button" onClick={() => navigate('/dashboard')}>Retour au tableau de bord</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-container">
      <div className="trip-header">
        <h1>Mes Voyages</h1>
      </div>
      
      {trips.length === 0 ? (
        <p className="empty-trips">Aucun voyage trouvé.</p>
      ) : (
        <ul className="trip-list">
          {trips.map((trip) => (
            <li key={trip.id} className={`trip-item ${isDeleteMode && selectedTripsToDelete.includes(trip.id) ? 'selected-for-delete' : ''}`}>
              {isDeleteMode ? (
                <div className="trip-delete-selection">
                  <label className="trip-checkbox-container">
                    <input
                      type="checkbox"
                      checked={selectedTripsToDelete.includes(trip.id)}
                      onChange={() => toggleTripSelection(trip.id)}
                    />
                    <span className="trip-checkbox-checkmark"></span>
                  </label>
                  <div className="trip-info">
                    <h3 className="trip-name">{trip.name}</h3>
                    <p className="trip-destination">{trip.destination}</p>
                    {trip.startDate && trip.endDate && (
                      <span className="trip-dates">
                        {trip.startDate} - {trip.endDate}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedTrip(trip)}
                  className="trip-item-button"
                >
                  <h3 className="trip-name">{trip.name}</h3>
                  <p className="trip-destination">{trip.destination}</p>
                  {trip.startDate && trip.endDate && (
                    <span className="trip-dates">
                      {trip.startDate} - {trip.endDate}
                    </span>
                  )}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      
      <div className="bottom-actions">
        {trips.length > 0 && (
          <div className="delete-actions">
            <button 
              className={`button ${isDeleteMode ? 'button-warning active' : 'button-delete'}`}
              onClick={toggleDeleteMode}
            >
              {isDeleteMode ? 'Annuler' : 'Supprimer des voyages'}
            </button>
            
            {isDeleteMode && selectedTripsToDelete.length > 0 && (
              <button 
                className="button button-danger"
                onClick={deleteSelectedTrips}
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression en cours...' : `Supprimer (${selectedTripsToDelete.length})`}
              </button>
            )}
          </div>
        )}
        <button className="button" onClick={() => navigate("/dashboard")}>Retour au tableau de bord</button>
      </div>
    </div>
  );
};

export default TripList;