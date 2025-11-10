import React from "react";
import { Box, Typography, Button } from "@mui/material";
import MDDialogBox from "../../custom/MDdailogbox"; // ✅ import your custom MDDialogBox
import MDButton from "../../custom/MDbutton";
const DeleteInventory = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Inventory Item",
  content = "Are you sure you want to delete this inventory item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
}) => {
  return (
    <MDDialogBox
      open={open}
      onClose={!loading ? onClose : null}
      title={title}
      actions={
        <>
          <MDButton onClick={onClose} disabled={loading} variant="outlined" color="inherit">
            {cancelText}
          </MDButton>
          <MDButton
            onClick={onConfirm}
          
         
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmText}
          </MDButton>
        </>
      }
    >
      <Box>
        <Typography variant="body1" color="text.primary">
          {content}
        </Typography>
      </Box>
    </MDDialogBox>
  );
};

export default DeleteInventory;
