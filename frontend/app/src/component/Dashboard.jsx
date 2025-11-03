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
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate, Outlet, Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import Statistics from "../layout/statistics"
import Productview from '../layout/product/productview.jsx';
import Wholesalerview from '../layout/wholesaler/wholesalerview.jsx';
import Categoryview from '../layout/categories/categoryview.jsx';
import Salesview from '../layout/sales/salesview.jsx';
import Profile from '../layout/profile/profilepage.jsx';

const drawerWidth = 240;

const DashboardLayout = ({ onLogout }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Map path to title
  const pageTitles = {
    '/statistics': 'Statistics',
    '/productview': 'Products',
    '/salesview': 'Sales',
    '/categoryview': 'Categories',
    '/wholesalerview': 'Wholesalers',
    '/profile': 'Profile',
  };

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  // Avatar Menu handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    if (onLogout) onLogout();
    navigate('/login');
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
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {currentTitle}
          </Typography>

          {/* Avatar dropdown */}
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar alt="User" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
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
          <Sidebar onLogout={handleLogoutClick} />
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <Sidebar onLogout={handleLogoutClick} />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Routes>
          <Route path="/" element={<Statistics />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="productview" element={<Productview />} />
          <Route path="salesview" element={<Salesview />} />
          <Route path="categoryview" element={<Categoryview />} />
          <Route path="wholesalerview" element={<Wholesalerview />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
