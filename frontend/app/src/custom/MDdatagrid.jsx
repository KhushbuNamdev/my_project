
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box  , } from '@mui/material';

const MDDataGrid = ({ rows, columns, pageSize = 5, minHeight = 494, loading = false  }) => {
  return (
  
       <Box
      sx={{
        width: '100%',
        borderRadius: '16px',
        background: "#FFFFFF",
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: `
          0 10px 40px -10px rgba(31, 38, 135, 0.15),
          0 6px 20px -5px rgba(31, 38, 135, 0.1),
          inset 1px 1px 0 0 rgba(255, 255, 255, 0.6)
        `,
        '& .MuiDataGrid-root': {
          backgroundColor: 'transparent',
          border: 'none',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        disableSelectionOnClick
       loading={loading}
        sx={{
          minHeight: `${minHeight}px`,  // ✅ Minimum height
          '& .MuiDataGrid-virtualScroller': {
            '&::-webkit-scrollbar': { width: '8px', height: '8px' },
            '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.3)', borderRadius: '4px' },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(0,0,0,0.1)', borderRadius: '4px', '&:hover': { background: 'rgba(0,0,0,0.2)' } },
          },
        }}
      />


      
    </Box>
  );
};

export default MDDataGrid;
