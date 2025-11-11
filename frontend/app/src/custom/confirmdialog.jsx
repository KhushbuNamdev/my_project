import React from "react";
import { Typography } from "@mui/material";
import MDDialogBox from "./MDdialogbox";
import MDButton from "./MDbutton";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm",
  message,
  confirmLabel = "Confirm",
  // cancelLabel = "Cancel",
}) => {
  return (
    <MDDialogBox
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
         
          <MDButton onClick={onConfirm} sx={{ ml: 1 }}>
            {confirmLabel}
          </MDButton>
        </>
      }
    >
      {typeof message === "string" ? (
        <Typography sx={{ fontSize: "16px" }}>{message}</Typography>
      ) : (
        message
      )}
    </MDDialogBox>
  );
};

export default ConfirmDialog
