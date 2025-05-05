import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';

const CreateTrip = () => {
  const [tripName, setTripName] = useState('');
  const [depart, setDepart] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [peopleCount, setPeopleCount] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, 'trips'), {
        name: tripName,
        depart,
        destination,
        startDate,
        endDate,
        description,
        peopleCount,
        budget,
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
          placeholder="Depart"
          value={depart}
          onChange={(e) => setDepart(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Date de début"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Date de fin"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Nombre de personnes"
          value={peopleCount}
          onChange={(e) => setPeopleCount(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Budget estimé (€)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <button type="submit">Créer</button>
      </form>

      <button onClick={() => navigate('/dashboard')}>Retour au tableau de bord</button>
    </div>
  );
};

export default CreateTrip;
