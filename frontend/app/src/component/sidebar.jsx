// import React from 'react';
// import {
//   Box,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Typography,
//   Divider,
// } from '@mui/material';
// import AcUnitIcon from '@mui/icons-material/AcUnit';
// import LogoutIcon from '@mui/icons-material/Logout';
// const Sidebar = ({ onLogout }) => {
//   const menuItems = [
//     { text: 'Statistics', icon: <AcUnitIcon /> },
//     { text: 'Product', icon: <AcUnitIcon /> },
//     { text: 'Sales', icon: <AcUnitIcon /> },
//     { text: 'Categories', icon: <AcUnitIcon /> },
//     { text: 'Wholesaler', icon: <AcUnitIcon /> },
//     { text: 'Settings', icon: <AcUnitIcon /> },
//   ];

//   return (
//     <Box
//       sx={{
//         textAlign: 'center',
//         height: '100%',
//         position: 'relative',
//         bgcolor: '#fff3f3', // 💗 same as dashboard background
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//       }}
//     >
//     <Box sx={{ textAlign: 'center', height: '100%', position: 'relative' }}>
//       <Typography
//         variant="h6"
//         sx={{ my: 2, fontWeight: 'bold', color: 'error.main' }}
//       >
//         Admin Panel
//       </Typography>
//       <Divider />
//       <List>
//         {menuItems.map((item) => (
//           <ListItem key={item.text} disablePadding>
//             <ListItemButton sx={{ textAlign: 'left' }}>
//               <ListItemIcon sx={{ color: 'error.main' }}>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>

//       <Box sx={{ position: 'absolute', bottom: 20, width: '100%' }}>
//         <Divider />
//         <ListItemButton onClick={onLogout}>
//           <ListItemIcon sx={{ color: 'error.main' }}>
//           <LogoutIcon />
//           </ListItemIcon>
//           <ListItemText primary="Logout" />
//         </ListItemButton>
//       </Box>
//     </Box>
//     </Box>
//   );
// };

// export default Sidebar;
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
import { Link } from 'react-router-dom';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({ onLogout }) => {
  const menuItems = [
    { text: 'Statistics', icon: <AcUnitIcon />, path: '/statistics' },
    { text: 'Product', icon: <AcUnitIcon />, path: '/productview' },
    { text: 'Sales', icon: <AcUnitIcon />, path: '/salesview' },
    { text: 'Categories', icon: <AcUnitIcon />, path: '/categoryview' },
    { text: 'Wholesaler', icon: <AcUnitIcon />, path: '/wholesalerview' },
    { text: 'Settings', icon: <AcUnitIcon />, path: '/settings' },
  ];

  return (
    <Box
      sx={{
        textAlign: 'center',
        height: '100%',
        position: 'relative',
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
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  textAlign: 'left',
                  '&:hover': { bgcolor: '#fde4e4' },
                }}
              >
                <ListItemIcon sx={{ color: 'error.main' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
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
