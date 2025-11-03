// import React, { useState } from 'react';
// import { Box, Paper, Typography, TextField, Button, Avatar } from '@mui/material';

// const LoginPage = ({ onLogin }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (email && password) {
//       onLogin();
//     } else {
//       alert('Please enter email and password');
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         p: 2,
//         background: 'linear-gradient(180deg, #fecaca 0%, #fee2e2 50%, #ffffff 100%)',
//       }}
//     >
//       <Paper
//         elevation={10}
//         sx={{
//           p: 4,
//           width: 380,
//           borderRadius: 3,
//           background: 'rgba(255, 255, 255, 0.2)', // semi-transparent white
//           backdropFilter: 'blur(12px)', // glass blur effect
//           WebkitBackdropFilter: 'blur(12px)', // Safari support
//           boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
//           border: '1px solid rgba(255, 255, 255, 0.3)',
//         }}
//       >
//         <Box textAlign="center" mb={3}>
//           <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 1 }}>A</Avatar>
//           <Typography variant="h5" fontWeight="bold" color="error.main">
//             Admin Login
//           </Typography>
//         </Box>

//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Email"
//             type="email"
//             fullWidth
//             margin="normal"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             InputProps={{
//               sx: {
//                 backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                 borderRadius: 1,
//               },
//             }}
//           />
//           <TextField
//             label="Password"
//             type="password"
//             fullWidth
//             margin="normal"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             InputProps={{
//               sx: {
//                 backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                 borderRadius: 1,
//               },
//             }}
//           />
//           <Button
//             fullWidth
//             type="submit"
//             variant="contained"
//             color="error"
//             sx={{ mt: 3, fontWeight: 'bold', py: 1.2 }}
//           >
//             Sign In
//           </Button>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default LoginPage;




import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../Slice/authSlice'; // adjust path as needed
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phoneNumber || !password) {
      alert('Please enter phone number and password');
      return;
    }

    dispatch(login({ phoneNumber, password }))
      .unwrap()
      .then(() => {
        navigate('/dashboard'); // redirect after success
      })
      .catch((err) => {
        alert(err || 'Login failed');
      });
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
            type="text"
            fullWidth
            margin="normal"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            InputProps={{
              sx: { backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 1 },
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              sx: { backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 1 },
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="error"
            sx={{ mt: 3, fontWeight: 'bold', py: 1.2 }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          {error && (
            <Typography variant="body2" color="error" mt={2} textAlign="center">
              {error}
            </Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
