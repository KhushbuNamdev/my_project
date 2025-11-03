


import React from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import Statistics from '../layout/statistics';
import Productview from '../layout/product/productview';
import Wholesalerview from '../layout/wholesaler/wholesalerview';
import Categoryview from '../layout/categories/categoryview';
import Salesview from '../layout/sales/salesview';
import Profile from '../layout/profile/profilepage'; // 👈 create this page

const drawerWidth = 240;

const DashboardLayout = ({ onLogout }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null); // for dropdown
  const open = Boolean(anchorEl);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 Map pathnames to titles
  const pageTitles = {
    '/statistics': 'Statistics',
    '/productview': 'Product',
    '/salesview': 'Sales',
    '/categoryview': 'Categories',
    '/wholesalerview': 'Wholesaler',
    '/settings': 'Settings',
    '/profile': 'Profile',
  };

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  // 👇 Dropdown menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    navigate('/login'); // 👈 redirect to login
    if (onLogout) onLogout(); // optional callback
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'error.main',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            ☰
          </IconButton>

          {/* 👇 Dynamic Title */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {currentTitle}
          </Typography>

          {/* Avatar + Dropdown */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: 'white',
                color: 'error.main',
                fontWeight: 'bold',
                cursor: 'pointer',
                mr: 1,
              }}
              onClick={handleMenuOpen}
            >
              A
            </Avatar>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Section */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <Sidebar onLogout={onLogout} />
        </Drawer>

        {/* Permanent Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <Sidebar onLogout={onLogout} />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#fff3f3',
          p: 3,
          mt: 8,
          minHeight: '100vh',
        }}
      >
        <Routes>
  <Route path="/statistics" element={<Statistics />} />
  <Route path="/productview" element={<Productview />} />
  <Route path="/wholesalerview" element={<Wholesalerview />} />
  <Route path="/categoryview" element={<Categoryview />} />
  <Route path="/salesview" element={<Salesview />} />
  <Route path="/profile" element={<Profile />} />
  <Route
    path="/"
    element={<Typography variant="h4">Welcome to Dashboard 🎉</Typography>}
  />
</Routes>
      </Box>
    </Box>
  );
};

export default DashboardLayout;