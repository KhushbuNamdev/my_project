import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateExistingProduct } from '../../Slice/productSlice';
import { fetchCategories } from '../../Slice/categorySlice';

const EditProduct = ({ 
  open, 
  onClose, 
  product,
  onSuccess 
}) => {
  const dispatch = useDispatch();
  const { categories = [], loading: categoriesLoading } = useSelector(
    (state) => state.category
  );

  const [formData, setFormData] = useState({
    name: '',
    categoryIds: [],
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Initialize form with product data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        categoryIds: Array.isArray(product.categoryIds) 
          ? product.categoryIds.map(cat => typeof cat === 'object' ? cat._id : cat)
          : [],
      });
    }
  }, [product]);

  // Load categories if not already loaded
  useEffect(() => {
    if (open && categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [open, dispatch, categories.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: e.target.value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || formData.categoryIds.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Prepare the update data according to backend expectations
      const updateData = {
        name: formData.name.trim(),
        categoryIds: formData.categoryIds
      };
      
      // Log the data being sent for debugging
      console.log('Sending update request with data:', {
        id: product._id,
        ...updateData
      });
      
      const result = await dispatch(updateExistingProduct({
        id: product._id,
        updateData: updateData
      })).unwrap();

      setSnackbar({
        open: true,
        message: 'Product updated successfully!',
        severity: 'success'
      });
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      // Close the dialog after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to update product:', error);
      const errorMessage = error?.data?.message || error.message || 'Failed to update product';
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!product) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Categories</InputLabel>
              <Select
                multiple
                value={formData.categoryIds}
                onChange={handleCategoryChange}
                label="Categories"
                renderValue={(selected) => {
                  const selectedCategories = selected.map(id => 
                    categories.find(cat => cat._id === id)?.name || id
                  );
                  return selectedCategories.join(', ');
                }}
              >
                {categoriesLoading ? (
                  <Box display="flex" justifyContent="center" p={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Product'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditProduct;