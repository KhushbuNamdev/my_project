import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Paper, Typography, TextField, Button, Avatar } from '@mui/material';
import { login } from '../Slice/authSlice'; // ✅ import your login action

const LoginPage = ({ onLogin }) => {
  const [phoneNumber, setPhonenumber] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch(); // ✅ initialize dispatch

  const handleSubmit = (e) => {
    e.preventDefault();

    if (phoneNumber && password) {
      // ✅ dispatch Redux action
      dispatch(login({ phoneNumber, password }))
        .unwrap() // optional: unwrap promise if using createAsyncThunk
        .then(() => {
          if (onLogin) onLogin(); // optional callback (navigation, etc.)
        })
        .catch((err) => {
          console.error('Login failed:', err);
          alert('Invalid phone number or password');
        });
    } else {
      alert('Please enter phone number and password');
    }
  };

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
            type="number"
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
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="error"
            sx={{ mt: 3, fontWeight: 'bold', py: 1.2 }}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
