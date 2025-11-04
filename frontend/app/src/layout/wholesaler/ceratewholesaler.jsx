import React, { useEffect } from 'react';
import { Button, TextField, Grid, Typography, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import MDDialogBox from '../../custom/MDdailogbox';
const CreateWholesaler = ({ open, onClose, onSubmit, loading = false, error = null }) => {

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    gstNumber: Yup.string().required('GST number is required'),
    address: Yup.string().required('Address is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    businessName: Yup.string().required('Business name is required'),
    aadharNumber: Yup.string()
      .matches(/^[0-9]{12}$/, 'Aadhar number must be 12 digits')
      .required('Aadhar number is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      gstNumber: '',
      address: '',
      phoneNumber: '',
      businessName: '',
      aadharNumber: '',
      role: 'wholesaler',
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await onSubmit(values);
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

  const dialogActions = (
    <>
      <Button onClick={onClose} color="error" disabled={loading}>
        Cancel
      </Button>
      <Button 
        onClick={formik.handleSubmit} 
        color="primary"
        disabled={loading || !formik.isValid || !formik.dirty}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Creating...' : 'Create'}
      </Button>
    </>
  );

  return (
    <MDDialogBox
      open={open}
      onClose={onClose}
      title="Create New Wholesaler"
      actions={dialogActions}
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {/* <Grid item xs={12} md={6}> */}
          <Grid size={{ xs:12 , md:6}}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Full Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="normal"
            />
          </Grid>
        <Grid size={{ xs:12 , md:6}}>
            <TextField
              fullWidth
              id="businessName"
              name="businessName"
              label="Business Name"
              value={formik.values.businessName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.businessName && Boolean(formik.errors.businessName)}
              helperText={formik.touched.businessName && formik.errors.businessName}
              margin="normal"
            />
          </Grid>
         <Grid size={{ xs:12 , md:6}}>
            <TextField
              fullWidth
              id="gstNumber"
              name="gstNumber"
              label="GST Number"
              value={formik.values.gstNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.gstNumber && Boolean(formik.errors.gstNumber)}
              helperText={formik.touched.gstNumber && formik.errors.gstNumber}
              margin="normal"
            />
          </Grid>
          <Grid size={{ xs:12 , md:6}}>
            <TextField
              fullWidth
              id="aadharNumber"
              name="aadharNumber"
              label="Aadhar Number"
              value={formik.values.aadharNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.aadharNumber && Boolean(formik.errors.aadharNumber)}
              helperText={formik.touched.aadharNumber && formik.errors.aadharNumber}
              margin="normal"
              slotProps={{ maxLength: 12 }}
            />
          </Grid>
           <Grid size={{ xs:12 , md:6}}>
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
              margin="normal"
              slotProps={{ maxLength: 10 }}
            />
          </Grid>
        <Grid size={{ xs:12 , md:6}}>
            <TextField
              fullWidth
              id="address"
              name="address"
              label="Address"
              multiline
            //   rows={3}
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              margin="normal"
            />
          </Grid>
        </Grid>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </form>
    </MDDialogBox>
  );
};

CreateWholesaler.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default CreateWholesaler;