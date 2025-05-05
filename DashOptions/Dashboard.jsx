// src/Dashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Dashboard = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/signin"); // Rediriger vers la page de connexion après déconnexion
    } catch (err) {
      console.error("Erreur lors de la déconnexion: ", err.message);
    }
  };

  return (
    <div>
      <h1>Bienvenue, {user?.email}</h1>
      <nav>
        <ul>
          <li><Link to="/create-trip">Créer un voyage</Link></li>
          <li><Link to="/trips">Mes voyages</Link></li>
          <li><Link to="/profile">Mon profil</Link></li>
        </ul>
      </nav>
      <button onClick={handleSignOut}>Déconnexion</button>
    </div>
  );
};

export default Dashboard;
