


import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../Slice/categorySlice";
import { createNewProduct } from "../../Slice/productSlice";

const AddProduct = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { categories = [], loading: categoriesLoading } = useSelector(
    (state) => state.category
  );

  const [productData, setProductData] = useState({ name: "", categoryIds: [] });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    setProductData((prev) => ({ ...prev, categoryIds: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!productData.name || productData.categoryIds.length === 0) {
      setSnackbar({ open: true, message: "Please fill all fields", severity: "error" });
      return;
    }

    try {
      setLoading(true);
      
      // Create the product with the form data
      const result = await dispatch(createNewProduct({
        name: productData.name.trim(), // Trim any extra spaces
        categoryIds: productData.categoryIds
      })).unwrap();

      console.log('Server response:', result);

      // Show success message
      setSnackbar({ 
        open: true, 
        message: "Product created successfully!", 
        severity: "success" 
      });
      
      // Reset form
      setProductData({ name: "", categoryIds: [] });
      
      // Call onSuccess with the complete product data from the server
      if (onSuccess) {
        // The server should return the created product with all fields
        // If the response is nested in a data or product property, use that
        const productData = result.data || result.product || result;
        
        onSuccess({
          ...productData,
          // Ensure we have all required fields
          _id: productData._id || result._id,
          name: productData.name || productData.productName || productData.title || productData.product?.name || productData.name || 'New Product',
          // Handle categories
          categoryIds: Array.isArray(productData.categoryIds) ? productData.categoryIds : 
                      (productData.categories || []).map(cat => ({
                        _id: cat._id || cat,
                        name: cat.name || categories.find(c => c._id === (cat._id || cat))?.name || 'Uncategorized'
                      }))
        });
      }
      
      // Close the dialog after a small delay to ensure smooth UI update
      setTimeout(() => onClose(), 100);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.message || "Failed to create product", 
        severity: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Product Name"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                multiple
                value={productData.categoryIds}
                onChange={handleCategoryChange}
                renderValue={(selected) =>
                  selected.map((id) => categories.find((cat) => cat._id === id)?.name).join(", ")
                }
              >
                {categoriesLoading ? (
                  <MenuItem>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default AddProduct;
