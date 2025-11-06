
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const MDDataGrid = ({ rows, columns, pageSize = 5,  }) => {
  return (
    <Box
      sx={{
       
        width: '100%',
        marginLeft: 0,
        '& .MuiDataGrid-main': {
          paddingLeft: 0,
        },
        borderRadius: '16px',
       // background: 'rgba(255, 255, 255, 0.9)',
        background:"#FFFFFF",
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
          color: 'rgba(0, 0, 0, 0.87)',
          border: 'none',
          margin: 0,
          padding: 0,
          '& .MuiDataGrid-columnHeaders': {
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(12px)',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
            },
          },
          '& .MuiDataGrid-row': {
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              },
            },
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
          },
          '& .MuiDataGrid-footerContainer': {
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(12px)',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
          },
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
          '& .MuiDataGrid-virtualScroller': {
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.2)',
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default MDDataGrid;
