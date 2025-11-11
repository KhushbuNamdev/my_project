import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../Slice/userSlice';
import MDDialogBox from '../../custom/MDdialogbox';
import MDButton from '../../custom/MDbutton';

// ✅ Validation schema
const validationSchema = Yup.object({
  name: Yup.string(),
  businessName: Yup.string(),
  adharNumber: Yup.string().test(
    'aadhar-format',
    'Aadhar number must be 12 digits',
    (value) => !value || /^\d{12}$/.test(value)
  ),
  gstNumber: Yup.string().test(
    'gst-format',
    'Enter a valid GST number',
    (value) =>
      !value ||
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)
  ),
  address: Yup.object({
    street: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    pincode: Yup.string(),
  }),
});

const EditWholesalerDialog = ({ open, onClose, wholesaler, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  // ✅ Initial values
  const getInitialValues = () => ({
    name: '',
    businessName: '',
    adharNumber: '',
    gstNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  const [initialValues, setInitialValues] = useState(getInitialValues());

  // ✅ Set initial form data when opening dialog
  useEffect(() => {
    if (open && wholesaler) {
      let street = '';
      let city = '';
      let state = '';
      let pincode = '';

      if (wholesaler.fullAddress) {
        const parts = wholesaler.fullAddress.split(',').map((p) => p.trim());
        if (parts.length > 0) street = parts[0];
        if (parts.length > 1) city = parts[1];

        if (parts.length > 2) {
          const lastPart = parts[parts.length - 1];
          const secondLastPart = parts.length > 2 ? parts[parts.length - 2] : '';
          const pincodeMatch = lastPart.match(/\d+/);

          if (pincodeMatch) {
            pincode = pincodeMatch[0];
            state = secondLastPart || '';
          } else if (secondLastPart && secondLastPart.match(/\d+/)) {
            pincode = secondLastPart.match(/\d+/)[0];
            state = parts.length > 3 ? parts[parts.length - 3] : lastPart;
          } else if (parts.length === 4) {
            state = parts[2];
            pincode = lastPart;
          } else {
            state = lastPart;
          }
          state = state.replace(/[0-9-]/g, '').trim();
        }
      }

      const newValues = {
        name: wholesaler.name || '',
        businessName: wholesaler.businessName || '',
        adharNumber: wholesaler.adharNumber || '',
        gstNumber: wholesaler.gstNumber || '',
        address: {
          street: wholesaler.address?.street || street || '',
          city: wholesaler.address?.city || city || '',
          state: wholesaler.address?.state || state || '',
          pincode: wholesaler.address?.pincode || pincode || '',
        },
      };

      setInitialValues(newValues);
    } else if (!open) {
      setInitialValues(getInitialValues());
    }
  }, [wholesaler, open]);

  // ✅ Submit handler
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updatedFields = {};

      ['name', 'businessName', 'adharNumber', 'gstNumber'].forEach((key) => {
        if (values[key] !== initialValues[key]) {
          updatedFields[key] = values[key];
        }
      });

      const addressChanges = {};
      ['street', 'city', 'state', 'pincode'].forEach((field) => {
        if (values.address[field] !== initialValues.address[field]) {
          addressChanges[field] = values.address[field];
        }
      });

      if (Object.keys(addressChanges).length > 0) {
        updatedFields.address = {
          ...wholesaler.address,
          ...addressChanges,
        };
      }

      if (Object.keys(updatedFields).length === 0) {
        onClose();
        return;
      }

      await dispatch(
        updateUser({
          userId: wholesaler._id,
          userData: updatedFields,
        })
      ).unwrap();

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating wholesaler:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MDDialogBox
      open={open}
      onClose={onClose}
      title="Edit Wholesaler"
      actions={null}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Grid container spacing={2}>
             <Grid size={{xs:12 , md:6}}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid size={{xs:12 , md:6}}>
                <TextField
                  fullWidth
                  label="Business Name"
                  name="businessName"
                  value={values.businessName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.businessName && Boolean(errors.businessName)}
                  helperText={touched.businessName && errors.businessName}
                />
              </Grid>
              <Grid size={{xs:12 , md:6}}>
                <TextField
                  fullWidth
                  label="Aadhar Number"
                  name="adharNumber"
                  value={values.adharNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.adharNumber && Boolean(errors.adharNumber)}
                  helperText={
                    (touched.adharNumber && errors.adharNumber) ||
                    '12-digit Aadhar number'
                  }
                />
              </Grid>
              <Grid size={{xs:12 , md:6}}>
                <TextField
                  fullWidth
                  label="GST Number"
                  name="gstNumber"
                  value={values.gstNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.gstNumber && Boolean(errors.gstNumber)}
                  helperText={
                    (touched.gstNumber && errors.gstNumber) ||
                    'Format: 22AAAAA0000A1Z5'
                  }
                />
              </Grid>

              {/* Address Fields */}
              <Grid size={{xs:12 , md:6}}>
                <TextField
                  fullWidth
                  label="Street"
                  name="address.street"
                  value={values.address?.street || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="small"
                />
              </Grid>
              <Grid size={{xs:12 , md:6}}>
                <TextField
                  fullWidth
                  label="City"
                  name="address.city"
                  value={values.address?.city || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="small"
                />
              </Grid>
              <Grid size={{xs:12 , md:6}}>
                <TextField
                  fullWidth
                  label="State"
                  name="address.state"
                  value={values.address?.state || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="small"
                />
              </Grid>
              <Grid size={{xs:12 , md:6}}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="address.pincode"
                  value={values.address?.pincode || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="small"
                />
              </Grid>

              <Grid size={{xs:12 , md:6}}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={wholesaler?.phoneNumber || ''}
                  disabled
                />
              </Grid>
            </Grid>

            {/* ✅ Custom Actions */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 3,
              }}
            >
             
              <MDButton
                type="submit"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <CircularProgress size={24} />
                ) : (
                  'Update Wholesaler'
                )}
              </MDButton>
            </Box>
          </Form>
        )}
      </Formik>
    </MDDialogBox>
  );
};

export default EditWholesalerDialog;
