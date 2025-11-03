// src/pages/Statistics.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import MDDataGrid from '../../custom/MDdatagrid';

const Salesview = () => {
  // Empty columns and rows for now
  const columns = [];
  const rows = [];

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        color="error.main"
        textAlign="center"
      >
      sales View
      </Typography>

      {/* Empty MDDataGrid */}
      <MDDataGrid rows={rows} columns={columns} height={300} />
    </Box>
  );
};

export default Salesview;
