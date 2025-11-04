// import React from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
// import WarningIcon from '@mui/icons-material/Warning';
// import { useDispatch } from 'react-redux';
// import { deleteUser } from '../../Slice/userSlice';

// const DeleteWholesalerDialog = ({ open, onClose, wholesalerId, onDeleteSuccess }) => {
//   const dispatch = useDispatch();
//   const [isDeleting, setIsDeleting] = React.useState(false);

//   const handleDelete = async (e) => {
//     e.preventDefault(); // Prevent form submission and page reload
//     try {
//       setIsDeleting(true);
//       await dispatch(deleteUser(wholesalerId)).unwrap();
//       // Show success message but don't refresh yet
//       onDeleteSuccess();
//       // Close the dialog first
//       onClose();
//       // The list will be refreshed by the parent component after the dialog is closed
//     } catch (error) {
//       console.error('Error deleting wholesaler:', error);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose} 
//       maxWidth="sm" 
//       fullWidth
//       component="form"
//       onSubmit={handleDelete}
//     >
//       <DialogTitle>Delete Wholesaler</DialogTitle>
//       <DialogContent>
//         <Box display="flex" alignItems="center" gap={2} mb={2}>
//           <WarningIcon color="error" fontSize="large" />
//           <Typography variant="body1">
//             Are you sure you want to delete this wholesaler? This action cannot be undone.
//           </Typography>
//         </Box>
//       </DialogContent>
//       <DialogActions sx={{ p: 2, pt: 0 }}>
//         <Button onClick={onClose} disabled={isDeleting}>
//           Cancel
//         </Button>
//         <Button
//           type="submit"
//           color="error"
//           variant="contained"
//           disabled={isDeleting}
//           startIcon={isDeleting ? <CircularProgress size={20} /> : null}
//         >
//           {isDeleting ? 'Deleting...' : 'Delete'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default DeleteWholesalerDialog;



import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useDispatch } from 'react-redux';
import { deleteUser, getAllUsers } from '../../Slice/userSlice';

const DeleteWholesalerDialog = ({ open, onClose, wholesalerId, onDeleteSuccess }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      setIsDeleting(true);
      await dispatch(deleteUser(wholesalerId)).unwrap();

      // ✅ Immediately refresh the wholesalers list here
      await dispatch(getAllUsers());

      // ✅ Show success snackbar (handled in parent)
      onDeleteSuccess();

      // ✅ Close dialog
      onClose();
    } catch (error) {
      console.error('Error deleting wholesaler:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      component="form"
      onSubmit={handleDelete}
    >
      <DialogTitle>Delete Wholesaler</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <WarningIcon color="error" fontSize="large" />
          <Typography variant="body1">
            Are you sure you want to delete this wholesaler? This action cannot be undone.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          type="submit"
          color="error"
          variant="contained"
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={20} /> : null}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteWholesalerDialog;
