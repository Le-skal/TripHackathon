import React from 'react';
import { auth } from '../firebase';

const Profile = () => {
  const user = auth.currentUser;

  return (
    <div>
      <h2>Mon profil</h2>
      <p>Email : {user?.email}</p>
      {/* Ajoutez d'autres informations utilisateur si nécessaire */}
    </div>
  );
};

export default Profile;
