import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './pages/Login';
import RepDashboard from './pages/RepDashboard';
import CSODashboard from './pages/CSODashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserRole(currentUser.email.includes('israel') ? 'cso' : 'rep');
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/rep-dashboard"
          element={user ? <RepDashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/cso-dashboard"
          element={user && userRole === 'cso' ? <CSODashboard /> : <Navigate to="/login" />}
        />
        <Route path="/" element={user ? <Navigate to={userRole === 'cso' ? '/cso-dashboard' : '/rep-dashboard'} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
