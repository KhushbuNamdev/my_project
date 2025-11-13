import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  styled,
  Tooltip,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import StoreIcon from '@mui/icons-material/Store';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import image from '../assets/image.png';

import InventoryIcon from '@mui/icons-material/Inventory';
const menuItems = [
  { text: 'Statistics', icon: <BarChartIcon />, path: '/dashboard/statistics' },
  { text: 'Products', icon: <StoreIcon />, path: '/dashboard/productview' },
  { text: 'Sales', icon: <AttachMoneyIcon />, path: '/dashboard/salesview' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/dashboard/categoryview' },
  { text: 'Wholesalers', icon: <PeopleIcon />, path: '/dashboard/wholesalerview' },
  {text:"inventory", icon:<InventoryIcon/>, path:"/dashboard/inventoryview"}
];

const Sidebar = ({ onLogout, collapsed, toggleSidebar }) => {
  const location = useLocation();

  const StyledSidebar = styled(Box)(({ theme }) => ({
    '& *::-webkit-scrollbar': {
      display: 'none',
    },
    '& *': {
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
    },
    width: collapsed ? '80px' : '240px',
    height: 'calc(100vh - 32px)',
    position: 'fixed',
    left: '16px',
    top: '16px',
    borderRadius: '16px',
    padding: theme.spacing(2, 1.5, 2, 2),

// background:"#FFFFFF",
 //background:"rgba(5, 5, 5, 0.34)",
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: `
      0 10px 40px -10px rgba(31, 38, 135, 0.2),
      0 6px 20px -5px rgba(31, 38, 135, 0.1),
      inset 1px 1px 0 0 rgba(255, 255, 255, 0.6),
      -5px 5px 25px -5px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(0, 0, 0, 0.02)
    `,
    transform: 'translateZ(0)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateZ(0) translateY(-4px)',
      boxShadow: `
        0 16px 50px -10px rgba(31, 38, 135, 0.25),
        0 10px 30px -5px rgba(31, 38, 135, 0.15),
        inset 1px 1px 0 0 rgba(255, 255, 255, 0.7),
        -8px 8px 30px -5px rgba(181, 94, 94, 0.12),
        0 0 0 1px rgba(0, 0, 0, 0.03)
      `,
    },
    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
    zIndex: 1200,
    overflow: 'hidden',
    transform: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '&:hover': {
      transform: 'translateY(-4px) scale(1.004)',
      boxShadow: `
        0 12px 40px 0 rgba(31, 38, 135, 0.2),
        0 8px 20px 0 rgba(31, 38, 135, 0.12),
        inset 1px 1px 0 0 rgba(255, 255, 255, 0.6),
        -12px 12px 24px -8px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(0, 0, 0, 0.04)
      `,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  }));

  return (
    <StyledSidebar>
      
        {/* Top Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            {!collapsed && (
              <Box
                
              >
                

                <img src={image} alt="Example" width="150" />
              </Box>
            )}
            <IconButton 
              onClick={toggleSidebar}
              sx={{
                ml: 'auto',
                color: '#1F2937',
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                '&:hover': {
                  background: '#4285F4',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.1)' }} />
        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <Tooltip title={collapsed ? item.text : ''} placement="right">
              
                <ListItemButton
  component={Link}
  to={item.path}
  selected={location.pathname === item.path}
  sx={{
    borderRadius: '12px',
    mb: 1,
    px: 2.5,
    minHeight: 48,
    justifyContent: collapsed ? 'center' : 'flex-start',
    color: location.pathname === item.path ? '#fafafa' : '#1F2937',
    '&.Mui-selected': {
      backgroundColor: '#4285F4',
      color: '#ffffffff',
      '& .MuiListItemIcon-root': {
        color: '#fafafa',
      },
      '&:hover': {
        backgroundColor: '#4285F4',
        color: '#fafafa',
      },
    },
    '&:hover': {
      backgroundColor: 'rgba(66,133,244,0.1)',
      color: '#1F2937',
    },
  }}
>
  <ListItemIcon
    sx={{
      minWidth: 0,
      mr: collapsed ? 'auto' : 3,
      justifyContent: 'center',
      color:
        location.pathname === item.path
          ? '#fafafa'
          : 'rgba(31, 41, 55, 0.7)',
      transition: 'color 0.2s',
    }}
  >
    {item.icon}
  </ListItemIcon>
  <ListItemText
    primary={item.text}
    sx={{
      opacity: collapsed ? 0 : 1,
      transition: 'opacity 0.2s',
      fontWeight: location.pathname === item.path ? 600 : 'normal',
    }}
  />
</ListItemButton>

              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom Logout */}
      <Box sx={{ pb: 2 }}>
        <Divider sx={{ mb: 1 }} />
        <ListItemButton
          onClick={onLogout}
          sx={{ '&:hover': { bgcolor: '#4285F4' } }}
        >
          <ListItemIcon sx={{  }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
  
    </StyledSidebar>
  );
};

export default Sidebar;
