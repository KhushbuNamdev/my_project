import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../Slice/authSlice';
import { Box, Paper, Typography, TextField, Button, Avatar } from '@mui/material';

const LoginPage = () => {
  const [phoneNumber, setPhonenumber] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error: authError, isAuthenticated } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear any previous errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

 // In loginpage.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await dispatch(login({ phoneNumber, password })).unwrap();
    // Navigation will be handled by the useEffect that watches isAuthenticated
  } catch (error) {
    setError(error || 'Login failed');
  }
};

  const errorToDisplay = localError || authError;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        background: 'linear-gradient(180deg, #fecaca 0%, #fee2e2 50%, #ffffff 100%)',
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: 380,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <Box textAlign="center" mb={3}>
          <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 1 }}>A</Avatar>
          <Typography variant="h5" fontWeight="bold" color="error.main">
            Admin Login
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
         <TextField
  label="Phone Number"
  type="tel"
  fullWidth
  margin="normal"
  value={phoneNumber}
  onChange={(e) => setPhonenumber(e.target.value)}
  slotProps={{
    sx: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: 1,
    },
  }}
  disabled={loading}
  inputProps={{
    inputMode: 'numeric',
    pattern: '[0-9]*',
    maxLength: 15
  }}
/>

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: 1,
              },
            }}
            disabled={loading}
          />

          {errorToDisplay && (
            <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
              {errorToDisplay}
            </Typography>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="error"
            sx={{ mt: 3, fontWeight: 'bold', py: 1.2 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
