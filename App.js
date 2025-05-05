import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './UserAuth/SignIn';
import SignUp from './UserAuth/SignUp';
import Dashboard from './DashOptions/Dashboard';
import CreateTrip from './DashOptions/CreateTrip';
import TripList from './DashOptions/TripList';
import Profile from './DashOptions/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/trips" element={<TripList />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
