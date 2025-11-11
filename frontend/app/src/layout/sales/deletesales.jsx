// src/components/User/DeleteSalesDialog.jsx
import React, { useState } from "react";
import { CircularProgress, Typography, Box } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { useDispatch } from "react-redux";
import { deleteUser, getAllUsers } from "../../Slice/userSlice";
import ConfirmDialog from "../../custom/confirmdialog";

const DeleteSalesDialog = ({ open, onClose, salesId, onDeleteSuccess }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
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
      console.error("Error deleting salesperson:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Salesperson"
      message={
        <Box display="flex" alignItems="center" gap={1}>
         
          <Typography variant="body1">
            Are you sure you want to delete this salesperson? <br />
           This action cannot be undone.
          </Typography>
        </Box>
      }
      confirmLabel={
        <Box display="flex" alignItems="center" gap={1}>
          {isDeleting && <CircularProgress size={20} />}
          {isDeleting ? "Deleting..." : "Delete"}
        </Box>
      }
    />
  );
};

export default DeleteSalesDialog;
