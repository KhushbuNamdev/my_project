// src/pages/Statistics.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import MDDataGrid from '../custom/MDdatagrid';

const Statistics = () => {
  // Empty columns and rows for now
  const columns = [];
  const rows = [];

  return (
    <Box
      sx={{
    
     
        
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        color="error.main"
        textAlign="center"
      >
        Statistics
      </Typography>

      {/* Empty MDDataGrid */}
      <MDDataGrid rows={rows} columns={columns} height={300} />
    </Box>
  );
};

export default Statistics;
