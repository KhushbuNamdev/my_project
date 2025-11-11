// src/components/Inventory/DeleteProductDialog.jsx
import React from "react";
import ConfirmDialog from "../../custom/confirmdialog";

const DeleteProductDialog = ({ open, onClose, onConfirm, productName = "this product" }) => {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Confirm Delete"
      confirmLabel="Delete"
      message={
        <>
          Are you sure you want to delete <strong>{productName}</strong>? This action cannot be undone.
        </>
      }
    />
  );
};

export default DeleteProductDialog;
