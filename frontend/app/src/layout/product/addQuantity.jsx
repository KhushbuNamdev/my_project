import React, { useState } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Box,
  Grid,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { createNewInventory, fetchAllInventory } from "../../Slice/inventorySlice";
import { fetchAllProducts } from "../../Slice/productSlice";
import MDDialogBox from "../../custom/MDdialogbox";
import MDButton from "../../custom/MDbutton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const AddQuantityDialog = ({ open, onClose, product, onSuccess }) => {
  const dispatch = useDispatch();

  // ✅ Store multiple entries for serial number, quantity, and price
  const [entries, setEntries] = useState([
    { serialNumber: "", quantity: "1", price: "" },
  ]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ Handle input change for each row
  const handleChange = (index, field, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index][field] = value;
    setEntries(updatedEntries);
  };

  // ✅ Reset form to initial state with defaults
  const handleReset = () => {
    setEntries([{ serialNumber: "", quantity: "1", price: "" }]);
  };

  // ✅ Add new row with default values
  const handleAddRow = () => {
    setEntries([...entries, { serialNumber: "", quantity: "1", price: "" }]);
  };

  // ✅ Remove specific row
  const handleRemoveRow = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  // ✅ Submit all entries
  const handleSubmit = async () => {
    if (!product) {
      setSnackbar({
        open: true,
        message: "Product not selected",
        severity: "error",
      });
      return;
    }

    // Validation: check for any empty or invalid entries
    for (const entry of entries) {
      if (
        !entry.serialNumber ||
        !entry.quantity ||
        entry.quantity === "" ||
        entry.price === "" ||
        isNaN(entry.quantity) ||
        entry.quantity <= 0 ||
        isNaN(entry.price) ||
        entry.price < 0
      ) {
        setSnackbar({
          open: true,
          message: "Please fill valid Serial Number, Quantity & Price for all rows",
          severity: "error",
        });
        return;
      }
    }

    try {
      // ✅ Dispatch inventory creation for each entry
      for (const entry of entries) {
        await dispatch(
          createNewInventory({
            productId: product._id,
            serialNumbers: [entry.serialNumber],
            quantity: parseInt(entry.quantity, 10) || 1, // Ensure we always have a quantity
            price: parseFloat(entry.price) || 0,
          })
        ).unwrap();
      }

      // ✅ Refresh products and inventory in parallel
      await Promise.all([
        dispatch(fetchAllProducts()),
        dispatch(fetchAllInventory()),
      ]);

      setSnackbar({
        open: true,
        message: "Inventory added successfully!",
        severity: "success",
      });

      setEntries([{ serialNumber: "", quantity: "1", price: "" }]);
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to add inventory",
        severity: "error",
      });
    }
  };

  return (
    <>
      <MDDialogBox
        open={open}
        onClose={onClose}
        title="Add Inventory Details"
        actions={
          <>
            <MDButton onClick={handleSubmit}>Submit</MDButton>
          </>
        }
      >
        {/* ✅ Dynamic form fields */}
        {entries.map((entry, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              label="Serial Number"
              fullWidth
              value={entry.serialNumber}
              onChange={(e) => handleChange(index, "serialNumber", e.target.value)}
            />
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={entry.quantity}
              onChange={(e) => {
                const value = e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value) || 1).toString();
                handleChange(index, "quantity", value);
              }}
              inputProps={{ min: 1, step: 1 }}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={entry.price}
              onChange={(e) => {
                // Allow empty string or valid number with up to 2 decimal places
                const value = e.target.value;
                if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
                  handleChange(index, "price", value);
                }
              }}
              onBlur={(e) => {
                // Format to 2 decimal places when input loses focus
                const value = e.target.value;
                if (value && !isNaN(value) && value.trim() !== '') {
                  handleChange(index, "price", parseFloat(value).toFixed(2));
                }
              }}
              inputProps={{ 
                min: 0, 
                step: "0.01" 
              }}
            />

            {/* ✅ Delete Row Button */}
            <IconButton
              color="error"
              onClick={() => handleRemoveRow(index)}
              disabled={entries.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        {/* ✅ Add More Button */}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddRow}
          sx={{ mt: 1 }}
        >
          Add More
        </Button>
      </MDDialogBox>

      {/* ✅ Snackbar */}
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
