import React, { useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, signOut } from 'firebase/auth';

const Profile = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/signin'); // Redirige vers la page de connexion
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage('Aucun utilisateur connecté.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage("Mot de passe mis à jour avec succès !");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      setMessage(`Erreur : ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Mon profil</h2>
      <p>Email : {user?.email}</p>

      <h3>Changer de mot de passe</h3>
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="Ancien mot de passe"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Confirmez le nouveau mot de passe"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Changer le mot de passe</button>
      </form>

      {message && <p>{message}</p>}

      <button onClick={() => navigate('/dashboard')}>Retour</button>
      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  );
};

export default Profile;
