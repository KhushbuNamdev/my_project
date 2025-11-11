import React, { useEffect } from 'react';
import { TextField, Grid, Typography, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import MDDialogBox from '../../custom/MDdailogbox';
import MDButton from '../../custom/MDbutton';

const CreateWholesaler = ({ open, onClose, onCreate, loading = false, error = null }) => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    businessName: Yup.string().required('Business name is required'),
    gstNumber: Yup.string().required('GST number is required'),
    adharNumber: Yup.string()
      .matches(/^[0-9]{12}$/, 'Aadhar number must be 12 digits')
      .required('Aadhar number is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits')
      .required('Pincode is required'),
    country: Yup.string().required('Country is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      businessName: '',
      gstNumber: '',
      adharNumber: '',
      phoneNumber: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India', // default
      role: 'wholesaler',
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        // ✅ format the data exactly as backend expects
        const formattedValues = {
          name: values.name,
          businessName: values.businessName,
          gstNumber: values.gstNumber,
          adharNumber: values.adharNumber,
          phoneNumber: values.phoneNumber,
          role: 'wholesaler',
          address: {
            street: values.street,
            city: values.city,
            state: values.state,
            pincode: values.pincode,
            country: values.country,
          },
        };
        await onCreate(formattedValues);
        resetForm();
      } catch (err) {
        console.error('Error submitting form:', err);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) formik.resetForm();
  }, [open]);

  const dialogActions = (
    <>
      <MDButton
        onClick={formik.handleSubmit}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Creating...' : 'Create'}
      </MDButton>
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
          {/* Name */}
          {/* <Grid item xs={12} md={6}> */}
          <Grid size = {{xs:12 , md:6}}>
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
           
            />
          </Grid>

          {/* Business Name */}
          <Grid size = {{xs:12 , md:6}}>
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
             
            />
          </Grid>

          {/* GST Number */}
        <Grid size = {{xs:12 , md:6}}>
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
             
            />
          </Grid>

          {/* Aadhar Number */}
        <Grid size = {{xs:12 , md:6}}>
            <TextField
              fullWidth
              id="adharNumber"
              name="adharNumber"
              label="Aadhar Number"
              value={formik.values.adharNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.adharNumber && Boolean(formik.errors.adharNumber)}
              helperText={formik.touched.adharNumber && formik.errors.adharNumber}
            
            />
          </Grid>

          {/* Phone Number */}
         <Grid size = {{xs:12 , md:6}}>
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
            
            />
          </Grid>

          {/* Street */}
        <Grid size = {{xs:12 , md:6}}>
            <TextField
              fullWidth
              id="street"
              name="street"
              label="Street"
              value={formik.values.street}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.street && Boolean(formik.errors.street)}
              helperText={formik.touched.street && formik.errors.street}
            
            />
          </Grid>

          {/* City */}
      <Grid size = {{xs:12 , md:6}}>
            <TextField
              fullWidth
              id="city"
              name="city"
              label="City"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            
            />
          </Grid>

          {/* State */}
          <Grid size = {{xs:12 , md:6}}>
            <TextField
              fullWidth
              id="state"
              name="state"
              label="State"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
            
            />
          </Grid>

          {/* Pincode */}
          <Grid size = {{xs:12 , md:6}}>
            <TextField
              fullWidth
              id="pincode"
              name="pincode"
              label="Pincode"
              value={formik.values.pincode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pincode && Boolean(formik.errors.pincode)}
              helperText={formik.touched.pincode && formik.errors.pincode}
            
            />
          </Grid>

          {/* Country */}
      <Grid size = {{xs:12 , md:6}}>
            <TextField
              fullWidth
              id="country"
              name="country"
              label="Country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.country && Boolean(formik.errors.country)}
              helperText={formik.touched.country && formik.errors.country}
            
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
  onCreate: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default CreateWholesaler;
