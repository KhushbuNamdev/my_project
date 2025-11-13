import React, { useEffect, useState } from "react";
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
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../Slice/categorySlice";
import { createNewProduct } from "../../Slice/productSlice";
import MDDialogBox from "../../custom/MDdialogbox";
import MDButton from "../../custom/MDbutton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";

const AddProduct = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { categories = [], loading: categoriesLoading } = useSelector(
    (state) => state.category
  );
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      name: "",
      categoryIds: [],
      gstPercentage: 0,
      features: [""],
      warranty: "",
      dimensions: "",
      cca: "",
      rc: "",
      weight: "",
      weightUnit: "kg", // ✅ added
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      categoryIds: Yup.array().min(1, "Select at least one category"),
      gstPercentage: Yup.number()
        .min(0, "GST cannot be negative")
        .max(100, "GST cannot exceed 100"),
      features: Yup.array()
        .of(Yup.string().required("Feature description required"))
        .min(1, "At least one feature is required"),
      warranty: Yup.number().required("Warranty is required"),
      dimensions: Yup.string().required("Dimensions are required"),
      cca: Yup.number().typeError("CCA must be a number").required("CCA is required"),
      rc: Yup.number().typeError("RC must be a number").required("RC is required"),
      weight: Yup.number().typeError("Weight must be a number").required("Weight is required"),
      weightUnit: Yup.string()
        .oneOf(["kg", "g", "lb", "oz"])
        .required("Weight unit is required"), // ✅ added
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const productPayload = {
          name: values.name.trim(),
          categoryIds: values.categoryIds,
          gstPercentage: parseFloat(values.gstPercentage) || 0,
          warranty: parseInt(values.warranty),
          specifications: {
            dimensions: values.dimensions.trim(),
            cca: parseFloat(values.cca),
            rc: parseFloat(values.rc),
            weight: {
              value: parseFloat(values.weight),
              unit: values.weightUnit, // ✅ updated dynamic unit
            },
          },
          features: values.features.map((f, i) => ({
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

        formik.resetForm();

        if (onSuccess) {
          const productDataFromServer = result.data || result.product || result;
          onSuccess(productDataFromServer);
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
    },
  });

  return (
    <>
      <MDDialogBox
        open={open}
        onClose={onClose}
        title="Add New Product"
        actions={
          <MDButton
            onClick={formik.handleSubmit}
            disabled={loading}
            variant="contained"
            color="primary"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Add Product"}
          </MDButton>
        }
      >
        <FormikProvider value={formik}>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
               <Grid container spacing={2}>
            {/* Product Name */}
            <TextField
              label="Product Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            {/* Category */}
            <Grid  size={{xs:12}}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                multiple
                name="categoryIds"
                value={formik.values.categoryIds}
                onChange={formik.handleChange}
                renderValue={(selected) =>
                  selected
                    .map((id) => categories.find((cat) => cat._id === id)?.name)
                    .join(", ")
                }
                error={formik.touched.categoryIds && Boolean(formik.errors.categoryIds)}
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
              {formik.touched.categoryIds && formik.errors.categoryIds && (
                <Typography color="error" variant="caption">
                  {formik.errors.categoryIds}
                </Typography>
              )}
            </FormControl></Grid>

            {/* GST */}
            <Grid size={{xs:6}}>
            <TextField
              label="GST Percentage"
              name="gstPercentage"
              type="number"
              value={formik.values.gstPercentage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              error={formik.touched.gstPercentage && Boolean(formik.errors.gstPercentage)}
              helperText={formik.touched.gstPercentage && formik.errors.gstPercentage}
            />
            </Grid>
            {/* Warranty */}
            <Grid size={{xs:6}}>
            <FormControl fullWidth>
              <InputLabel>Warranty (in months)</InputLabel>
              <Select
                name="warranty"
                value={formik.values.warranty}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.warranty && Boolean(formik.errors.warranty)}
              >
                {[6, 12, 18, 24].map((month) => (
                  <MenuItem key={month} value={month}>
                    {month} Months
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.warranty && formik.errors.warranty && (
                <Typography color="error" variant="caption">
                  {formik.errors.warranty}
                </Typography>
              )}
            </FormControl>
            </Grid>
            {/* Specifications */}
         
              <Grid size={{xs:6}}>
                <TextField
                  label="Dimensions"
                  name="dimensions"
                  value={formik.values.dimensions}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  error={formik.touched.dimensions && Boolean(formik.errors.dimensions)}
                  helperText={formik.touched.dimensions && formik.errors.dimensions}
                />
              </Grid>
              <Grid size={{xs:6}}>
                <TextField
                  label="CCA"
                  name="cca"
                  type="number"
                  value={formik.values.cca}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  error={formik.touched.cca && Boolean(formik.errors.cca)}
                  helperText={formik.touched.cca && formik.errors.cca}
                />
              </Grid>
              <Grid size={{xs:6}}>
                <TextField
                  label="RC"
                  name="rc"
                  type="number"
                  value={formik.values.rc}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  error={formik.touched.rc && Boolean(formik.errors.rc)}
                  helperText={formik.touched.rc && formik.errors.rc}
                />
              </Grid>
              
              <Grid size={{xs:6}}>
  <TextField
    label="Weight"
    name="weight"
    type="number"
    value={formik.values.weight}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    fullWidth
    error={formik.touched.weight && Boolean(formik.errors.weight)}
    helperText={formik.touched.weight && formik.errors.weight}
    InputProps={{
      endAdornment: (
        <FormControl sx={{ minWidth: 70 }}>
          <Select
            name="weightUnit"
            value={formik.values.weightUnit}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant="standard"
            disableUnderline
          >
            {["kg", "g", "lb", "oz"].map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    }}
  />
</Grid>

            </Grid>

            {/* Features Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1">Features</Typography>
              <MDButton
                onClick={() => formik.setFieldValue("features", [...formik.values.features, ""])}
                sx={{ px: 1.5, py: 0.3, fontSize: "0.7rem" }}
              >
                <AddCircleOutlineIcon sx={{ fontSize: 16 }} /> Add Feature
              </MDButton>
            </Box>

            <FieldArray
              name="features"
              render={(arrayHelpers) => (
                <>
                  {formik.values.features.map((feature, index) => (
                    <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 1 }}>
                      <Grid size={{xs:11}}>
                        <TextField
                          label={`Feature ${index + 1}`}
                          value={feature}
                          onChange={formik.handleChange(`features.${index}`)}
                          fullWidth
                          size="small"
                          error={
                            formik.touched.features &&
                            formik.touched.features[index] &&
                            Boolean(formik.errors.features?.[index])
                          }
                          helperText={
                            formik.touched.features &&
                            formik.touched.features[index] &&
                            formik.errors.features?.[index]
                          }
                        />
                      </Grid>
                      <Grid size={{xs:1}}>
                        <IconButton
                          onClick={() => arrayHelpers.remove(index)}
                          disabled={formik.values.features.length <= 1}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </>
              )}
            />
          </Box>
        </FormikProvider>
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
