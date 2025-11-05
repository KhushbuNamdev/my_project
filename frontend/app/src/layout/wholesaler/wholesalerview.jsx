import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteWholesalerDialog from './deletewholesaler';
import EditWholesalerDialog from './editwholesaler';
import CreateWholesalerDialog from './cerateWholesaler';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, createUser } from '../../Slice/userSlice';
import MDDataGrid from '../../custom/MDdatagrid';
import MDButton from '../../custom/MDbutton';
import MDSearchBar from '../../custom/MDsearchbar';

const Wholesalerview = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedWholesaler, setSelectedWholesaler] = useState(null);
  const [selectedWholesalerId, setSelectedWholesalerId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [searchTerm, setSearchTerm] = useState('');

  // ===============================
  // 🔹 Dialog Handlers
  // ===============================
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

  const handleOpenEditDialog = (wholesaler) => {
    setSelectedWholesaler(wholesaler);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => setEditDialogOpen(false);

  // ===============================
  // 🔹 Success Handlers
  // ===============================
  const handleEditSuccess = () => {
    setSnackbar({
      open: true,
      message: 'Wholesaler updated successfully!',
      severity: 'success',
    });
    dispatch(getAllUsers());
  };

  const handleDeleteSuccess = () => {
    setSnackbar({
      open: true,
      message: 'Wholesaler deleted successfully!',
      severity: 'success',
    });
    dispatch(getAllUsers());
  };

  const handleCreateWholesaler = async (wholesalerData) => {
    try {
      const userData = {
        name: wholesalerData.name,
        businessName: wholesalerData.businessName,
        gstNumber: wholesalerData.gstNumber,
        adharNumber: wholesalerData.aadharNumber,
        phoneNumber: wholesalerData.phoneNumber,
        email: `${wholesalerData.phoneNumber}@example.com`,
        password: 'defaultPassword123!',
        role: 'wholesaler',
        address: wholesalerData.address,
      };

      const response = await dispatch(createUser(userData)).unwrap();

      setSnackbar({
        open: true,
        message: 'Wholesaler created successfully!',
        severity: 'success',
      });
      handleCloseDialog();
      dispatch(getAllUsers());
    } catch (error) {
      console.error('Error creating wholesaler:', error);
      setSnackbar({
        open: true,
        message:
          error?.message ||
          'Failed to create wholesaler. Please check all required fields.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // ===============================
  // 🔹 Fetch users on mount
  // ===============================
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // ===============================
  // 🔹 Filter Wholesalers
  // ===============================
  const wholesalers = users.filter((user) => user.role === 'wholesaler');

  // ===============================
  // 🔹 Columns for DataGrid
  // ===============================
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1, minWidth: 150 },
    { field: 'businessName', headerName: 'Business Name', flex: 1, minWidth: 150 },
    { field: 'gstNumber', headerName: 'GST Number', flex: 1, minWidth: 150 },
    { field: 'adharNumber', headerName: 'Aadhaar Number', flex: 1, minWidth: 150 },
    { field: 'fullAddress', headerName: 'Address', flex: 1.5, minWidth: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => handleOpenEditDialog(params.row)}
              color="primary"
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleOpenDeleteDialog(params.row._id)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // ===============================
  // 🔹 Map data for DataGrid rows
  // ===============================
  const rows = wholesalers.map((user, index) => ({
    id: user._id || index,
    _id: user._id,
    name: user.name || 'N/A',
    phoneNumber: user.phoneNumber || 'N/A',
    businessName: user.businessName || 'N/A',
    gstNumber: user.gstNumber || 'N/A',
    adharNumber: user.adharNumber || 'N/A',
    fullAddress: user.address
      ? `${user.address.street || ''}, ${user.address.city || ''}, ${
          user.address.state || ''
        } - ${user.address.pincode || ''}, ${user.address.country || ''}`
      : 'N/A',
  }));

  // ===============================
  // 🔹 Search Functionality
  // ===============================
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    return rows.filter((row) =>
      Object.values(row).some(
        (value) =>
          value && value.toString().toLowerCase().includes(searchTerm)
      )
    );
  }, [rows, searchTerm]);

  // ===============================
  // 🔹 Loading and Error States
  // ===============================
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

  // ===============================
  // 🔹 Render UI
  // ===============================
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

      {/* Create Dialog */}
      <CreateWholesalerDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onCreate={handleCreateWholesaler}
      />

      {/* Edit Dialog */}
      <EditWholesalerDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        wholesaler={selectedWholesaler}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Dialog */}
      <DeleteWholesalerDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        wholesalerId={selectedWholesalerId}
        onSuccess={handleDeleteSuccess}
      />

      {/* Snackbar */}
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
