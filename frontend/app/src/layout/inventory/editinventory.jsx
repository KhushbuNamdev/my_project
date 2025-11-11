import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { updateInventoryItem } from "../../Slice/inventorySlice";

const EditInventory = ({ open, onClose, item, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    quantity: "",
    usedQuantity: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        quantity: item.quantity || 0,
        usedQuantity: item.usedQuantity || 0,
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
const handleSubmit = async () => {
  if (!item?._id) return;
  setLoading(true);
  try {
    const updateData = {
      quantity: Number(formData.quantity),
      usedQuantity: Number(formData.usedQuantity),
    };

    const updatedResponse = await dispatch(
      updateInventoryItem({ id: item._id, updateData })
    ).unwrap();

    const updatedItem = {
      ...item,
      ...updateData,
      availableQuantity:
        (updateData.quantity || item.quantity) -
        (updateData.usedQuantity || item.usedQuantity),
    };

    // ✅ directly call parent success (parent will close dialog)
    if (onSuccess) onSuccess(updatedItem);
  } catch (error) {
    console.error("Failed to update inventory:", error);
  } finally {
    setLoading(false);
  }
};



  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Edit Inventory</DialogTitle>
      <DialogContent>
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
            value={formData.quantity}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Used Quantity"
            name="usedQuantity"
            type="number"
            value={formData.usedQuantity}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditInventory;
