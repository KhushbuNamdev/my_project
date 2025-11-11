import React from 'react';
import {
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useDispatch } from 'react-redux';
import { deleteUser, getAllUsers } from '../../Slice/userSlice';
import MDDialogBox from '../../custom/MDdailogbox'; // ✅ Custom dialog import
import MDButton from '../../custom/MDbutton';

const DeleteWholesalerDialog = ({ open, onClose, wholesalerId, onDeleteSuccess }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = React.useState(false);

const handleDelete = async (e) => {
  e.preventDefault();
  try {
    setIsDeleting(true);
    await dispatch(deleteUser(wholesalerId)).unwrap();

    // ✅ Close immediately after delete
    onClose();

    // ✅ Notify parent (snackbar + refresh)
    onDeleteSuccess();

    // Refresh wholesaler list
    await dispatch(getAllUsers());
  } catch (error) {
    console.error('Error deleting wholesaler:', error);
  } finally {
    setIsDeleting(false);
  }
};

  return (
    <MDDialogBox
      open={open}
      onClose={onClose}
      title="Delete Wholesaler"
      actions={null} // we'll define custom actions below
      maxWidth="sm"
      fullWidth
    >
      <Box
        component="form"
        onSubmit={handleDelete}
        sx={{ display: 'flex', flexDirection: 'column',  }}
      >
        {/* Warning message */}
        <Box display="flex" alignItems="center" gap={2}>
          <WarningIcon color="error" fontSize="large" />
          <Typography variant="body1">
            Are you sure you want to delete this wholesaler? <br />
            <strong>This action cannot be undone.</strong>
          </Typography>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          
          <MDButton
            type="submit"
         
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

export default DeleteWholesalerDialog;
