import React, { useState } from "react";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { createNewInventory, fetchAllInventory } from "../../Slice/inventorySlice";
import { fetchAllProducts } from "../../Slice/productSlice";
import MDDialogBox from "../../custom/MDdailogbox";
import MDButton from "../../custom/MDbutton";

const AddQuantityDialog = ({ open, onClose, product, onSuccess }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = async () => {
    const quantityNum = parseInt(quantity, 10);
    
    if (!product || !quantity || isNaN(quantityNum)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid number for quantity",
        severity: "error",
      });
      return;
    }
    
    if (quantityNum <= 0) {
      setSnackbar({
        open: true,
        message: "Quantity must be greater than zero",
        severity: "error",
      });
      return;
    }

    try {
      await dispatch(
        createNewInventory({
          productId: product._id,
          quantity: parseInt(quantity, 10),
        })
      ).unwrap();

      // Refresh both products and inventory data
      await Promise.all([
        dispatch(fetchAllProducts()),
        dispatch(fetchAllInventory())
      ]);

      setSnackbar({
        open: true,
        message: "Quantity added successfully!",
        severity: "success",
      });

      setQuantity("");
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to add quantity",
        severity: "error",
      });
    }
  };

  return (
    <>
      {/* ✅ Using MDDialogBox */}
      <MDDialogBox
        open={open}
        onClose={onClose}
        title="Add Quantity"
        actions={
          <>
            
            <MDButton  onClick={handleSubmit}>
              Submit
            </MDButton>
          </>
        }
      >
        <TextField
          fullWidth
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => {
            const value = e.target.value;
            // Only allow positive numbers
            if (value === '' || (parseInt(value, 10) > 0)) {
              setQuantity(value);
            }
          }}
          inputProps={{
            min: 1,
            step: 1
          }}
          error={quantity !== '' && (isNaN(parseInt(quantity, 10)) || parseInt(quantity, 10) <= 0)}
          helperText={quantity !== '' && (isNaN(parseInt(quantity, 10)) || parseInt(quantity, 10) <= 0) 
            ? 'Please enter a valid quantity greater than zero' 
            : ''}
        />
      </MDDialogBox>

      {/* ✅ Snackbar (bottom-right) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddQuantityDialog;
