
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  removeProduct,
} from "../../Slice/productSlice";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MDDataGrid from "../../custom/MDdatagrid";
import MDButton from "../../custom/MDbutton";
import MDSearchbar from "../../custom/MDsearchbar";
import AddProduct from "./addproduct";
import DeleteProductDialog from "./deleteproduct";
import EditProduct from "./editproduct";
import AddQuantityDialog from "./addQuantity"; // ✅ New Import

const ProductView = () => {
  const dispatch = useDispatch();

  const { products: initialProducts = [], loading, error } = useSelector(
    (state) => state.product
  );
  const { categories = [] } = useSelector((state) => state.category);

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openQuantityDialog, setOpenQuantityDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    product: null,
  });

  const [editDialog, setEditDialog] = useState({
    open: false,
    product: null,
  });

  // 🔹 Fetch products on mount
  useEffect(() => {
    dispatch(fetchAllProducts())
      .unwrap()
      .then((res) => {
        setProducts(Array.isArray(res) ? res : res?.products || res?.data || []);
      })
      .catch(() => setProducts([]));
  }, [dispatch]);

  // 🔹 Format category names
  const formatCategories = (categoryIds) => {
    if (!categoryIds || !Array.isArray(categoryIds)) return "No categories";
    return categoryIds.map((cat) => cat.name).join(", ");
  };

  // 🔹 Edit Product
  const handleEditClick = (product) => {
    setEditDialog({
      open: true,
      product: {
        ...product,
        categoryIds: Array.isArray(product.categoryIds)
          ? product.categoryIds.map((cat) =>
              typeof cat === "object" ? cat._id : cat
            )
          : [],
      },
    });
  };

  // Update Success Handler
  const handleProductUpdated = async () => {
    try {
      setSnackbar({
        open: true,
        message: "Product updated successfully!",
        severity: "success",
      });
      setEditDialog({ open: false, product: null });
      const result = await dispatch(fetchAllProducts()).unwrap();
      setProducts(Array.isArray(result) ? result : result?.products || result?.data || []);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to refresh product list",
        severity: "error",
      });
    }
  };

  // 🔹 Delete Product
  const handleDeleteClick = (product) => {
    setDeleteDialog({ open: true, product });
  };

  const handleDeleteConfirm = async () => {
  if (!deleteDialog.product || !deleteDialog.product._id) return;

  // 🔹 Immediately close the dialog before async work
  const productId = deleteDialog.product._id;
  setDeleteDialog({ open: false, product: null });

  try {
    await dispatch(removeProduct(productId)).unwrap();

    // Update UI instantly
    setProducts((prev) => prev.filter((p) => p._id !== productId));

    // ✅ Refresh snackbar
    setSnackbar({
      open: true,
      message: "Product deleted successfully!",
      severity: "success",
    });
  } catch (error) {
    setSnackbar({
      open: true,
      message: "Failed to delete product",
      severity: "error",
    });
  }
};


  const handleDeleteClose = () => {
    setDeleteDialog({ open: false, product: null });
  };

  // 🔹 Open Quantity Dialog
  const handleAddQuantity = (product) => {
    setSelectedProduct(product);
    setOpenQuantityDialog(true);
  };

  // 🔹 Table Columns
  const columns = [
    { field: "name", headerName: "Product Name", flex: 1 },
    {
      field: "categoryIds",
      headerName: "Categories",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {formatCategories(params.value)}
        </Typography>
      ),
    },
    {
      field: "gstPercentage",
      headerName: "GST (%)",
      flex: 0.5,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? `${params.value}%` : "0%"}
        </Typography>
      ),
    },
    {
      field: "inventory",
      headerName: "Total Quantity",
      flex: 0.7,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.inventory?.totalQuantity ?? 0}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Edit">
            <IconButton
            
              size="small"
              onClick={() => handleEditClick(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
             
              size="small"
              onClick={() => handleDeleteClick(params.row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add Quantity">
            <MDButton
              onClick={() => handleAddQuantity(params.row)}
              sx={{
               
                px: 1.5,
                py: 0.3,
                fontSize: "0.7rem",
                minWidth: "auto",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <AddCircleOutlineIcon sx={{ fontSize: 16 }} />
              Add
            </MDButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // 🔹 Search Filter
  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = product.name?.toLowerCase().includes(searchLower);
    const categoryMatch = product.categoryIds?.some((cat) =>
      cat?.name?.toLowerCase().includes(searchLower)
    );
    return nameMatch || categoryMatch;
  });

  // 🔹 Format Rows
  const rows = filteredProducts.map((product, index) => ({
    id: product._id || `temp-${index}`,
    _id: product._id,
    name: product.name || "Unnamed Product",
    categoryIds: product.categoryIds || [],
    gstPercentage: product.gstPercentage || 0,
    inventory: product.inventory || { totalQuantity: 0 },
  }));

  // Add Product Success Handler
  const handleProductAdded = async () => {
    try {
      // Fetch the latest products from the server
      const result = await dispatch(fetchAllProducts()).unwrap();
      const updatedProducts = Array.isArray(result) 
        ? result 
        : result?.products || result?.data || [];
      
      // Update the products list with fresh data
      setProducts(updatedProducts);
      
      // Show success message
      setSnackbar({
        open: true,
        message: "Product added successfully!",
        severity: "success",
      });
      
      // Close the add dialog
      setOpenAddDialog(false);
    } catch (error) {
      console.error("Failed to refresh products:", error);
      setSnackbar({
        open: true,
        message: "Product was created but failed to refresh the list",
        severity: "warning",
      });
    }
  };

  // 🔹 Loading and Error States
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
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
    <Box sx={{ p: 3 }}>
      {/* Top Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <MDSearchbar
         color="#FFFFFF"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "300px" }}
        />
        <MDButton onClick={() => setOpenAddDialog(true)}>Add Product</MDButton>
      </Box>

      {/* Data Grid */}
      <MDDataGrid rows={rows} columns={columns} pageSize={10} />

      {/* Add Product Dialog */}
      <AddProduct
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSuccess={handleProductAdded}
      />

      {/* Delete Product Dialog */}
      <DeleteProductDialog
        open={deleteDialog.open}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        productName={deleteDialog.product?.name || "this product"}
      />

      {/* ✅ New Separate Add Quantity Dialog */}
      <AddQuantityDialog
        open={openQuantityDialog}
        onClose={() => setOpenQuantityDialog(false)}
        product={selectedProduct}
        onSuccess={async () => {
          const res = await dispatch(fetchAllProducts()).unwrap();
          setProducts(Array.isArray(res) ? res : res?.products || res?.data || []);
        }}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Edit Product Dialog */}
      <EditProduct
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, product: null })}
        product={editDialog.product}
        onSuccess={handleProductUpdated}
      />
    </Box>
  );
};

export default ProductView;
