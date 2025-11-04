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
  const [collapsed, setCollapsed] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const toggleSidebar = () => setCollapsed(!collapsed);

  // Map path to title
  const pageTitles = {
    '/dashboard/statistics': 'Statistics',
    '/dashboard/productview': 'Products',
    '/dashboard/salesview': 'Sales',
    '/dashboard/categoryview': 'Categories',
    '/dashboard/wholesalerview': 'Wholesalers',
    '/dashboard/profile': 'Profile',
    '/dashboard': 'Dashboard',
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
    <Box sx={{ display: 'flex', }}>
      {/* Top Navbar */}
      <AppBar
        position="fixed" 
        sx={{
          
           width: { 
            xs: 'calc(100% - 48px)',
            sm: `calc(100% - ${collapsed ? 116 : drawerWidth + 48}px)`
          },
          mr: '16px',
          mt: '16px',
        
          borderRadius: '16px',
          bgcolor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          color: 'text.primary',
          boxShadow: `
            0 4px 20px 0 rgba(0, 0, 0, 0.1),
            0 2px 10px 0 rgba(0, 0, 0, 0.05),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.9)
          `,
          zIndex: 1299,
          transition: (theme) =>
            theme.transitions.create(['margin', 'width', 'transform'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `
              0 6px 30px 0 rgba(0, 0, 0, 0.12),
              0 3px 15px 0 rgba(0, 0, 0, 0.08),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.9)
            `,
          },
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {currentTitle}
            </Typography>
          </Box>

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
        sx={{
          width: { sm: collapsed ? 80 : drawerWidth },
          flexShrink: 0,
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRight: '1px solid rgba(255, 255, 255, 0.8)',
            },
          }}
        >
          <Sidebar 
            onLogout={handleLogoutClick} 
            collapsed={collapsed} 
            toggleSidebar={toggleSidebar} 
          />
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            zIndex: 1300,
            '& .MuiDrawer-paper': {
              position: 'fixed',
              top: '16px',
              left: '16px',
              width: collapsed ? 80 : drawerWidth,
              height: 'calc(100vh - 32px)',
              transition: (theme) =>
                theme.transitions.create(['width', 'transform'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              overflow: 'hidden',
              zIndex: 1300, // Ensure it's above other elements
            },
          }}
          open
        >
          <Sidebar 
            onLogout={handleLogoutClick} 
            collapsed={collapsed} 
            toggleSidebar={toggleSidebar} 
          />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          
         width: { 
            xs: 'calc(100% - 32px)',
            sm: `calc(100% - ${collapsed ? 104 : drawerWidth + 32}px)`
          },
          ml:"15px",
          pl: { xs: 0, sm: '16px' },
          mt: '100px',
          minHeight: 'calc(100vh - 116px)',
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          overflowX: 'hidden',
          backgroundColor: 'transparent',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ 
          height: '100%',
          width: '100%',
          p: 0,
          // pl: { xs: 0.1, sm: 0 },
          pr: { xs: 2, sm: 2 },
          pt: 3,
          pb: 3,
          position: 'relative',
          overflowY: 'auto',
        }}>
          <Routes>
          <Route path="/" element={<Statistics />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="productview" element={<Productview />} />
          <Route path="salesview" element={<Salesview />} />
          <Route path="categoryview" element={<Categoryview />} />
          <Route path="wholesalerview" element={<Wholesalerview />} />
          <Route path="profile" element={<Profile />} />
          <Route path="dashboard/statistics" element={<Statistics />} />
          <Route path="dashboard/productview" element={<Productview />} />
          <Route path="dashboard/salesview" element={<Salesview />} />
          <Route path="dashboard/categoryview" element={<Categoryview />} />
            <Route path="dashboard/wholesalerview" element={<Wholesalerview />} />
            <Route path="dashboard/profile" element={<Profile />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
