import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';
import Cookies from 'js-cookie';
import { fetchCurrentUser } from './Slice/authSlice';
import './App.css';

// Lazy-loaded components
const LoginPage = React.lazy(() => import('./Homepage/loginpage'));
const Dashboard = React.lazy(() => import('./component/Dashboard'));

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const [initialLoading, setInitialLoading] = React.useState(true);

  // ✅ On app load, check if token exists in cookies and fetch current user
  useEffect(() => {
    const token = Cookies.get('token');
    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUser())
        .finally(() => setInitialLoading(false));
    } else {
      setInitialLoading(false);
    }
  }, [dispatch, isAuthenticated]);

  // ✅ Protected Route Component
  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    if (loading || initialLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      );
    }

    const token = Cookies.get('token');
    if (!isAuthenticated || !token) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  };

  // ✅ Global loading while checking authentication
  if (loading || initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      }
    >
      <Router>
        <Routes>
          {/* Login Route */}
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />}
          />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
          />

          {/* Fallback for unknown routes */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
          />
        </Routes>
      </Router>
    </Suspense>
  );
};

export default App;
