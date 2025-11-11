// src/components/User/DeleteWholesalerDialog.jsx
import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { deleteUser, getAllUsers } from "../../Slice/userSlice";
import ConfirmDialog from "../../custom/confirmdialog";

const DeleteWholesalerDialog = ({ open, onClose, wholesalerId, onDeleteSuccess }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await dispatch(deleteUser(wholesalerId)).unwrap();

      // Close dialog
      onClose();

      // Notify parent (snackbar + refresh)
      onDeleteSuccess();

      // Refresh list
      await dispatch(getAllUsers());
    } catch (error) {
      console.error("Error deleting wholesaler:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Wholesaler"
      confirmLabel={isDeleting ? "Deleting..." : "Delete"}
      message="Are you sure you want to delete this wholesaler? This action cannot be undone."
    />
  );
};

export default DeleteWholesalerDialog;
