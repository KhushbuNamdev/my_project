import React, { useEffect } from "react";
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
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  updateExistingCategory,
  resetCategoryState,
} from "../../Slice/categorySlice";
import MDDialogBox from "../../custom/MDdialogbox";
import MDButton from "../../custom/MDbutton";

const EditCategory = ({ open, onClose, category, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.category);

  // Formik + Yup validation
  const validationSchema = Yup.object({
    name: Yup.string().required("Category name is required"),
    description: Yup.string().required("Description is required"),
    status: Yup.string().oneOf(["active", "inactive"]).required("Status is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: category?.name || "",
      description: category?.description || "",
      status: category?.status || "active",
    },
    validationSchema,
    onSubmit: (values, { setErrors }) => {
      if (!category?._id) return;

      // Check if anything changed
      const isUnchanged =
        values.name === (category?.name || "") &&
        values.description === (category?.description || "") &&
        values.status === (category?.status || "active");

      if (isUnchanged) {
        setErrors({ name: "Please update at least one field" });
        return;
      }

      dispatch(updateExistingCategory({ id: category._id, updateData: values }));
    },
  });

  // Handle success: reset form, close dialog, refresh list
  useEffect(() => {
    if (success) {
      formik.resetForm();
      dispatch(resetCategoryState());
      onClose();
      onSuccess?.();
    }
  }, [success, dispatch, onClose, onSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MDDialogBox
      open={open}
      onClose={onClose}
      title="Edit Category"
      actions={
        <MDButton
          onClick={async () => {
            // Validate all fields
            const errors = await formik.validateForm();

            if (Object.keys(errors).length > 0) {
              // Mark all fields as touched to show errors
              formik.setTouched({
                name: true,
                description: true,
                status: true,
              });
              return;
            }

            // Dispatch formik submit if valid
            formik.handleSubmit();
          }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Saving..." : "Save Changes"}
        </MDButton>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          {/* Show general error from backend */}
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Category Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            required
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            multiline
            required
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />

          <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
            {formik.touched.status && formik.errors.status && (
              <Box mt={0.5} ml={1} color="error.main" fontSize={12}>
                {formik.errors.status}
              </Box>
            )}
          </FormControl>
        </Box>
      </form>
    </MDDialogBox>
  );
};

export default EditCategory;
