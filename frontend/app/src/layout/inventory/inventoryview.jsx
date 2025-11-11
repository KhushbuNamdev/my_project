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

  // Fetch data when component mounts and when it becomes visible
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchAllInventory());
      } catch (error) {
        console.error('Error fetching inventory:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load inventory',
          severity: 'error',
        });
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

  // Log the items for debugging
  useEffect(() => {
    console.log('Inventory items:', items);
  }, [items]);

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

  // Group inventory items by product ID and calculate totals
  const groupedInventory = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    
    // First filter out items with null productId or missing product reference
    const validItems = items.filter(item => {
      const hasProduct = Boolean(item.product || item.productId);
      return hasProduct && item.productId !== null && item.productId !== undefined;
    });
    
    const grouped = validItems.reduce((acc, item) => {
      const productId = item.product?._id || item.productId?._id;
      const productName = item.product?.name || item.productId?.name;
      
      // Skip if we still somehow got a null product (shouldn't happen due to filter above)
      if (!productId) return acc;
      
      if (!acc[productId]) {
        acc[productId] = {
          id: productId,
          productId: productId,
          productName: productName,
          totalQuantity: 0,
          usedQuantity: 0,
          availableQuantity: 0,
          items: []
        };
      }
      
      acc[productId].totalQuantity += item.quantity || 0;
      acc[productId].usedQuantity += item.usedQuantity || 0;
      acc[productId].availableQuantity += (item.quantity || 0) - (item.usedQuantity || 0);
      acc[productId].items.push(item);
      
      return acc;
    }, {});
    
    return Object.values(grouped);
  }, [items]);

  // Filter based on search term
  const filteredInventory = useMemo(() => {
    if (!searchTerm) return groupedInventory;
    
    const searchLower = searchTerm.toLowerCase();
    return groupedInventory.filter(item => 
      item.productName.toLowerCase().includes(searchLower)
    );
  }, [groupedInventory, searchTerm]);

  // ✅ Columns for MDDataGrid
  const columns = [
    { 
      field: "productName", 
      headerName: "Product Name", 
      flex: 1.5, 
      minWidth: 200 
    },
    { 
      field: "totalQuantity", 
      headerName: "Total Quantity", 
      flex: 1, 
      minWidth: 120 
    },
    { 
      field: "usedQuantity", 
      headerName: "Used Quantity", 
      flex: 1, 
      minWidth: 120 
    },
    { 
      field: "availableQuantity", 
      headerName: "Available Quantity", 
      flex: 1, 
      minWidth: 120 
    },
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

  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Render empty state
  if (filteredInventory.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6">No inventory items found</Typography>
      </Box>
    );
  }

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
      <Paper elevation={0} sx={{ height: 500, width: "100%", p: 1 }}>
        <MDDataGrid
          rows={filteredInventory}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          loading={loading}
          components={{
            NoRowsOverlay: () => (
              <Box p={2} textAlign="center">
                <Typography>No inventory items found</Typography>
              </Box>
            ),
          }}
        />
      </Paper>
    </Box>
  );
};

export default InventoryView;