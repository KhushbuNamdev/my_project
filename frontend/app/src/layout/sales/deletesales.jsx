import React, { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useDispatch } from 'react-redux';
import { deleteUser, getAllUsers } from '../../Slice/userSlice';
import MDDialogBox from '../../custom/MDdailogbox';
import MDButton from '../../custom/MDbutton';

const DeleteSalesDialog = ({ open, onClose, salesId, onDeleteSuccess }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      setIsDeleting(true);
      await dispatch(deleteUser(salesId)).unwrap();
      
      // Refresh sales list
      await dispatch(getAllUsers());

      // Notify parent
      onDeleteSuccess();

      // Close dialog
      onClose();
    } catch (error) {
      console.error('Error deleting salesperson:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MDDialogBox
      open={open}
      onClose={onClose}
      title="Delete Salesperson"
      actions={null}
      maxWidth="sm"
      fullWidth
    >
      <Box
        component="form"
        onSubmit={handleDelete}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Box display="flex" alignItems="center">
          <WarningIcon color="error" fontSize="large" />
          <Typography variant="body1">
            Are you sure you want to delete this salesperson? <br />
            <strong>This action cannot be undone.</strong>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
         
          <MDButton
            type="submit"
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </MDButton>
        </Box>
      </Box>
    </MDDialogBox>
  );
};

export default DeleteSalesDialog;