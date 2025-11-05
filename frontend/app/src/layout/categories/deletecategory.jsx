import React, { useState } from "react";
import { Button, Typography, CircularProgress, Box } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { useDispatch } from "react-redux";
import { removeCategory, fetchCategories } from "../../Slice/categorySlice";
import MDDialogBox from "../../custom/MDdailogbox";
import MDButton from "../../custom/MDbutton";
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
    <MDDialogBox
      open={open}
      onClose={onClose}
      title={
        <Box display="flex" alignItems="center" >
          <WarningIcon color="error" />
          <Typography variant="h6" fontWeight="bold">
            Confirm Deletion
          </Typography>
        </Box>
      }
      actions={
        <>
          
          <MDButton
            onClick={handleDelete}
            
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Delete"}
          </MDButton>
        </>
      }
    >
      <Typography>Are you sure you want to delete this category?</Typography>
    </MDDialogBox>
  );
};

export default DeleteCategoryDialog;
