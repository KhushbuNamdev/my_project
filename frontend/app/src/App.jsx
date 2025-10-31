
// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { initializeAuth } from './Slice/authSlice';
// import LoginPage from './Homepage/loginpage';
// import Dashboard from './component/Dashboard';
// import "./App.css";

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);
//   const location = useLocation();

//   if (!isInitialized) {
//     return <div>Loading...</div>; // Or a loading spinner
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };

// // Public Route Component
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const location = useLocation();

//   if (isAuthenticated) {
//     const from = location.state?.from?.pathname || '/';
//     return <Navigate to={from} replace />;
//   }

//   return children;
// };

// const App = () => {
//   const dispatch = useDispatch();
//   const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

//   useEffect(() => {
//     // Initialize authentication state
//     dispatch(initializeAuth());

//     // Log environment variables
//     console.log('Environment:', {
//       apiUrl: import.meta.env.VITE_API_URL,
//       env: import.meta.env.VITE_ENV
//     });
//   }, [dispatch]);

//   // Show loading state while initializing
//   if (!isInitialized) {
//     return <div>Loading...</div>; // Or a loading spinner
//   }

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={
//           <PublicRoute>
//             <LoginPage />
//           </PublicRoute>
//         } />
        
//         <Route path="/*" element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         } />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
// In App.jsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeAuth } from './Slice/authSlice';
import LoginPage from './Homepage/loginpage';
import Dashboard from './component/Dashboard';
import "./App.css";
const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" state={{ from: window.location.pathname }} replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};
export default App;