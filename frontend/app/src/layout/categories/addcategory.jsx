import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createNewCategory, resetCategoryState } from "../../Slice/categorySlice";
import MDDialogBox from "../../custom/MDdialogbox";
import MDButton from "../../custom/MDbutton";
const AddCategory = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.category);

  const [formData, setFormData] = useState({ name: "", description: "" });

  // ✅ Handle successful creation
  useEffect(() => {
    if (success) {
      setFormData({ name: "", description: "" });
      dispatch(resetCategoryState());
      onClose(); // close dialog
      onSuccess?.(); // refresh category list
    }
  }, [success, dispatch, onClose, onSuccess]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    dispatch(createNewCategory(formData));
  };

  return (
    <MDDialogBox
      open={open}
      onClose={onClose}
      title="Add New Category"
      actions={
        <>
         
          <MDButton
            onClick={handleSubmit}
           
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Create"}
          </MDButton>
        </>
      }
    >
      <Box display="flex" flexDirection="column" gap={2} mt={1}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Category Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
         
        />
      </Box>
    </MDDialogBox>
  );
};

export default AddCategory;
