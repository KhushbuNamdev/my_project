import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import MDDialogBox from '../../custom/MDdailogbox'; // 🔥 Use your custom MDDialogBox
import MDButton from '../../custom/MDbutton';

const DeleteProductDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  productName = 'this product' 
}) => {
  return (
    <MDDialogBox
      open={open}
      onClose={onClose}
      title="Confirm Delete"
      actions={
        <>
         
          <MDButton
            onClick={onConfirm} 
        
           
          >
            Delete
          </MDButton>
        </>
      }
    >
      <Box sx={{ p: 1 }}>
        <Typography variant="body1">
          Are you sure you want to delete <strong>{productName}</strong>? This action cannot be undone.
        </Typography>
      </Box>
    </MDDialogBox>
  );
};

export default DeleteProductDialog;
