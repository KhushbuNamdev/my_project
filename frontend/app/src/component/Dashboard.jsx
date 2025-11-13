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
import { useLocation, useNavigate, Outlet, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import Statistics from "../layout/statistics"
import Productview from '../layout/product/productview.jsx';
import Wholesalerview from '../layout/wholesaler/wholesalerview.jsx';
import Categoryview from '../layout/categories/categoryview.jsx';
import Salesview from '../layout/sales/salesview.jsx';
import Profilepage from '../layout/profile/profilepage.jsx';
import InventoryView from '../layout/inventory/inventoryview.jsx';
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
    '/dashboard/profilepage': 'Profilepage',
    "/dashboard/inventoryview":"Inventory",
    '/dashboard': 'Dashboard',
  };

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  // Avatar Menu handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/dashboard/profilepage');
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
    height: "70px",
    width: {
      xs: 'calc(70% - 40px)',
      sm: `calc(100% - ${collapsed ? 150 : drawerWidth + 75}px)`
    },
    mt: "20px",
    ml: "10px",
    mr: "40px",
    borderRadius: '16px',
    color: 'text.primary',
    zIndex: 1299,
    backdropFilter: 'blur(20px)',
    boxShadow: `
      0 4px 20px 0 rgba(0, 0, 0, 0.1),
      0 2px 10px 0 rgba(0, 0, 0, 0.05),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.9)
    `,
    background: `
      radial-gradient(circle at 20% 40%, rgba(66, 133, 244, 0.25) 0%, rgba(66, 133, 244, 0.1) 60%, rgba(255, 255, 255, 0.05) 100%),
      linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(255,255,255,0.6))
    `, // 🌈 Gradient background
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
          <Box >
          
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 ,  }}>
              {currentTitle}
            </Typography>
          </Box>

          {/* Avatar dropdown */}
          <IconButton onClick={handleMenuOpen} sx={{  
       
ml:"90%",
position:"fixed"
          }}>
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
              left: '11px',
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
          background:"rgba(0, 217, 255, 0.8)",
        width: {
      xs: 'calc(100% - 40px)',
      sm: collapsed
        ? 'calc(100% - 186px)' // 116 (collapsed width) + 70 (extra margin)
        : `calc(100% - ${drawerWidth + 70}px)`, // 240 + 70
    },
          ml:"1px",
          pl: { xs: 0, sm: '16px' },
          //mt: '100px',
          mt:"70px",
          minHeight: 'calc(132vh - 152px)',
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
             <Route path="profilepage" element={<Profilepage />} />
            <Route path="inventoryview" element={<InventoryView/>} />
   



            {/* Redirect any unmatched routes to the dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
