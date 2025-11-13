// // src/pages/Inventory/InventoryView.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllInventory, deleteInventoryItem } from "../../Slice/inventorySlice";
// import {
//   Box,
//   CircularProgress,
//   Alert,
//   Typography,
//   IconButton,
//   Tooltip,
//   Snackbar,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import MDSearchBar from "../../custom/MDsearchbar";
// import MDDataGrid from "../../custom/MDdatagrid";
// import InventoryDelete from "./deleteInventory";
// import EditInventory from "./editinventory";

// const InventoryView = () => {
//   const dispatch = useDispatch();
//   const { items, loading, error } = useSelector((state) => state.inventory);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [tableLoading, setTableLoading] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   // ✅ Fetch inventory
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await dispatch(fetchAllInventory()).unwrap();
//         const inventoryData = res?.data || res;

//         const validItems = Array.isArray(inventoryData)
//           ? inventoryData.filter((item) => item.productId && item.productId._id)
//           : [];

//         setFilteredItems(validItems);
//       } catch (error) {
//         console.error("Error fetching inventory:", error);
//         setSnackbar({
//           open: true,
//           message: "Failed to load inventory",
//           severity: "error",
//         });
//       }
//     };

//     fetchData();

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "visible") {
//         fetchData();
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, [dispatch]);

//   // ✅ Handle Edit
//   const handleEdit = (id) => {
//     const itemToEdit = filteredItems.find((item) => item._id === id);
//     setSelectedItem(itemToEdit);
//     setEditDialogOpen(true);
//   };

//   // ✅ Handle Delete
//   const handleDeleteClick = (id) => {
//     setSelectedId(id);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     setDeleteDialogOpen(false);
//     const idToDelete = selectedId;
//     setSelectedId(null);

//     try {
//       await dispatch(deleteInventoryItem(idToDelete)).unwrap();
//       setFilteredItems((prev) => prev.filter((item) => item._id !== idToDelete));
//       setSnackbar({
//         open: true,
//         message: "Inventory deleted successfully",
//         severity: "success",
//       });
//     } catch (error) {
//       console.error("Delete error:", error);
//       setSnackbar({
//         open: true,
//         message: error || "Failed to delete inventory",
//         severity: "error",
//       });
//     }
//   };

//   // ✅ Refresh after update
//   const handleUpdateSuccess = async () => {
//     setTableLoading(true);
//     try {
//       const res = await dispatch(fetchAllInventory()).unwrap();
//       const inventoryData = res?.data || res;
//       const validItems = Array.isArray(inventoryData)
//         ? inventoryData.filter((item) => item.productId && item.productId._id)
//         : [];
//       setFilteredItems(validItems);
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: "Failed to refresh inventory",
//         severity: "error",
//       });
//     } finally {
//       setTableLoading(false);
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   // ✅ Process inventory data
//   const processedInventory = useMemo(() => {
//     if (!Array.isArray(filteredItems)) return [];
//     return filteredItems.map((item) => ({
//       id: item._id,
//       _id: item._id,
//       serialNumber: item.serialNumber || "N/A",
//       productName: item.productId?.name || "Unknown Product",
//       quantity: item.quantity || 0,
//       usedQuantity: item.usedQuantity || 0,
//       availableQuantity:
//         item.availableQuantity ?? (item.quantity || 0) - (item.usedQuantity || 0),
//       createdAt: new Date(item.createdAt).toLocaleString(),
//     }));
//   }, [filteredItems]);

//   // ✅ Apply search filter
//   const displayedInventory = useMemo(() => {
//     if (!searchTerm) return processedInventory;
//     const searchLower = searchTerm.toLowerCase();
//     return processedInventory.filter(
//       (item) =>
//         item.productName.toLowerCase().includes(searchLower) ||
//         item.serialNumber.toLowerCase().includes(searchLower)
//     );
//   }, [processedInventory, searchTerm]);

//   // ✅ Group + Sort (ascending) + Flatten with headers
//   const groupedAndSortedRows = useMemo(() => {
//     const groups = displayedInventory.reduce((acc, item) => {
//       const productName = item.productName || "Unknown Product";
//       if (!acc[productName]) acc[productName] = [];
//       acc[productName].push(item);
//       return acc;
//     }, {});

//     const rows = [];
//     Object.entries(groups).forEach(([productName, items]) => {
//       // Header row
//       rows.push({
//         id: `header-${productName}`,
//         isHeader: true,
//         productName,
//       });

//       // ✅ Sort serial numbers ascending (1 → 2 → 3)
//       const sortedItems = [...items].sort((a, b) => {
//         const numA = parseInt(a.serialNumber.replace(/\D/g, "")) || 0;
//         const numB = parseInt(b.serialNumber.replace(/\D/g, "")) || 0;
//         return numA - numB;
//       });

//       rows.push(...sortedItems);
//     });
//     return rows;
//   }, [displayedInventory]);

//   // ✅ Table Columns
//   const columns = [
//     {
//       field: "serialNumber",
//       headerName: "Serial Number",
//       flex: 1,
//       minWidth: 150,
//       renderCell: (params) => {
//         if (params.row.isHeader) {
//           return (
//             <Typography
//               variant="subtitle1"
//               sx={{
//                 fontWeight: "bold",
//                 backgroundColor: "rgba(0,0,0,0.05)",
//                 p: 1,
//                 borderRadius: "6px",
//                 width: "100%",
//               }}
//             >
//               📦 {params.row.productName}
//             </Typography>
//           );
//         }
//         return params.value;
//       },
//     },
//     { field: "quantity", headerName: "Total Qty", flex: 1, minWidth: 100 },
//     { field: "usedQuantity", headerName: "Used Qty", flex: 1, minWidth: 100 },
//     { field: "availableQuantity", headerName: "Available Qty", flex: 1, minWidth: 120 },
//     { field: "createdAt", headerName: "Created At", flex: 1.2, minWidth: 180 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       minWidth: 130,
//       sortable: false,
//       renderCell: (params) => {
//         if (params.row.isHeader) return null;
//         return (
//           <Box>
//             <Tooltip title="Edit">
//               <IconButton size="small" onClick={() => handleEdit(params.row._id)}>
//                 <EditIcon />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Delete">
//               <IconButton size="small" onClick={() => handleDeleteClick(params.row._id)}>
//                 <DeleteIcon />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         );
//       },
//     },
//   ];

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box p={3}>
//         <Alert severity="error">{error}</Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box p={3}>
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//       <Box
//         sx={{
//           borderRadius: "20px",
//           overflow: "hidden",
//           boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)",
//           backdropFilter: "blur(20px)",
//           backgroundColor: "rgba(255,255,255,0.6)",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "flex-start",
//             p: 2,
//             borderBottom: "1px solid rgba(255,255,255,0.5)",
//           }}
//         >
//           <MDSearchBar
//             placeholder="Search inventory..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </Box>

//           <MDDataGrid
//             rows={groupedAndSortedRows}
//             columns={columns}
//             getRowId={(row) => row.id}
//             pageSize={10}
//             disableSelectionOnClick
//             loading={loading || tableLoading}
//             autoHeight={false}
         
//             sx={{
//               "& .MuiDataGrid-row.Mui-selected": { backgroundColor: "transparent" },
//               "& .MuiDataGrid-cell": { borderBottom: "1px solid rgba(0,0,0,0.05)" },
//             }}
//           />
    
//       </Box>

//       <InventoryDelete
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         onConfirm={handleConfirmDelete}
//         title="Delete Inventory"
//         content="Are you sure you want to delete this inventory item? This action cannot be undone."
//       />

//       <EditInventory
//         open={editDialogOpen}
//         onClose={() => setEditDialogOpen(false)}
//         item={selectedItem}
//         onSuccess={handleUpdateSuccess}
//       />
//     </Box>
//   );
// };

// export default InventoryView;


// src/pages/Inventory/InventoryView.jsx
// src/pages/Inventory/InventoryView.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInventory, deleteInventoryItem } from "../../Slice/inventorySlice";
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MDSearchBar from "../../custom/MDsearchbar";
import MDDataGrid from "../../custom/MDdatagrid";
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
  const [tableLoading, setTableLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Keep track of which productName groups are expanded
  const [expandedRows, setExpandedRows] = useState({});

  // Fetch inventory
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchAllInventory()).unwrap();
        const inventoryData = res?.data || res;

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
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [dispatch]);

  // Handle Edit
  const handleEdit = (id) => {
    const itemToEdit = filteredItems.find((item) => item._id === id);
    setSelectedItem(itemToEdit);
    setEditDialogOpen(true);
  };

  // Handle Delete
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteDialogOpen(false);
    const idToDelete = selectedId;
    setSelectedId(null);

    try {
      await dispatch(deleteInventoryItem(idToDelete)).unwrap();
      setFilteredItems((prev) => prev.filter((item) => item._id !== idToDelete));
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

  // Refresh after update
  const handleUpdateSuccess = async () => {
    setTableLoading(true);
    try {
      const res = await dispatch(fetchAllInventory()).unwrap();
      const inventoryData = res?.data || res;
      const validItems = Array.isArray(inventoryData)
        ? inventoryData.filter((item) => item.productId && item.productId._id)
        : [];
      setFilteredItems(validItems);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to refresh inventory",
        severity: "error",
      });
    } finally {
      setTableLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Process inventory items to normalized shape
  const processedInventory = useMemo(() => {
    if (!Array.isArray(filteredItems)) return [];
    return filteredItems.map((item) => ({
      id: item._id,
      _id: item._id,
      serialNumber: item.serialNumber || "N/A",
      productName: item.productId?.name || "Unknown Product",
      quantity: item.quantity || 0,
      usedQuantity: item.usedQuantity || 0,
      availableQuantity:
        item.availableQuantity ?? (item.quantity || 0) - (item.usedQuantity || 0),
      createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : "—",
    }));
  }, [filteredItems]);

  // Apply search filter
  const displayedInventory = useMemo(() => {
    if (!searchTerm) return processedInventory;
    const searchLower = searchTerm.toLowerCase();
    return processedInventory.filter(
      (item) =>
        (item.productName || "").toLowerCase().includes(searchLower) ||
        (item.serialNumber || "").toLowerCase().includes(searchLower)
    );
  }, [processedInventory, searchTerm]);

  // ✅ Group by productName and sort children in *increasing* order of serial number
  const grouped = useMemo(() => {
    const map = {};
    displayedInventory.forEach((it) => {
      const name = it.productName || "Unknown Product";
      if (!map[name]) map[name] = [];
      map[name].push(it);
    });

    const groups = Object.entries(map).map(([productName, items]) => {
      const sortedItems = [...items].sort((a, b) => {
        const numA = parseInt(String(a.serialNumber || "").replace(/\D/g, ""), 10) || 0;
        const numB = parseInt(String(b.serialNumber || "").replace(/\D/g, ""), 10) || 0;
        return numA - numB; // ascending order (01, 02, 03...)
      });
      return {
        productName,
        items: sortedItems,
      };
    });

    groups.sort((a, b) => a.productName.localeCompare(b.productName));
    return groups;
  }, [displayedInventory]);

  // Build rows array for MDDataGrid
  const gridRows = useMemo(() => {
    const rows = [];
    grouped.forEach((group) => {
      const headerId = `header-${group.productName}`;
      rows.push({
        id: headerId,
        isHeader: true,
        productName: group.productName,
        _children: group.items,
      });

      if (expandedRows[group.productName]) {
        group.items.forEach((child) => {
          rows.push({
            id: `child-${child._id}`,
            isHeader: false,
            parentProduct: group.productName,
            _id: child._id,
            serialNumber: child.serialNumber,
            productName: child.productName,
            quantity: child.quantity,
            usedQuantity: child.usedQuantity,
            availableQuantity: child.availableQuantity,
            createdAt: child.createdAt,
          });
        });
      }
    });
    return rows;
  }, [grouped, expandedRows]);

  // Columns for MDDataGrid
  const columns = [
    {
      field: "serialNumber",
      headerName: "Serial / Product",
      flex: 2,
      minWidth: 220,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        if (row.isHeader) {
          const isExpanded = !!expandedRows[row.productName];
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
                cursor: "pointer",
              }}
              onClick={() =>
                setExpandedRows((prev) => ({
                  ...prev,
                  [row.productName]: !prev[row.productName],
                }))
              }
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "600" }}>
                {row.productName}
              </Typography>
              {/* <Typography
                variant="caption"
                sx={{ marginLeft: 1, color: "text.secondary", fontStyle: "italic" }}
              >
                ({row._children ? row._children.length : 0})
              </Typography> */}
            </Box>
          );
        }

        // child row
        return (
          <Box sx={{ pl: 4 }}>
            <Typography variant="body2">{row.serialNumber}</Typography>
            
          </Box>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Total Qty",
      flex: 1,
      minWidth: 110,
      renderCell: (params) => (params.row.isHeader ? null : params.value ?? 0),
    },
    {
      field: "usedQuantity",
      headerName: "Used Qty",
      flex: 1,
      minWidth: 110,
      renderCell: (params) => (params.row.isHeader ? null : params.value ?? 0),
    },
    {
      field: "availableQuantity",
      headerName: "Available Qty",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (params.row.isHeader ? null : params.value ?? 0),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.4,
      minWidth: 160,
      renderCell: (params) => (params.row.isHeader ? null : params.value ?? "—"),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 140,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        if (row.isHeader) return null;
        return (
          <Box>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => handleEdit(row._id)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => handleDeleteClick(row._id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
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

  return (
    <Box p={3}>
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

      <Box
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)",
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255,255,255,0.6)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            p: 2,
            borderBottom: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          <MDSearchBar
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        <MDDataGrid
          rows={gridRows}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={10}
          disableSelectionOnClick
          loading={loading || tableLoading}
          autoHeight
          sx={{
            "& .MuiDataGrid-row.Mui-selected": { backgroundColor: "transparent" },
            "& .MuiDataGrid-cell": { borderBottom: "1px solid rgba(0,0,0,0.05)" },
          }}
        />
      </Box>

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
        onSuccess={handleUpdateSuccess}
      />
    </Box>
  );
};

export default InventoryView;

