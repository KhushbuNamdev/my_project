import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, IconButton, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, createUser } from '../../Slice/userSlice';
import MDDataGrid from '../../custom/MDdatagrid';
import MDButton from '../../custom/MDbutton';
import MDSearchBar from '../../custom/MDsearchbar';
import CreateSalesman from './ceratesalesman';

const Salesmanview = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleCreateSalesman = async (salesmanData) => {
    try {
      await dispatch(createUser(salesmanData)).unwrap();
      setSnackbar({
        open: true,
        message: 'Salesperson created successfully!',
        severity: 'success'
      });
      handleCloseDialog();
      dispatch(getAllUsers());
    } catch (error) {
      console.error('Error creating salesperson:', error);
      setSnackbar({
        open: true,
        message: error?.message || 'Failed to create salesperson. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleEdit = (row) => {
    // Handle edit action
    console.log('Edit row:', row);
    // You can implement edit functionality here
  };

  const handleDelete = (id) => {
    // Handle delete action
    console.log('Delete id:', id);
    // You can implement delete functionality here
    setSnackbar({
      open: true,
      message: 'Delete functionality will be implemented here',
      severity: 'info'
    });
  };

  // Filter only users whose role is "sales"
  const salesmen = users.filter((user) => user.role === 'sales');

  // Define columns for the DataGrid
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Filter salesmen based on search term
  const filteredSalesmen = salesmen.filter(salesman => 
    salesman.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salesman.phoneNumber?.includes(searchTerm)
  );

  // Transform filtered salesman data for DataGrid
  const rows = filteredSalesmen.map((user, index) => ({
    id: user._id || index,
    name: user.name || 'N/A',
    phoneNumber: user.phoneNumber || 'N/A',
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        

          <MDSearchBar
            placeholder="Search salespeople..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />
          <MDButton
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
          >
            Add Salesperson
          </MDButton>
        </Box>
    

      {/* ✅ Only shows users with role = salesman */}
      <MDDataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
      />
      
      {/* Create Salesman Dialog */}
      <CreateSalesman
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleCreateSalesman}
        loading={loading}
        error={error}
      />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Salesmanview;



