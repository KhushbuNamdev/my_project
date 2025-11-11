// src/components/Inventory/InventoryDelete.jsx
import React from "react";
import ConfirmDialog from "../../custom/confirmdialog";

const InventoryDelete = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Inventory Item",
  content = "Are you sure you want to delete this inventory item? This action cannot be undone.",
  confirmText = "Delete",
}) => {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      message={content}
      confirmLabel={confirmText}
    />
  );
};

export default InventoryDelete;
