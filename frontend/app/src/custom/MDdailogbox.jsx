// src/components/common/MDDialogBox.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MDDialogBox = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "sm",
  fullWidth = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          backgroundColor: "#fecaca", // 🔥 pink background
          boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#fecaca",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <DialogTitle sx={{ m: 0, p: 0 }}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </DialogTitle>

        <IconButton onClick={onClose} sx={{ color: "#333" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent
        dividers
        sx={{
          backgroundColor: "#fff",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        {children}
      </DialogContent>

      {/* Actions */}
      {actions && (
        <DialogActions
          sx={{
            backgroundColor: "#fff",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default MDDialogBox;
