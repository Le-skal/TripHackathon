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
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiPlan, setAIPlan] = useState('');
  const navigate = useNavigate();

  const handleSaveTrip = async () => {
    const user = auth.currentUser;
    if (!user || !aiPlan) return;

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
        aiPlan,
        userId: user.uid,
        createdAt: new Date(),
      });
      navigate('/trips');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du voyage :', error);
    }
  };

  const generateAIPlan = async () => {
    setLoadingAI(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripName,
          depart,
          destination,
          startDate,
          endDate,
          description,
          peopleCount,
          budget,
        }),
      });

      const data = await response.json();
      setAIPlan(data.plan);
    } catch (error) {
      console.error('Erreur AI :', error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div>
      <h2>Créer un nouveau voyage</h2>
      <form>
        <input type="text" placeholder="Nom du voyage" value={tripName} onChange={(e) => setTripName(e.target.value)} required />
        <input type="text" placeholder="Depart" value={depart} onChange={(e) => setDepart(e.target.value)} required />
        <input type="text" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} required />
        <input type="date" placeholder="Date de début" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <input type="date" placeholder="Date de fin" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Nombre de personnes" value={peopleCount} onChange={(e) => setPeopleCount(e.target.value)} required />
        <input type="number" placeholder="Budget estimé (€)" value={budget} onChange={(e) => setBudget(e.target.value)} />

        <button type="button" onClick={generateAIPlan}>
          {loadingAI ? 'Génération en cours...' : 'Générer un plan AI'}
        </button>

        {aiPlan && (
          <div>
            <h3>Plan de voyage généré :</h3>
            <pre>{aiPlan}</pre>
            <button type="button" onClick={handleSaveTrip}>Sauver</button>
          </div>
        )}
      </form>

      <button onClick={() => navigate('/dashboard')}>Retour au tableau de bord</button>
    </div>
  );
};

export default CreateTrip;
