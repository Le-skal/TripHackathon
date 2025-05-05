import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import '../beauty/CreateTrip.css';

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
    <div className="create-trip-container">
      <header className="create-trip-header">
        <h2 className="create-trip-title">Créer un nouveau voyage</h2>
      </header>
      
      <form className="trip-form">
        <div className="form-group">
          <label className="form-label">Nom du voyage</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Ex: Vacances d'été à Bali" 
            value={tripName} 
            onChange={(e) => setTripName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Lieu de départ</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Ex: Paris" 
            value={depart} 
            onChange={(e) => setDepart(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Destination</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Ex: Bali, Indonésie" 
            value={destination} 
            onChange={(e) => setDestination(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Nombre de personnes</label>
          <input 
            type="number" 
            className="form-input" 
            placeholder="Ex: 2" 
            value={peopleCount} 
            onChange={(e) => setPeopleCount(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Date de début</label>
          <input 
            type="date" 
            className="form-input" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Date de fin</label>
          <input 
            type="date" 
            className="form-input" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Budget estimé (€)</label>
          <input 
            type="number" 
            className="form-input" 
            placeholder="Ex: 2000" 
            value={budget} 
            onChange={(e) => setBudget(e.target.value)} 
          />
        </div>
        
        <div className="form-group full-width">
          <label className="form-label">Description du voyage</label>
          <textarea 
            className="form-textarea" 
            placeholder="Décrivez vos préférences, activités souhaitées, etc." 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>

        <div className="buttons-group">
          <button 
            type="button" 
            className={`btn btn-primary ${loadingAI ? 'btn-loading' : ''}`} 
            onClick={generateAIPlan}
            disabled={loadingAI}
          >
            {loadingAI ? 'Génération en cours...' : 'Générer un plan AI'}
          </button>
        </div>

        {aiPlan && (
          <div className="ai-plan-container slide-in">
            <h3 className="ai-plan-title">Plan de voyage généré</h3>
            <div className="ai-plan-content">{aiPlan}</div>
            
            <div className="buttons-group">
              <button type="button" className="btn btn-success" onClick={handleSaveTrip}>
                Sauvegarder ce voyage
              </button>
            </div>
          </div>
        )}
      </form>

      <button 
        className="btn btn-back" 
        onClick={() => navigate('/dashboard')}
      >
        &larr; Retour au tableau de bord
      </button>
    </div>
  );
};

export default CreateTrip;