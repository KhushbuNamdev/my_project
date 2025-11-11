import React from "react";
import { Box, TextField, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateInventoryItem } from "../../Slice/inventorySlice";
import MDDialogBox from "../../custom/MDdialogbox";
import MDButton from "../../custom/MDbutton";

const EditInventory = ({ open, onClose, item, onSuccess }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      quantity: item?.quantity || 0,
      usedQuantity: item?.usedQuantity || 0,
    },
    validationSchema: Yup.object({
      quantity: Yup.number()
        .required("Total Quantity is required")
        .min(0, "Quantity cannot be negative"),
      usedQuantity: Yup.number()
        .required("Used Quantity is required")
        .min(0, "Used Quantity cannot be negative")
        .max(Yup.ref("quantity"), "Used Quantity cannot exceed Total Quantity"),
    }),
   onSubmit: async (values, { setSubmitting, setErrors }) => {
  if (!item?._id) return;

  if (
    Number(values.quantity) === Number(item.quantity) &&
    Number(values.usedQuantity) === Number(item.usedQuantity)
  ) {
    setErrors({
      usedQuantity: "Please update at least one field before saving",
    });
    return;
  }

  // ✅ Close dialog immediately
  onClose();

  try {
    await dispatch(
      updateInventoryItem({
        id: item._id,
        updateData: {
          quantity: Number(values.quantity),
          usedQuantity: Number(values.usedQuantity),
        },
      })
    ).unwrap();

    // optional: pass updated data back to parent
    if (onSuccess) {
      onSuccess({ ...item, ...values });
    }
  } catch (error) {
    console.error("Failed to update inventory:", error);
  } finally {
    setSubmitting(false);
  }
}

  });

  if (!item) return null;

  return (
    <MDDialogBox
      open={open}
      onClose={onClose}
      title="Edit Inventory"
      maxWidth="xs"
      fullWidth
      actions={
        <MDButton
          onClick={formik.handleSubmit}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? <CircularProgress size={24} /> : "Update"}
        </MDButton>
      }
    >
      <Box display="flex" flexDirection="column" gap={2} mt={1}>
        <TextField
          label="Product Name"
          value={item.productId?.name || "Unknown Product"}
          fullWidth
          disabled
        />
        <TextField
          label="Total Quantity"
          name="quantity"
          type="number"
          value={formik.values.quantity}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          error={formik.touched.quantity && !!formik.errors.quantity}
          helperText={formik.touched.quantity && formik.errors.quantity}
        />
        <TextField
          label="Used Quantity"
          name="usedQuantity"
          type="number"
          value={formik.values.usedQuantity}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          error={formik.touched.usedQuantity && !!formik.errors.usedQuantity}
          helperText={formik.touched.usedQuantity && formik.errors.usedQuantity}
        />
      </Box>
    </MDDialogBox>
  );
};

export default EditInventory;
