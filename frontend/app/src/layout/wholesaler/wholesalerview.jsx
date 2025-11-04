





import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Snackbar, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteWholesalerDialog from './deletewholesaler';
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWholesalerId, setSelectedWholesalerId] = useState(null);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  
  const handleOpenDeleteDialog = (id) => {
    setSelectedWholesalerId(id);
    setDeleteDialogOpen(true);
  };

 const handleCloseDeleteDialog = () => {
  setDeleteDialogOpen(false);
  setSelectedWholesalerId(null);
};


  const handleDeleteSuccess = () => {
    setSnackbar({
      open: true,
      message: 'Wholesaler deleted successfully',
      severity: 'success',
    });
    // Refresh the wholesalers list
    dispatch(getAllUsers());
  };

  const handleCreateWholesaler = async (wholesalerData) => {
    try {
      // Prepare the data according to server expectations
      const userData = {
        name: wholesalerData.name,
        businessName: wholesalerData.businessName,
        gstNumber: wholesalerData.gstNumber,
        adharNumber: wholesalerData.aadharNumber, // Changed from aadharNumber to adharNumber to match backend
        phoneNumber: wholesalerData.phoneNumber,
        email: `${wholesalerData.phoneNumber}@example.com`, // Add a dummy email if required
        password: 'defaultPassword123!', // Add a default password (should be handled securely in production)
        role: 'wholesaler',
        // Address is already properly formatted in the CreateWholesaler component
        address: wholesalerData.address
      };
      
      console.log('Sending user data:', JSON.stringify(userData, null, 2)); // For debugging

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

  // Define columns for the DataGrid
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1, minWidth: 150 },
    { field: 'businessName', headerName: 'Business Name', flex: 1, minWidth: 150 },
    { field: 'gstNumber', headerName: 'GST Number', flex: 1, minWidth: 150 },
    { field: 'adharNumber', headerName: 'Aadhaar Number', flex: 1, minWidth: 150 },
    { field: 'street', headerName: 'Street Address', flex: 1, minWidth: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Edit">
            <IconButton 
              color="primary"
              size="small"
              onClick={(e) => handleEdit(params.row.id, e)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              color="error"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDeleteDialog(params.row.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Transform filtered wholesalers data for DataGrid
  const rows = wholesalers.map((user, index) => ({
    id: user._id || index,
    name: user.name || 'N/A',
    phoneNumber: user.phoneNumber || 'N/A',
    businessName: user.businessName || 'N/A',
    gstNumber: user.gstNumber || 'N/A',
    adharNumber: user.adharNumber || 'N/A',
    street: user.address?.street || 'N/A',
  }));

  const handleEdit = (id, e) => {
    e.stopPropagation();
    // TODO: Implement edit functionality
    console.log('Edit wholesaler:', id);
  };


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
      
      <MDDataGrid rows={filteredRows} columns={columns} loading={loading}    />
      
      <CreateWholesalerDialog 
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleCreateWholesaler}
      />
      <DeleteWholesalerDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        wholesalerId={selectedWholesalerId}
        onDeleteSuccess={handleDeleteSuccess}
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
