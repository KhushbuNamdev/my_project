import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInventory, deleteInventoryItem } from "../../Slice/inventorySlice";
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";
import MDSearchBar from "../../custom/MDsearchbar";
import MDButton from "../../custom/MDbutton";
import DeleteInventory from "./deleteInventory";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MDDataGrid from "../../custom/MDdatagrid"; // ✅ use custom MDDataGrid

const InventoryView = () => {
  const dispatch = useDispatch();
  const { items, loading, error, deleteLoading } = useSelector(
    (state) => state.inventory
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // In inventoryview.jsx - Update the useEffect
  // Fetch data when component mounts and when it becomes visible
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchAllInventory());
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    // Set up visibility change listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };

    // Initial fetch
    fetchData();

    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch]);

  const handleEdit = (id) => {
    console.log("Edit clicked for ID:", id);
    // TODO: open edit dialog or navigate to edit page
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await dispatch(deleteInventoryItem(itemToDelete)).unwrap();
      setSnackbar({
        open: true,
        message: "Inventory item deleted successfully",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err || "Failed to delete inventory item",
        severity: "error",
      });
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ✅ Columns for MDDataGrid
  const columns = [
    { field: "productName", headerName: "Product Name", flex: 1.5, minWidth: 200 },
    { field: "quantity", headerName: "Quantity", flex: 1, minWidth: 120 },
    { field: "usedQuantity", headerName: "Used Qty", flex: 1, minWidth: 120 },
    { field: "availableQuantity", headerName: "Available Qty", flex: 1, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 120 },
    { field: "lowStockThreshold", headerName: "Low Stock", flex: 1, minWidth: 120 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 130,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              size="small"
            
              onClick={() => handleEdit(params.row.id)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
         
              onClick={() => handleDeleteClick(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // ✅ Filter rows based on search term
  const filteredRows = useMemo(() => {
    if (!searchTerm) return items;

    const searchLower = searchTerm.toLowerCase();
    return items.filter((item) => {
      return (
        (item.productId?.name || "").toLowerCase().includes(searchLower) ||
        (item.status || "").toLowerCase().includes(searchLower) ||
        (item.quantity?.toString() || "").includes(searchTerm) ||
        (item.usedQuantity?.toString() || "").includes(searchTerm) ||
        (item.availableQuantity?.toString() || "").includes(searchTerm) ||
        (item.lowStockThreshold?.toString() || "").includes(searchTerm)
      );
    });
  }, [items, searchTerm]);

  // ✅ Transform backend data into DataGrid rows
  const rows = filteredRows.map((item) => ({
    id: item._id, // required unique ID
    productName: item.productId?.name || "N/A",
    quantity: item.quantity,
    usedQuantity: item.usedQuantity,
    availableQuantity: item.availableQuantity,
    status: item.status,
    lowStockThreshold: item.lowStockThreshold,
  }));

  return (
    <Box p={2}>
      {/* Delete Confirmation Dialog */}
      <DeleteInventory
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
       
        
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Search bar + Add button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDSearchBar
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
       
      </Box>

      {/* Data Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper elevation={0} sx={{ height: 500, width: "100%", p: 1 }}>
          <MDDataGrid rows={rows} columns={columns} pageSize={5} />
        </Paper>
      )}
    </Box>
  );
};

export default InventoryView;
