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
import AddQuantityDialog from "./addQuantity";

const ProductView = () => {
  const dispatch = useDispatch();

  const { products: initialProducts = [], loading, error } = useSelector(
    (state) => state.product
  );

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

  // Fetch products
  useEffect(() => {
    dispatch(fetchAllProducts())
      .unwrap()
      .then((res) => {
        setProducts(Array.isArray(res) ? res : res?.products || res?.data || []);
      })
      .catch(() => setProducts([]));
  }, [dispatch]);

  const formatCategories = (categoryIds) => {
    if (!categoryIds || !Array.isArray(categoryIds)) return "No categories";
    return categoryIds.map((cat) => cat.name).join(", ");
  };

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

  const handleDeleteClick = (product) => {
    setDeleteDialog({ open: true, product });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.product || !deleteDialog.product._id) return;

    const productId = deleteDialog.product._id;
    setDeleteDialog({ open: false, product: null });

    try {
      await dispatch(removeProduct(productId)).unwrap();
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setSnackbar({
        open: true,
        message: "Product deleted successfully!",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to delete product",
        severity: "error",
      });
    }
  };

  const handleAddQuantity = (product) => {
    setSelectedProduct(product);
    setOpenQuantityDialog(true);
  };

  const columns = [
    { field: "name", headerName: "Product Name", flex: 1 },
    {
      field: "categoryIds",
      headerName: "Categories",
      flex: 1,
      renderCell: (params) => <>{formatCategories(params.value)}</>,
    },
    {
      field: "gstPercentage",
      headerName: "GST (%)",
      flex: 1,
      renderCell: (params) => <>{params.value ? `${params.value}%` : "0%"}</>,
    },
    {
      field: "inventory",
      headerName: "Total Quantity",
      flex: 1,
      renderCell: (params) => (
        <>{params.row.inventory?.totalQuantity ?? 0}</>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEditClick(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDeleteClick(params.row)}>
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

  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = product.name?.toLowerCase().includes(searchLower);
    const categoryMatch = product.categoryIds?.some((cat) =>
      cat?.name?.toLowerCase().includes(searchLower)
    );
    return nameMatch || categoryMatch;
  });

  const rows = filteredProducts.map((product, index) => ({
    id: product._id || `temp-${index}`,
    _id: product._id,
    name: product.name || "Unnamed Product",
    categoryIds: product.categoryIds || [],
    gstPercentage: product.gstPercentage || 0,
    inventory: product.inventory || { totalQuantity: 0 },
  }));

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)",
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255,255,255,0.6)",
        }}
      >
        {/* Top Toolbar (Card Replacement) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          <MDSearchbar
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MDButton onClick={() => setOpenAddDialog(true)}>Add Product</MDButton>
        </Box>

        {/* DataGrid Section */}
        <MDDataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableTopRadius // 👈 joins perfectly with the toolbar
        />
      </Box>

      {/* Dialogs */}
      <AddProduct
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSuccess={async () => {
          const res = await dispatch(fetchAllProducts()).unwrap();
          setProducts(Array.isArray(res) ? res : res?.products || res?.data || []);
        }}
      />

      <DeleteProductDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, product: null })}
        onConfirm={handleDeleteConfirm}
        productName={deleteDialog.product?.name || "this product"}
      />

      <AddQuantityDialog
        open={openQuantityDialog}
        onClose={() => setOpenQuantityDialog(false)}
        product={selectedProduct}
        onSuccess={async () => {
          const res = await dispatch(fetchAllProducts()).unwrap();
          setProducts(Array.isArray(res) ? res : res?.products || res?.data || []);
        }}
      />

      <EditProduct
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, product: null })}
        product={editDialog.product}
        onSuccess={handleProductUpdated}
      />

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
    </Box>
  );
};

export default ProductView;
