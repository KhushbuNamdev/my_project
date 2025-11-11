import React, { useEffect } from "react";
import { TextField, CircularProgress, Box, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createNewCategory, resetCategoryState } from "../../Slice/categorySlice";
import MDDialogBox from "../../custom/MDdialogbox";
import MDButton from "../../custom/MDbutton";

const AddCategory = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.category);

  // Reset form and handle success
  useEffect(() => {
    if (success) {
      formik.resetForm();
      dispatch(resetCategoryState());
      onClose();
      onSuccess?.();
    }
  }, [success, dispatch, onClose, onSuccess]);

  // Formik + Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Category name is required"),
    description: Yup.string(),
  });

  const formik = useFormik({
    initialValues: { name: "", description: "" },
    validationSchema,
    onSubmit: (values) => {
      dispatch(createNewCategory(values));
    },
    enableReinitialize: true,
  });

  return (
    <MDDialogBox
      open={open}
      onClose={onClose}
      title="Add New Category"
      actions={
        <MDButton
          onClick={formik.handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Creating..." : "Create"}
        </MDButton>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
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
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
        </Box>
      </form>
    </MDDialogBox>
  );
};

export default AddCategory;
