import React, { useEffect } from 'react';
import {
  TextField,
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
import MDDialogBox from '../../custom/MDdialogbox';
import MDButton from '../../custom/MDbutton';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const EditProduct = ({ open, onClose, product, onSuccess }) => {
  const dispatch = useDispatch();
  const { categories = [], loading: categoriesLoading } = useSelector(
    (state) => state.category
  );

  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch categories when dialog opens
  useEffect(() => {
    if (open && categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [open, categories.length, dispatch]);

  // Formik form
  const formik = useFormik({
    enableReinitialize: true, // important to update initialValues when product changes
    initialValues: {
      name: product?.name || '',
      categoryIds: Array.isArray(product?.categoryIds)
        ? product.categoryIds.map((cat) =>
            typeof cat === 'object' ? cat._id : cat
          )
        : [],
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required('Product name is required'),
      categoryIds: Yup.array().min(1, 'Select at least one category'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const updateData = {
          name: values.name.trim(),
          categoryIds: values.categoryIds,
        };

        const result = await dispatch(
          updateExistingProduct({ id: product._id, updateData })
        ).unwrap();

        setSnackbar({
          open: true,
          message: 'Product updated successfully!',
          severity: 'success',
        });

        if (onSuccess) onSuccess(result);

        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (error) {
        console.error('Failed to update product:', error);
        const errorMessage =
          error?.data?.message || error.message || 'Failed to update product';
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (!product) return null;

  return (
    <>
      <MDDialogBox
        open={open}
        onClose={onClose}
        title="Edit Product"
        actions={
          <MDButton
            onClick={formik.handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Product'}
          </MDButton>
        }
      >
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Product Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            margin="normal"
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <FormControl
            fullWidth
            margin="normal"
            error={formik.touched.categoryIds && Boolean(formik.errors.categoryIds)}
          >
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              name="categoryIds"
              value={formik.values.categoryIds}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Categories"
              renderValue={(selected) =>
                selected
                  .map((id) => categories.find((cat) => cat._id === id)?.name || id)
                  .join(', ')
              }
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
            {formik.touched.categoryIds && formik.errors.categoryIds && (
              <Box mt={1} color="error.main" fontSize={12}>
                {formik.errors.categoryIds}
              </Box>
            )}
          </FormControl>
        </Box>
      </MDDialogBox>

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
