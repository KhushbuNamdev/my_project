import React from 'react';
import { Typography, Box } from '@mui/material';

const Profile = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="body1">Welcome to your profile page 👤</Typography>
    </Box>
  );
};

export default Profile;
