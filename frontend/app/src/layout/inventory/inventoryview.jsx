



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
import MDDataGrid from "../../custom/MDdatagrid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryDelete from "./deleteInventory";
import EditInventory from "./editinventory";
const InventoryView = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.inventory);

  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [filteredItems, setFilteredItems] = useState([]);
const [editDialogOpen, setEditDialogOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

  // ✅ Fetch inventory and keep only those where productId is NOT null
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchAllInventory()).unwrap();

        // ✅ Some APIs return { success, data: [...] } — handle both cases safely
        const inventoryData = res?.data || res;

        // ✅ Filter only those having productId (not null)
        const validItems = Array.isArray(inventoryData)
          ? inventoryData.filter((item) => item.productId && item.productId._id)
          : [];

        setFilteredItems(validItems);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setSnackbar({
          open: true,
          message: "Failed to load inventory",
          severity: "error",
        });
      }
    };

    fetchData();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch]);

  const handleEdit = (id) => {
  const itemToEdit = filteredItems.find((item) => item._id === id);
  setSelectedItem(itemToEdit);
  setEditDialogOpen(true);
};


  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

 const handleConfirmDelete = async () => {
  // Close dialog immediately
  setDeleteDialogOpen(false);
  setSelectedId(null);

  try {
    await dispatch(deleteInventoryItem(selectedId)).unwrap();
    // Update local state
    setFilteredItems((prev) => prev.filter((item) => item._id !== selectedId));
    setSnackbar({
      open: true,
      message: "Inventory deleted successfully",
      severity: "success",
    });
  } catch (error) {
    console.error("Delete error:", error);
    setSnackbar({
      open: true,
      message: error || "Failed to delete inventory",
      severity: "error",
    });
  }
};


  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

 

  const processedInventory = useMemo(() => {
  if (!Array.isArray(filteredItems)) return [];
  return filteredItems.map((item) => ({
    id: item._id, // required by DataGrid
    _id: item._id,
    productName: item.productId?.name || "Unknown Product",
    quantity: item.quantity || 0,
    usedQuantity: item.usedQuantity || 0,
    availableQuantity:
      item.availableQuantity ?? (item.quantity || 0) - (item.usedQuantity || 0),
    createdAt: new Date(item.createdAt).toLocaleString(), // ✅ formatted date
  }));
}, [filteredItems]);


  // ✅ Apply search
  const displayedInventory = useMemo(() => {
    if (!searchTerm) return processedInventory;
    const searchLower = searchTerm.toLowerCase();
    return processedInventory.filter((item) =>
      item.productName.toLowerCase().includes(searchLower)
    );
  }, [processedInventory, searchTerm]);

  const columns = [
    { field: "productName", headerName: "Product Name", minWidth: 200 },
    { field: "quantity", headerName: "Total Quantity", flex: 1, minWidth: 120 },
    { field: "usedQuantity", headerName: "Used Quantity", flex: 1, minWidth: 120 },
    { field: "availableQuantity", headerName: "Available Quantity", flex: 1, minWidth: 120 },
      { field: "createdAt", headerName: "Created At", flex: 1.2, minWidth: 180 }, // ✅ new column
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 130,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row._id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteClick(params.row._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (displayedInventory.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6">No inventory items found</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
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

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDSearchBar
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Paper elevation={0} sx={{ height: 500, width: "100%", p: 1 }}>
        <MDDataGrid
          rows={displayedInventory}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          loading={loading}
        />
      </Paper>

      {/* ✅ Delete Confirmation Dialog */}
      <InventoryDelete
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Inventory"
        content="Are you sure you want to delete this inventory item? This action cannot be undone."
      />


   <EditInventory
  open={editDialogOpen}
  onClose={() => setEditDialogOpen(false)}
  item={selectedItem}
  onSuccess={(updatedItem) => {
    // ✅ Update the local filteredItems array
    setFilteredItems((prev) =>
      prev.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );

    setSnackbar({
      open: true,
      message: "Inventory updated successfully",
      severity: "success",
    });
  }}
/>


    </Box>

  );
};

export default InventoryView;