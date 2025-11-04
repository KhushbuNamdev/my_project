import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);



// import React, { useEffect, useState } from 'react';
// import { Box, Typography, CircularProgress, Alert, Snackbar } from '@mui/material';
// import { useDispatch, useSelector } from 'react-redux';
// import { getAllUsers, createUser } from '../../Slice/userSlice';
// import MDDataGrid from '../../custom/MDdatagrid';
// import MDButton from '../../custom/MDbutton';
// import MDSearchBar from '../../custom/MDsearchbar';
// import CreateWholesalerDialog from './cerateWholesaler';

// const Wholesalerview = () => {
//   const dispatch = useDispatch();
//   const { users, loading, error } = useSelector((state) => state.user);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   const handleOpenDialog = () => setOpenDialog(true);
//   const handleCloseDialog = () => setOpenDialog(false);

//   const handleCreateWholesaler = async (wholesalerData) => {
//     try {
//       // Prepare the data according to server expectations
//       const userData = {
//         name: wholesalerData.name,
//         businessName: wholesalerData.businessName,
//         gstNumber: wholesalerData.gstNumber,
//         phoneNumber: wholesalerData.phoneNumber,
//         email: `${wholesalerData.phoneNumber}@example.com`, // Add a dummy email if required
//         password: 'defaultPassword123!', // Add a default password (should be handled securely in production)
//         role: 'wholesaler',
//         // Address should be an object with required fields
//         address: {
//           street: wholesalerData.address, // Using the address string as street
//           city: 'Unknown', // Add required city field
//           state: 'Unknown', // Add required state field
//           country: 'Unknown', // Add required country field
//           pincode: '000000' // Add required pincode field
//         }
//       };

//       console.log('Sending user data:', userData); // For debugging
      
//       const response = await dispatch(createUser(userData)).unwrap();
      
//       setSnackbar({
//         open: true,
//         message: 'Wholesaler created successfully!',
//         severity: 'success'
//       });
      
//       handleCloseDialog();
//       // Refresh the wholesalers list
//       dispatch(getAllUsers());
//     } catch (error) {
//       console.error('Error creating wholesaler:', error);
//       setSnackbar({
//         open: true,
//         message: error?.message || 'Failed to create wholesaler. Please check all required fields.',
//         severity: 'error'
//       });
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   useEffect(() => {
//     dispatch(getAllUsers());
//   }, [dispatch]);

//   // Filter only users whose role is "wholesaler"
//   const wholesalers = users.filter((user) => user.role === 'wholesaler');

//   // Define columns for the DataGrid
//   const columns = [
//     { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
//     { field: 'phoneNumber', headerName: 'Phone Number', flex: 1, minWidth: 150 },
//     { field: 'businessName', headerName: 'Business Name', flex: 1, minWidth: 150 },
//     { field: 'gstNumber', headerName: 'GST Number', flex: 1, minWidth: 150 },
//     { field: 'country', headerName: 'Country', flex: 1, minWidth: 120 },
//   ];

//   // Transform filtered wholesalers data for DataGrid
//   const rows = wholesalers.map((user, index) => ({
//     id: user._id || index,
//     name: user.name || 'N/A',
//     phoneNumber: user.phoneNumber || 'N/A',
//     businessName: user.businessName || 'N/A',
//     gstNumber: user.gstNumber || 'N/A',
//     country: user.address?.country || 'N/A',
//   }));

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Alert severity="error" sx={{ m: 2 }}>
//         {error}
//       </Alert>
//     );
//   }

//   const [searchTerm, setSearchTerm] = React.useState('');

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value.toLowerCase());
//   };

//   // Filter rows based on search term
//   const filteredRows = React.useMemo(() => {
//     if (!searchTerm) return rows;
    
//     return rows.filter(row => 
//       Object.values(row).some(
//         value => 
//           value && 
//           value.toString().toLowerCase().includes(searchTerm)
//       )
//     );
//   }, [rows, searchTerm]);

//   return (
//     <Box p={3}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <MDSearchBar 
//           value={searchTerm}
//           onChange={handleSearch}
//           placeholder="Search wholesalers..."
//         />
//         <MDButton onClick={handleOpenDialog} variant="contained" color="primary">
//           Create Wholesaler
//         </MDButton>
//       </Box>
      
//       <MDDataGrid rows={filteredRows} columns={columns} loading={loading} />
      
//       <CreateWholesalerDialog 
//         open={openDialog}
//         onClose={handleCloseDialog}
//         onSubmit={handleCreateWholesaler}
//       />
      
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert 
//           onClose={handleCloseSnackbar} 
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default Wholesalerview;
