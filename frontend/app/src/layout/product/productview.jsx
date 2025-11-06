import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts, removeProduct } from "../../Slice/productSlice";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Snackbar,
  Button,
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

const ProductView = () => {
  const dispatch = useDispatch();
  const { products: initialProducts = [], loading, error } = useSelector(
    (state) => state.product
  );
  const { categories = [] } = useSelector((state) => state.category);

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
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

  // Fetch all products initially
  useEffect(() => {
    dispatch(fetchAllProducts())
      .unwrap()
      .then((res) => {
        setProducts(Array.isArray(res) ? res : res?.products || []);
      })
      .catch(() => setProducts([]));
  }, [dispatch]);

  // Format category names
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

  // 🔹 Product updated successfully
  const handleProductUpdated = async (updatedProduct) => {
    try {
      setSnackbar({
        open: true,
        message: "Product updated successfully!",
        severity: "success",
      });
      setEditDialog({ open: false, product: null });
      const result = await dispatch(fetchAllProducts()).unwrap();
      setProducts(Array.isArray(result) ? result : result?.products || []);
    } catch (error) {
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
    try {
      const productId = deleteDialog.product._id;
      await dispatch(removeProduct(productId)).unwrap();
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setSnackbar({
        open: true,
        message: "Product deleted successfully!",
        severity: "success",
      });
      setDeleteDialog({ open: false, product: null });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete product",
        severity: "error",
      });
      setDeleteDialog({ open: false, product: null });
    }
  };

  const handleDeleteClose = () => {
    setDeleteDialog({ open: false, product: null });
  };

  // 🔹 Add Quantity Button
  const handleAddQuantity = (product) => {
    // You can later integrate quantity logic here (dialog or inline edit)
    setSnackbar({
      open: true,
      message: `Add quantity clicked for ${product.name}`,
      severity: "info",
    });
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
  field: "actions",
  headerName: "Actions",
  flex: 0.8,
  renderCell: (params) => (
    <Box display="flex" alignItems="center" gap={1}>
      {/* 🔹 Small Add Quantity Button using MDButton */}
      

      <Tooltip title="Edit">
        <IconButton
          color="primary"
          size="small"
          onClick={() => handleEditClick(params.row)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete">
        <IconButton
          color="error"
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
            mt:1
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 16 }} />
          Add quantity
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

  // 🔹 Format rows
  const rows = filteredProducts.map((product, index) => ({
    id: product._id || `temp-${index}`,
    _id: product._id,
    name: product.name || "Unnamed Product",
    categoryIds: product.categoryIds || [],
    gstPercentage: product.gstPercentage || 0,
  }));

  // 🔹 Add Product success handler
  const handleProductAdded = (newProduct) => {
    if (!newProduct) return;
    const formatted = {
      ...newProduct,
      _id: newProduct._id || `temp-${Date.now()}`,
      name: newProduct.name || "New Product",
      categoryIds: Array.isArray(newProduct.categoryIds)
        ? newProduct.categoryIds.map((cat) => ({
            _id: typeof cat === "object" ? cat._id : cat,
            name:
              typeof cat === "object"
                ? cat.name
                : categories.find((c) => c._id === cat)?.name || "Unknown",
          }))
        : [],
    };
    setProducts((prev) => [formatted, ...prev]);
  };

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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <MDSearchbar
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "300px" }}
        />
        <MDButton onClick={() => setOpenAddDialog(true)}>Add Product</MDButton>
      </Box>

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

      {/* Snackbar */}
      <Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // 👈 Added this line
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
