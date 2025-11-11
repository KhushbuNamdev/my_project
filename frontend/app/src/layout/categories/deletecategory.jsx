// src/components/Category/DeleteCategoryDialog.jsx
import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { removeCategory, fetchCategories } from "../../Slice/categorySlice";
import ConfirmDialog from "../../custom/confirmdialog"; // import your reusable dialog

const DeleteCategoryDialog = ({ open, onClose, categoryId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await dispatch(removeCategory(categoryId)).unwrap();
      await dispatch(fetchCategories()); // refresh after delete
      onClose(); // close dialog after delete
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Confirm Deletion"
      message="Are you sure you want to delete this category?"
      confirmLabel={loading ? "Deleting..." : "Delete"}
    />
  );
};

export default DeleteCategoryDialog;
