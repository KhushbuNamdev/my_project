
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const MDDataGrid = ({ rows, columns, pageSize = 5, height = 400 }) => {
  return (
    <Box
      sx={{
        height,
        width: '100%',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 2,
        border: '1px solid rgba(255,255,255,0.3)',
        '& .MuiDataGrid-root': {
          backgroundColor: 'transparent',
          color: '#000',
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)',
          fontWeight: 'bold',
        },
        '& .MuiDataGrid-footerContainer': {
          backgroundColor: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        disableSelectionOnClick
        sx={{
          backgroundColor: 'transparent',
          color: '#000',
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(255,255,255,0.25)',
          },
        }}
      />
    </Box>
  );
};

export default MDDataGrid;
