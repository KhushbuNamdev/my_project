import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Alert,
  CircularProgress,
  Snackbar,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';

import MDDataGrid from '../../custom/MDdatagrid';
import MDButton from '../../custom/MDbutton';
import MDSearchBar from '../../custom/MDsearchbar';
import CreateWholesalerDialog from './ceratewholesaler';
import EditWholesalerDialog from './editwholesaler';
import DeleteWholesalerDialog from './deletewholesaler';
import { getAllUsers, createUser } from '../../Slice/userSlice';

const Customerview = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWholesaler, setSelectedWholesaler] = useState(null);
  const [selectedWholesalerId, setSelectedWholesalerId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');

  // ===============================
  // 🔹 Dialog Handlers
  // ===============================
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleOpenEditDialog = (wholesaler) => {
    setSelectedWholesaler(wholesaler);
    setEditDialogOpen(true);
  };
  const handleCloseEditDialog = () => setEditDialogOpen(false);

  const handleOpenDeleteDialog = (id) => {
    setSelectedWholesalerId(id);
    setDeleteDialogOpen(true);
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedWholesalerId(null);
  };

  // ===============================
  // 🔹 Success Handlers
  // ===============================
  const handleEditSuccess = () => {
    setSnackbar({ open: true, message: 'User updated successfully!', severity: 'success' });
    dispatch(getAllUsers());
  };

  const handleDeleteSuccess = () => {
    setSnackbar({ open: true, message: 'User deleted successfully!', severity: 'success' });
    dispatch(getAllUsers());
  };

  const handleCreateWholesaler = async (wholesalerData) => {
    try {
      const userData = {
        name: wholesalerData.name,
        businessName: wholesalerData.businessName,
        gstNumber: wholesalerData.gstNumber,
        adharNumber: wholesalerData.adharNumber,
        phoneNumber: wholesalerData.phoneNumber,
        email: `${wholesalerData.phoneNumber}@example.com`,
        password: 'defaultPassword123!',
        role: wholesalerData.role || 'wholesaler', // ✅ Allow role to be either wholesaler or retailer
        address: wholesalerData.address,
      };

      await dispatch(createUser(userData)).unwrap();
      setSnackbar({ open: true, message: 'User created successfully!', severity: 'success' });
      handleCloseDialog();
      dispatch(getAllUsers());
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || 'Failed to create user. Please check required fields.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  // ===============================
  // 🔹 Fetch users on mount
  // ===============================
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // ===============================
  // 🔹 Filter Wholesalers + Retailers
  // ===============================
  const wholesalerAndRetailer = users.filter(
    (user) => user.role === 'wholesaler' || user.role === 'retailer'
  );

  // ===============================
  // 🔹 DataGrid Columns
  // ===============================
  const columns = [
    { field: 'role', headerName: 'Role', flex: 0.6, minWidth: 100 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1, minWidth: 150 },
    { field: 'businessName', headerName: 'Business Name', flex: 1, minWidth: 150 },
    { field: 'gstNumber', headerName: 'GST Number', flex: 1, minWidth: 150 },
    { field: 'adharNumber', headerName: 'Aadhaar Number', flex: 1, minWidth: 150 },
    { field: 'fullAddress', headerName: 'Address', flex: 1.5, minWidth: 300 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleOpenEditDialog(params.row)} size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleOpenDeleteDialog(params.row._id)} size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // ===============================
  // 🔹 Map rows
  // ===============================
  const rows = wholesalerAndRetailer.map((user, index) => ({
    id: user._id || index,
    _id: user._id,
    role: user.role || 'N/A',
    name: user.name || 'N/A',
    phoneNumber: user.phoneNumber || 'N/A',
    businessName: user.businessName || 'N/A',
    gstNumber: user.gstNumber || 'N/A',
    adharNumber: user.adharNumber || 'N/A',
    fullAddress: user.address
      ? `${user.address.street || ''}, ${user.address.city || ''}, ${user.address.state || ''} - ${user.address.pincode || ''}, ${user.address.country || ''}`
      : 'N/A',
  }));

  // ===============================
  // 🔹 Search Filter
  // ===============================
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) => value?.toString().toLowerCase().includes(searchTerm))
    );
  }, [rows, searchTerm]);

  // ===============================
  // 🔹 Render
  // ===============================
  return (
    <Box p={3}>
      {/* Card Container */}
      <Box
        sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255,255,255,0.6)',
        }}
      >
        {/* Toolbar: Search + Button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          <MDSearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            placeholder="Search wholesalers or retailers..."
          />
          <MDButton onClick={handleOpenDialog} variant="contained" color="primary">
            Add Customer
          </MDButton>
        </Box>

        {/* MDDataGrid */}
        <MDDataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          pageSize={5}
          disableTopRadius
        />
      </Box>

      {/* Dialogs */}
      <CreateWholesalerDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onCreate={handleCreateWholesaler}
      />
      <EditWholesalerDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        wholesaler={selectedWholesaler}
        onSuccess={handleEditSuccess}
      />
      <DeleteWholesalerDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        wholesalerId={selectedWholesalerId}
        onDeleteSuccess={handleDeleteSuccess}
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

      {/* Error message if any */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default Customerview;
