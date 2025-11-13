import React, { useState } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import {
  createNewInventory,
  fetchAllInventory,
} from "../../Slice/inventorySlice";
import { fetchAllProducts } from "../../Slice/productSlice";
import MDDialogBox from "../../custom/MDdialogbox";
import MDButton from "../../custom/MDbutton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const AddQuantityDialog = ({ open, onClose, product, onSuccess }) => {
  const dispatch = useDispatch();

  // Inventory items (no default quantity)
  const [inventoryItems, setInventoryItems] = useState([
    { serialNumber: "", quantity: "", price: "", discount: "" },
  ]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handle input change for each item
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...inventoryItems];

    if (field === "quantity") {
      // Allow only positive integers or empty
      if (value !== "" && (!/^[0-9]+$/.test(value) || parseInt(value, 10) < 1)) {
        return;
      }
    } else if (field === "price") {
      // Allow empty or valid number up to 2 decimals
      if (value !== "" && !/^\d*\.?\d{0,2}$/.test(value)) {
        return;
      }
    }

    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setInventoryItems(updatedItems);
  };

  // Add new item
  const handleAddItem = () => {
    setInventoryItems([
      ...inventoryItems,
      { serialNumber: "", quantity: "", price: "", discount: "" },
    ]);
  };

  // Remove specific item
  const handleRemoveItem = (index) => {
    if (inventoryItems.length <= 1) return;
    const updatedItems = inventoryItems.filter((_, i) => i !== index);
    setInventoryItems(updatedItems);
  };

  // Submit all inventory items
  const handleSubmit = async () => {
    if (!product) {
      setSnackbar({
        open: true,
        message: "Product not selected",
        severity: "error",
      });
      return;
    }

    const hasInvalidItems = inventoryItems.some(
      (item) =>
        !item.serialNumber ||
        !item.quantity ||
        isNaN(parseFloat(item.quantity)) ||
        parseFloat(item.quantity) < 1 ||
        !item.price ||
        isNaN(parseFloat(item.price)) ||
        parseFloat(item.price) < 0 ||
        (item.discount && 
          (isNaN(parseFloat(item.discount)) || 
           parseFloat(item.discount) < 0 || 
           parseFloat(item.discount) > 100))
    );

    if (hasInvalidItems) {
      setSnackbar({
        open: true,
        message:
          "Please fill valid Serial Number, Quantity & Price for all items",
        severity: "error",
      });
      return;
    }

    try {
      const inventoryData = {
        productId: product._id,
        items: inventoryItems.map((item) => ({
          serialNumber: item.serialNumber,
          quantity: Number(item.quantity),
          price: parseFloat(item.price),
        })),
      };

      await dispatch(createNewInventory(inventoryData)).unwrap();
      await Promise.all([
        dispatch(fetchAllProducts()),
        dispatch(fetchAllInventory()),
      ]);

      setSnackbar({
        open: true,
        message: "Inventory added successfully!",
        severity: "success",
      });

      // Reset to blank single entry
      setInventoryItems([{ serialNumber: "", quantity: "", price: "" }]);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding inventory:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to add inventory",
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
        {/* Inventory Items */}
        {inventoryItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              flexWrap: 'wrap'
            }}
          >
            <TextField
              label="Serial Number"
              fullWidth
              sx={{ flex: 2 }}
              value={item.serialNumber}
              onChange={(e) =>
                handleItemChange(index, "serialNumber", e.target.value)
              }
              required
            />
            <TextField
              label="Quantity"
              type="number"
              sx={{ flex: 1 }}
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              slotsProps={{ min: 1, step: 1 }}
              required
            />
            <TextField
              label="Price"
              type="number"
              sx={{ flex: 1 }}
              value={item.price}
              onChange={(e) =>
                handleItemChange(index, "price", e.target.value)
              }
              onBlur={(e) => {
                const value = e.target.value;
                if (value && !isNaN(value) && value.trim() !== "") {
                  handleItemChange(
                    index,
                    "price",
                    parseFloat(value).toFixed(2)
                  );
                }
              }}
              slotProps={{
                startAdornment: '₹',
              }}
             
              required
            />
            <TextField
              label="Discount %"
              type="number"
              sx={{ flex: 1 }}
              value={item.discount}
              onChange={(e) =>
                handleItemChange(index, "discount", e.target.value)
              }
              onBlur={(e) => {
                const value = e.target.value;
                if (value && !isNaN(value) && value.trim() !== "") {
                  const discount = parseFloat(value);
                  if (discount >= 0 && discount <= 100) {
                    handleItemChange(
                      index,
                      "discount",
                      discount.toString()
                    );
                  }
                }
              }}
              slotProps={{
                min: 0,
                max: 100,
                step: 0.01
              }}
              // helperText={item.discount && parseFloat(item.discount) > 0 ? 
              //   `Discounted Price: ₹${(item.price * (1 - (parseFloat(item.discount) / 100))).toFixed(2)}` : 
              //   ''}
            />
            {inventoryItems.length > 1 && (
              <IconButton 
                onClick={() => handleRemoveItem(index)}
                color="error"
                sx={{ mt: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
            <IconButton
              color="error"
              onClick={() => handleRemoveItem(index)}
              disabled={inventoryItems.length <= 1}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        {/* Add More */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            fullWidth
          >
            Add Another Item
          </Button>
        </Box>
      </MDDialogBox>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddQuantityDialog;
