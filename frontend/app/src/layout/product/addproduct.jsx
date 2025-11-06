import React, { useEffect, useState } from "react";
import {
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
  Typography,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../Slice/categorySlice";
import { createNewProduct } from "../../Slice/productSlice";
import MDDialogBox from "../../custom/MDdailogbox";
import MDButton from "../../custom/MDbutton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
const AddProduct = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { categories = [], loading: categoriesLoading } = useSelector(
    (state) => state.category
  );

  const [productData, setProductData] = useState({
    name: "",
    categoryIds: [],
    gstPercentage: 0,
    features: [""],
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...productData.features];
    updatedFeatures[index] = value;
    setProductData((prev) => ({ ...prev, features: updatedFeatures }));
  };

  const addFeature = () => {
    setProductData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index) => {
    if (productData.features.length > 1) {
      const updatedFeatures = productData.features.filter((_, i) => i !== index);
      setProductData((prev) => ({ ...prev, features: updatedFeatures }));
    }
  };

  const handleCategoryChange = (e) => {
    setProductData((prev) => ({ ...prev, categoryIds: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!productData.name || productData.categoryIds.length === 0) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    const hasEmptyFeatures = productData.features.some(
      (f) => !f.trim()
    );
    if (hasEmptyFeatures) {
      setSnackbar({
        open: true,
        message: "Please fill all feature descriptions",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const productPayload = {
        name: productData.name.trim(),
        categoryIds: productData.categoryIds,
        gstPercentage: parseFloat(productData.gstPercentage) || 0,
        features: productData.features
          .filter((f) => f.trim() !== "")
          .map((f, i) => ({
            index: i + 1,
            feature: f.trim(),
          })),
      };

      const result = await dispatch(createNewProduct(productPayload)).unwrap();

      setSnackbar({
        open: true,
        message: "Product created successfully!",
        severity: "success",
      });

      setProductData({
        name: "",
        categoryIds: [],
        gstPercentage: 0,
        features: [""],
      });

      if (onSuccess) {
        const productDataFromServer = result.data || result.product || result;
        onSuccess({
          ...productDataFromServer,
          _id: productDataFromServer._id || result._id,
          name: productDataFromServer.name || "New Product",
          categoryIds: Array.isArray(productDataFromServer.categoryIds)
            ? productDataFromServer.categoryIds
            : (productDataFromServer.categories || []).map((cat) => ({
                _id: cat._id || cat,
                name:
                  cat.name ||
                  categories.find((c) => c._id === (cat._id || cat))?.name ||
                  "Uncategorized",
              })),
        });
      }

      setTimeout(() => onClose(), 100);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to create product",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MDDialogBox
        open={open}
        onClose={onClose}
        title="Add New Product"
        actions={
          <MDButton
            onClick={handleSubmit}
            disabled={loading}
            variant="contained"
            color="primary"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Add Product"}
          </MDButton>
        }
      >
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Product Name"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            fullWidth
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              multiple
              value={productData.categoryIds}
              onChange={handleCategoryChange}
              renderValue={(selected) =>
                selected
                  .map((id) => categories.find((cat) => cat._id === id)?.name)
                  .join(", ")
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

          <TextField
            label="GST Percentage"
            name="gstPercentage"
            type="number"
            value={productData.gstPercentage}
            onChange={handleInputChange}
            fullWidth
            slotProps={{ min: 0, max: 100, step: 0.01 }}
            
          />

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1">Features</Typography>
              {/* <MDButton
                onClick={addFeature}
                startIcon={<AddIcon />}
                size="small"
               
              > */}


              <MDButton
                          onClick={addFeature}
              
                            sx={{
                              px: 1.5,
                              py: 0.3,
                              fontSize: "0.7rem",
                              minWidth: "auto",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                              <AddCircleOutlineIcon sx={{ fontSize: 16 }} />
                Add Feature
              </MDButton>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {productData.features.map((feature, index) => (
              <Grid
                container
                spacing={2}
                key={index}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Grid size={{xs:11}}>
                  <TextField
                    label={`Feature ${index + 1}`}
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    fullWidth
                    size="small"
                    required
                  />
                </Grid>
               <Grid size={{xs:1}}>
                  <IconButton
                    onClick={() => removeFeature(index)}
                    disabled={productData.features.length <= 1}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Box>
        </Box>
      </MDDialogBox>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddProduct;
