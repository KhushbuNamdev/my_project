import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../Slice/authSlice';
import MDButton from '../custom/MDbutton';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import image from '../assets/image.png';
const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading,
    error: state.auth.error,
  }));

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!phoneNumber || !password) return;

    try {
      const resultAction = await dispatch(loginUser({ phoneNumber, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // 🎨 Background gradient
        // backgroundColor: '#fecaca',
        // backgroundImage:
        //   'linear-gradient(180deg, #fecaca 0%, #fee2e2 50%, #ffffff 100%)',
        color: '#111',
        margin: 0,
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 4,
          //  backgroundColor: '#fecaca',
        // backgroundImage:
        //   'linear-gradient(180deg, #fecaca 0%, #fee2e2 50%, #ffffff 100%)',
        color: '#111',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#ef4444' }}>
          <LockOutlinedIcon />
        </Avatar>
        {/* <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', color: '#111' }}>
          <image/>
        </Typography> */}
<img src={image} alt="Example" width="200" />
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="tel"
            autoFocus
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <MDButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor:"#4285F4",
              '&:hover': { bgcolor: '#4285F4' },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
          </MDButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
