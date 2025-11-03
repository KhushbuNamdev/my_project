import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress } from '@mui/material';
import MDDataGrid from '../../custom/MDdatagrid';
import { getAllUsers } from '../../Slice/userSlice';

const WholesalerView = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Define columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 200 },
  ];
console.log('users ::>>><<', users);

  // Prepare rows for DataGrid
  const rows = users?.map((user, index) => ({
    id: user._id || index,
    name: user.name || 'N/A',
    phoneNumber: user.phoneNumber || 'N/A',
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Wholesaler List
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : users.length === 0 ? (
        <Typography align="center" sx={{ mt: 3 }}>
          No Users Found
        </Typography>
      ) : (
        <MDDataGrid rows={rows} columns={columns} pageSize={5} height={450} />
      )}
    </Box>
  );
};

export default WholesalerView;
