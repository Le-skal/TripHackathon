import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const CreateTrip = () => {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await db.collection('trips').add({
        name: tripName,
        destination,
        userId: user.uid,
        createdAt: new Date()
      });
      navigate('/trips');
    } catch (error) {
      console.error('Erreur lors de la création du voyage :', error);
    }
  };

  return (
    <div>
      <h2>Créer un nouveau voyage</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom du voyage"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

export default CreateTrip;
