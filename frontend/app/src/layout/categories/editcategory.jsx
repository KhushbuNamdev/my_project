import React, { useState, useEffect } from "react";
import {
  TextField,
  CircularProgress,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  updateExistingCategory,
  resetCategoryState,
} from "../../Slice/categorySlice";
import MDDialogBox from "../../custom/MDdialogbox";
import MDButton from "../../custom/MDbutton";

const EditCategory = ({ open, onClose, category, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.category);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    // Fill form with selected category data
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        status: category.status || "active",
      });
    }

    // Close dialog & refresh list after successful update
    if (success) {
      dispatch(resetCategoryState());
      onClose();
      onSuccess?.();
    }
  }, [category, success, dispatch, onClose, onSuccess]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    if (!category?._id) return;
    dispatch(updateExistingCategory({ id: category._id, updateData: formData }));
  };

  return (
    <MDDialogBox
      open={open}
      onClose={onClose}
      title="Edit Category"
      actions={
        <MDButton onClick={handleUpdate} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
        </MDButton>
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

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </MDDialogBox>
  );
};

export default EditCategory;
