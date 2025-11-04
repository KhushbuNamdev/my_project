import React, { useEffect } from 'react';
import { Button, TextField, Grid, Typography, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import MDDialogBox from '../../custom/MDdailogbox';
import MDButton from '../../custom/MDbutton';
const CreateSalesman = ({ open, onClose, onSubmit, loading = false, error = null }) => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      phoneNumber: '',
      role: 'sales',
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        // Add default email and password for the sales role
        const userData = {
          ...values,
          email: `${values.phoneNumber}@example.com`,
          password: 'defaultPassword123!',
        };
        await onSubmit(userData);
        resetForm();
      } catch (err) {
        console.error('Error submitting form:', err);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  // Reset form when dialog is opened/closed
  useEffect(() => {
    if (open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <MDDialogBox
      open={open}
      onClose={onClose}
      title="Add New Salesperson"
      maxWidth="sm"
      fullWidth
      actions={[
        
        <MDButton
          key="submit"
          onClick={formik.handleSubmit}
        //   color="primary"
          disabled={!formik.isValid || formik.isSubmitting || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Creating...' : 'Create'}
        </MDButton>,
      ]}
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} sx={{ }}>
         <Grid size={{xs:12 , md:6}}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              disabled={loading}
            />
          </Grid>
      <Grid size={{xs:12 , md:6}}>
            <TextField
              fullWidth
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              disabled={loading}
              slotProps={{ maxLength: 10 }}
            />
          </Grid>
          {error && (
            <Grid size={{xs:12}}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Grid>
          )}
        </Grid>
      </form>
    </MDDialogBox>
  );
};

CreateSalesman.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default CreateSalesman;