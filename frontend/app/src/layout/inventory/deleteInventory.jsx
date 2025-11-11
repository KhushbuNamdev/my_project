import React from "react";
import { Button, Typography, Box } from "@mui/material";
import MDDialogBox from "../../custom/MDdailogbox";
import MDButton from "../../custom/MDbutton";
const InventoryDelete = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Inventory Item",
  content = "Are you sure you want to delete this inventory item? This action cannot be undone.",
  confirmText = "Delete",
  
}) => {
  return (
    <MDDialogBox
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
         
          <MDButton
            onClick={onConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            {confirmText}
          </MDButton>
        </>
      }
    >
      <Box sx={{ }}>
        <Typography variant="body1" >
          {content}
        </Typography>
      </Box>
    </MDDialogBox>
  );
};

export default InventoryDelete;



