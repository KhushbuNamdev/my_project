import React, { useEffect } from 'react';
import { Box, Typography, Avatar, Paper, Grid, Button, Divider, Chip, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../../Slice/userSlice';
import { Edit as EditIcon } from '@mui/icons-material';

const ProfileContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  // background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
  padding: theme.spacing(4),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.9)',
  boxShadow: '0 8px 32px 0 rgba(254, 202, 202, 0.25)',
  width: '100%',
  maxWidth: '1000px',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(254, 202, 202, 0.4)',
  },
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  padding: theme.spacing(6, 4, 2, 4),
  color: theme.palette.primary.contrastText,
  position: 'relative',
  textAlign: 'center',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: '150px',
  height: '150px',
  margin: '0 auto',
  border: '4px solid white',
  boxShadow: theme.shadows[3],
  marginTop: '-75px',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'all 0.3s ease',
  },
}));

const EditButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
}));

const InfoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  '& .MuiDivider-root': {
    margin: theme.spacing(3, 0),
    backgroundColor: theme.palette.divider,
  },
}));

const InfoItem = ({ label, value, icon: Icon }) => (
  <Box mb={3}>
    <Box display="flex" alignItems="center" mb={0.5}>
      {Icon && <Icon color="primary" sx={{ mr: 1 }} />}
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary' }}>
      {value || 'Not provided'}
    </Typography>
  </Box>
);

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => ({
    user: state.user.currentUser,
    loading: state.user.loading,
  }));

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ProfileContainer>
      <GlassCard elevation={3}>
        <ProfileHeader>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {user?.name || 'User Profile'}
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            {user?.role || 'Member'}
          </Typography>
          <EditButton variant="contained" startIcon={<EditIcon />}>
            Edit Profile
          </EditButton>
        </ProfileHeader>

        <Box textAlign="center" mt={-8} mb={4}>
          <ProfileAvatar
            alt={user?.name || 'User'}
            src={user?.avatar || '/default-avatar.png'}
          />
          <Chip
            label={user?.isActive ? 'Active' : 'Inactive'}
            color={user?.isActive ? 'success' : 'default'}
            size="small"
            sx={{ mt: 2, color: 'white', fontWeight: 600 }}
          />
        </Box>

        <InfoSection>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                Personal Information
              </Typography>
              <InfoItem 
                label="Email Address" 
                value={user?.email}
              />
              <InfoItem 
                label="Phone Number" 
                value={user?.phone || 'Not provided'}
              />
              <InfoItem 
                label="Member Since" 
                value={formatDate(user?.createdAt)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                Work Information
              </Typography>
              <InfoItem 
                label="Department" 
                value={user?.department || 'Not specified'}
              />
              <InfoItem 
                label="Position" 
                value={user?.position || 'Not specified'}
              />
              <InfoItem 
                label="Employee ID" 
                value={user?.employeeId || 'N/A'}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              About
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.bio || 'No bio provided. Click edit to add information about yourself.'}
            </Typography>
          </Box>
        </InfoSection>
      </GlassCard>
    </ProfileContainer>
  );
};

export default Profile;