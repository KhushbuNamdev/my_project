import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInventory } from "../../Slice/inventorySlice";
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Grid,
  
} from "@mui/material";
import MDSearchBar from "../../custom/MDsearchbar";
import MDButton from "../../custom/MDbutton";

import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const InventoryView = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.inventory);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllInventory());
  }, [dispatch]);

  const handleEdit = (id) => {
    console.log("Edit clicked for ID:", id);
    // TODO: open edit dialog or navigate to edit page
  };

  const handleDelete = (id) => {
    console.log("Delete clicked for ID:", id);
    // TODO: show confirmation and delete item
  };

  const columns = [
    { field: "productName", headerName: "Product Name", flex: 1.5, width: 200 },
    { field: "quantity", headerName: "Quantity", flex: 1.5, width: 150 },
    { field: "usedQuantity", headerName: "Used Qty", flex: 1.5, width: 150 },
    { field: "availableQuantity", headerName: "Available Qty", flex: 1.5, width: 150 },
    { field: "status", headerName: "Status", flex: 1.5, width: 150 },
    { field: "lowStockThreshold", headerName: "Low Stock", flex: 1.5, width: 150 },
    {
      field: "actions",
      headerName: "Actions",
  width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box gap={5}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEdit(params.row.id)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Filter rows based on search term
  const filteredRows = useMemo(() => {
    if (!searchTerm) return items;
    
    const searchLower = searchTerm.toLowerCase();
    return items.filter(item => {
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

  const rows = filteredRows.map((item) => ({
    id: item._id, // required internally, but not displayed
    productName: item.productId?.name || "N/A",
    quantity: item.quantity,
    usedQuantity: item.usedQuantity,
    availableQuantity: item.availableQuantity,
    status: item.status,
    lowStockThreshold: item.lowStockThreshold,
  }));

  return (
    <Box p={2}>
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        
            <MDSearchBar 
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          
         
            <MDButton variant="gradient" color="info">
              Add New Item
            </MDButton>
           
         
      
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper elevation={2} sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </Paper>
      )}
    </Box>
  );
};

export default InventoryView;
