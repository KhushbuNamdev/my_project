import React, { useState, useEffect } from "react";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateInventoryItem } from "../../Slice/inventorySlice";
import MDDialogBox from "../../custom/MDdailogbox";

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

    // ✅ Close dialog immediately
    onClose();

    setLoading(true);

    const updatedItemTemp = {
      ...item,
      quantity: Number(formData.quantity),
      usedQuantity: Number(formData.usedQuantity),
      availableQuantity:
        Number(formData.quantity) - Number(formData.usedQuantity),
    };

    try {
      await dispatch(
        updateInventoryItem({
          id: item._id,
          updateData: {
            quantity: Number(formData.quantity),
            usedQuantity: Number(formData.usedQuantity),
          },
        })
      ).unwrap();

      // ✅ Update parent state/UI after backend confirms update
      if (onSuccess) onSuccess(updatedItemTemp);
    } catch (error) {
      console.error("Failed to update inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <MDDialogBox
      open={open}
      onClose={onClose}
      title="Edit Inventory"
      maxWidth="xs"
      fullWidth
      actions={
        <>
          <Button onClick={onClose} color="inherit">
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
        </>
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
    </MDDialogBox>
  );
};

export default EditInventory;
