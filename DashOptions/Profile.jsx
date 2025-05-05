import React, { useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, signOut } from 'firebase/auth';
import '../beauty/Profile.css';

const Profile = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/signin'); // Redirige vers la page de connexion
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage('Aucun utilisateur connecté.');
      setMessageType('error');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("Les nouveaux mots de passe ne correspondent pas.");
      setMessageType('error');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage("Mot de passe mis à jour avec succès !");
      setMessageType('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      setMessage(`Erreur : ${error.message}`);
      setMessageType('error');
    }
  };

  return (
    <div className="profile-container">
      <h2>Mon profil</h2>
      
      <div className="user-info">
        <p>Email : {user?.email}</p>
      </div>

      <h3>Changer de mot de passe</h3>
      <form className="password-form" onSubmit={handleChangePassword}>
        <div className="form-group">
          <label htmlFor="current-password">Ancien mot de passe</label>
          <input
            id="current-password"
            className="form-control"
            type="password"
            placeholder="Saisissez votre mot de passe actuel"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="new-password">Nouveau mot de passe</label>
          <input
            id="new-password"
            className="form-control"
            type="password"
            placeholder="Saisissez votre nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirm-password">Confirmation du mot de passe</label>
          <input
            id="confirm-password"
            className="form-control"
            type="password"
            placeholder="Confirmez votre nouveau mot de passe"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        
        <button className="btn btn-primary" type="submit">Changer le mot de passe</button>
      </form>

      {message && (
        <div className={`message ${messageType === 'success' ? 'message-success' : 'message-error'}`}>
          {message}
        </div>
      )}

      <div className="button-group">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Retour au tableau de bord</button>
        <button className="btn btn-danger" onClick={handleLogout}>Déconnexion</button>
      </div>
    </div>
  );
};

export default Profile;