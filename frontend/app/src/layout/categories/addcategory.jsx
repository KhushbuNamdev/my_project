import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createNewCategory, resetCategoryState } from "../../Slice/categorySlice";

const AddCategory = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.category);

  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    if (success) {
      // ✅ When category successfully created
      setFormData({ name: "", description: "" });
      dispatch(resetCategoryState());
      onClose();       // close dialog
      onSuccess?.();   // call parent refresh function
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Category</DialogTitle>
      <DialogContent>
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
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategory;
