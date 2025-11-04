
import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../Slice/userSlice';
import MDDataGrid from '../../custom/MDdatagrid'; // ✅ adjust this path if needed

const Wholesalerview = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // ✅ Filter only users whose role is "wholesaler"
  const wholesalers = users.filter((user) => user.role === 'wholesaler');

  // Define columns for the DataGrid
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1, minWidth: 150 },
    { field: 'businessName', headerName: 'Business Name', flex: 1, minWidth: 150 },
    { field: 'gstNumber', headerName: 'GST Number', flex: 1, minWidth: 150 },
    { field: 'country', headerName: 'Country', flex: 1, minWidth: 120 },
  ];

  // ✅ Transform filtered wholesalers data for DataGrid
  const rows = wholesalers.map((user, index) => ({
    id: user._id || index,
    name: user.name || 'N/A',
    phoneNumber: user.phoneNumber || 'N/A',
    businessName: user.businessName || 'N/A',
    gstNumber: user.gstNumber || 'N/A',
    country: user.address?.country || 'N/A',
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

  return (
    <Box sx={{ width: '100%' }}>
      

      {/* ✅ Only shows users with role = wholesaler */}
      <MDDataGrid rows={rows} columns={columns} pageSize={5} height={400} />
    </Box>
  );
};

export default Wholesalerview;
