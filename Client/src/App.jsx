import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Extract token from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      console.log('Extracted Token:', token); // Debug
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, '/dashboard');
    }

    // Fetch user data if token exists
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token in localStorage');
        console.log('Fetching user with token:', token); // Debug
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('User Data:', res.data); // Debug
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user:', error.message); // Debug
        localStorage.removeItem('token');
      } finally {
        setLoading(false); // End loading
      }
    };

    if (localStorage.getItem('token')) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading state

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;