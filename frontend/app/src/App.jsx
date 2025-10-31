
import React, { useState , useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Homepage/loginpage';
import Dashboard from './component/Dashboard';
 import  "./App.css"
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
useEffect(() => {
    console.log('Environment:', {
      apiUrl: import.meta.env.VITE_API_URL,
      env: import.meta.env.VITE_ENV
    });
  }, []);
  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          <Route path="*" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
        ) : (
          <Route path="*" element={<Dashboard onLogout={() => setIsLoggedIn(false)} />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
