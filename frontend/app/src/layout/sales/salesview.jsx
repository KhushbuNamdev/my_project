import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../Slice/userSlice';
import MDDataGrid from '../../custom/MDdatagrid'; // ✅ adjust this path if needed

const Salesmanview = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // ✅ Filter only users whose role is "salesman"
  const salesmen = users.filter((user) => user.role === 'sales');

  // Define columns for the DataGrid
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 180 },
    { field: 'country', headerName: 'Country', flex: 1, minWidth: 120 },
  ];

  // ✅ Transform filtered salesman data for DataGrid
  const rows = salesmen.map((user, index) => ({
    id: user._id || index,
    name: user.name || 'N/A',
    phoneNumber: user.phoneNumber || 'N/A',
    email: user.email || 'N/A',
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
      

      {/* ✅ Only shows users with role = salesman */}
      <MDDataGrid rows={rows} columns={columns} pageSize={5}
      
       autoHeight={true}/>
    </Box>
  );
};

export default Salesmanview;