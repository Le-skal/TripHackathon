import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../beauty/DashBoard.css';

const Dashboard = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;
      const now = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      const tripsRef = collection(db, 'trips');
      const q = query(tripsRef, where('userId', '==', user.uid));

      try {
        const querySnapshot = await getDocs(q);
        const upcoming = [];
        const past = [];

        querySnapshot.forEach((doc) => {
          const trip = doc.data();
          const tripStart = new Date(trip.startDate);
          const tripData = { id: doc.id, ...trip };

          if (tripStart > now && tripStart < oneYearFromNow) {
            upcoming.push(tripData);
          } else if (tripStart < now) {
            past.push(tripData);
          }
        });

        // Trier les voyages passés par date décroissante
        past.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        setUpcomingTrips(upcoming);
        setPastTrips(past);
      } catch (error) {
        console.error('Erreur lors du chargement des voyages :', error);
      }
    };

    fetchTrips();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/signin');
    } catch (err) {
      console.error('Erreur lors de la déconnexion: ', err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          Bienvenue, <span className="user-email">{user?.email}</span>
        </h1>
      </header>

      <nav className="dashboard-nav">
        <ul className="nav-list">
          <li><Link to="/create-trip">Créer un voyage</Link></li>
          <li><Link to="/trips">Mes voyages</Link></li>
          <li><Link to="/profile">Mon profil</Link></li>
        </ul>
      </nav>

      <div className="dashboard-widgets">
        <div className="widget-card">
          <h3 className="widget-title">Voyages à venir</h3>
          {upcomingTrips.length > 0 ? (
            <ul>
              {upcomingTrips.map((trip) => (
                <li key={trip.id}>
                  <strong>{trip.name}</strong> – départ le {new Date(trip.startDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>Vous n'avez pas encore de voyages planifiés dans l'année à venir.</p>
          )}
        </div>

        <div className="widget-card">
          <h3 className="widget-title">Activités récentes</h3>
          {pastTrips.length > 0 ? (
            <ul>
              {pastTrips.map((trip) => (
                <li key={trip.id}>
                  <strong>{trip.name}</strong> – commencé le {new Date(trip.startDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune activité récente.</p>
          )}
        </div>

        <div className="widget-card">
          <h3 className="widget-title">Conseils</h3>
          <p>Créez votre premier voyage en cliquant sur "Créer un voyage".</p>
        </div>
      </div>

      <button className="signout-button" onClick={handleSignOut}>Déconnexion</button>
    </div>
  );
};

export default Dashboard;
