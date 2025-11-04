import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../Slice/userSlice';
import MDDataGrid from '../../custom/MDdatagrid';
import MDButton from '../../custom/MDbutton';
import MDSearchBar from '../../custom/MDsearchbar';

const Wholesalerview = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  const handleCreateWholesaler = () => {
    // Handle create wholesaler action here
    console.log('Create wholesaler button clicked');
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
    { field: 'country', headerName: 'Country', flex: 1, minWidth: 120 },
  ];

  // Transform filtered wholesalers data for DataGrid
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
        <MDButton onClick={handleCreateWholesaler}>
          Create Wholesaler
        </MDButton>
      </Box>
      <MDDataGrid rows={filteredRows} columns={columns} loading={loading} />
    </Box>
  );
};

export default Wholesalerview;
