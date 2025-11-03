import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import StoreIcon from '@mui/icons-material/Store';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';

const menuItems = [
  { text: 'Statistics', icon: <BarChartIcon />, path: '/dashboard/statistics' },
  { text: 'Products', icon: <StoreIcon />, path: '/dashboard/productview' },
  { text: 'Sales', icon: <AttachMoneyIcon />, path: '/dashboard/salesview' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/dashboard/categoryview' },
  { text: 'Wholesalers', icon: <PeopleIcon />, path: '/dashboard/wholesalerview' },
];

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  return (
    <Box
      sx={{
        textAlign: 'center',
        height: '100%',
        bgcolor: '#fff3f3',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Top Section */}
      <Box>
        <Typography
          variant="h6"
          sx={{ my: 2, fontWeight: 'bold', color: 'error.main' }}
        >
          Admin Panel
        </Typography>
        <Divider />
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    textAlign: 'left',
                    bgcolor: isActive ? '#fde4e4' : 'transparent',
                    '&:hover': { bgcolor: '#fde4e4' },
                  }}
                >
                  <ListItemIcon sx={{ color: 'error.main' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Logout */}
      <Box sx={{ pb: 2 }}>
        <Divider sx={{ mb: 1 }} />
        <ListItemButton
          onClick={onLogout}
          sx={{ '&:hover': { bgcolor: '#fde4e4' } }}
        >
          <ListItemIcon sx={{ color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
