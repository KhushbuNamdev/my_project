import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, IconButton, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, createUser } from '../../Slice/userSlice';
import MDDataGrid from '../../custom/MDdatagrid';
import MDButton from '../../custom/MDbutton';
import MDSearchBar from '../../custom/MDsearchbar';
import CreateWholesalerDialog from './cerateWholesaler';

const Wholesalerview = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleCreateWholesaler = async (wholesalerData) => {
    try {
      // Prepare the data according to server expectations
      const userData = {
        name: wholesalerData.name,
        businessName: wholesalerData.businessName,
        gstNumber: wholesalerData.gstNumber,
        phoneNumber: wholesalerData.phoneNumber,
        email: `${wholesalerData.phoneNumber}@example.com`, // Add a dummy email if required
        password: 'defaultPassword123!', // Add a default password (should be handled securely in production)
        role: 'wholesaler',
        address: wholesalerData.address // Store as simple string
      };

      console.log('Sending user data:', userData); // For debugging
      
      const response = await dispatch(createUser(userData)).unwrap();
      
      setSnackbar({
        open: true,
        message: 'Wholesaler created successfully!',
        severity: 'success'
      });
      
      handleCloseDialog();
      // Refresh the wholesalers list
      dispatch(getAllUsers());
    } catch (error) {
      console.error('Error creating wholesaler:', error);
      setSnackbar({
        open: true,
        message: error?.message || 'Failed to create wholesaler. Please check all required fields.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Filter only users whose role is "wholesaler"
  const wholesalers = users.filter((user) => user.role === 'wholesaler');


const columns = [
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
  { field: 'phoneNumber', headerName: 'Phone Number', flex: 1, minWidth: 150 },
  { field: 'businessName', headerName: 'Business Name', flex: 1, minWidth: 150 },
  { 
    field: 'address', 
    headerName: 'Address', 
    flex: 1, // ✅ reduced from 2 → 1 to decrease space
    minWidth: 180,
    valueGetter: (params) => {
      const address = params.row?.address;
      if (!address) return 'N/A';
      if (typeof address === 'string') return address;
      if (typeof address === 'object') {
        const { street, city, state, pincode, country } = address;
        return [street, city, state, pincode, country].filter(Boolean).join(', ');
      }
      return 'N/A';
    },
    renderCell: (params) => {
      const address = params.row?.address;
      if (!address) return 'N/A';
      if (typeof address === 'string') return address;
      if (typeof address === 'object') {
        const { street, city, state, pincode, country } = address;
        return (
          <div style={{ whiteSpace: 'pre-line' }}>
            {[street, `${city}, ${state}`, pincode, country]
              .filter(Boolean)
              .join('\n')}
          </div>
        );
      }
      return 'N/A';
    },
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 100, // ✅ reduced from 120 to tighten spacing
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <div style={{ display: 'flex', gap: '4px' }}> {/* ✅ reduced gap from 8px to 4px */}
        <IconButton 
          size="small" 
          color="primary"
          onClick={() => handleEdit(params.row)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    ),
  },
];

  // Handle edit action
  const handleEdit = (row) => {
    // Implement edit functionality here
    console.log('Edit row:', row);
    // You can open a dialog with the row data for editing
  };

  // Handle delete action
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this wholesaler?')) {
      try {
        // Implement delete functionality here
        // await dispatch(deleteUser(id)).unwrap();
        // dispatch(getAllUsers()); // Refresh the list
        setSnackbar({
          open: true,
          message: 'Wholesaler deleted successfully!',
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: error?.message || 'Failed to delete wholesaler',
          severity: 'error'
        });
      }
    }
  };

  // Transform filtered wholesalers data for DataGrid
  const rows = wholesalers.map((user) => ({
    id: user._id,
    name: user.name || 'N/A',
    phoneNumber: user.phoneNumber || 'N/A',
    businessName: user.businessName || 'N/A',
    address: user.address || {},
  }));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Filter rows based on search term
  const filteredRows = React.useMemo(() => {
    if (!searchTerm) return rows;
    
    return rows.filter(row => 
      Object.values(row).some(
        value => 
          value && 
          value.toString().toLowerCase().includes(searchTerm)
      )
    );
  }, [rows, searchTerm]);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDSearchBar 
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search wholesalers..."
        />
        <MDButton onClick={handleOpenDialog} variant="contained" color="primary">
          Create Wholesaler
        </MDButton>
      </Box>
      
      <MDDataGrid rows={filteredRows} columns={columns} loading={loading} />
      
      <CreateWholesalerDialog 
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleCreateWholesaler}
      />
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Wholesalerview;
