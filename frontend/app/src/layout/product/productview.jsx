import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  removeProduct,
} from "../../Slice/productSlice";
import {
  fetchAllInventory,
  createNewInventory,
} from "../../Slice/inventorySlice";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Snackbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  const inventoryItems = useSelector((state) => state.inventory?.data || []);

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openQuantityDialog, setOpenQuantityDialog] = useState(false);
  const [quantity, setQuantity] = useState("");
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

  // 🔹 Fetch products and inventory
  useEffect(() => {
    dispatch(fetchAllProducts())
      .unwrap()
      .then((res) => {
        setProducts(Array.isArray(res) ? res : res?.products || []);
      })
      .catch(() => setProducts([]));

    dispatch(fetchAllInventory());
  }, [dispatch]);

  // 🔹 Format category names
  const formatCategories = (categoryIds) => {
    if (!categoryIds || !Array.isArray(categoryIds)) return "No categories";
    return categoryIds.map((cat) => cat.name).join(", ");
  };

  // 🔹 Get quantity for each product from inventory
  const getProductQuantity = (productId) => {
    if (!inventoryItems || !Array.isArray(inventoryItems)) {
      console.log('No inventory items found or invalid structure');
      return 0;
    }
    
    const item = inventoryItems.find((inv) => {
      // Check if productId is an object with _id or a direct ID
      const invProductId = inv.productId?._id || inv.productId;
      return invProductId === productId;
    });
    
    // Return the quantity from the inventory item
    const quantity = item ? item.quantity : 0;
    console.log('Product ID:', productId, 'Found quantity:', quantity);
    return quantity;
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

  // 🔹 Update Success Handler
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

  // 🔹 Open Quantity Dialog
  const handleAddQuantity = (product) => {
    setSelectedProduct(product);
    setQuantity("");
    setOpenQuantityDialog(true);
  };

  // 🔹 Submit Quantity
  const handleQuantitySubmit = async () => {
    if (!selectedProduct || !quantity || isNaN(quantity) || quantity <= 0) {
      setSnackbar({
        open: true,
        message: "Please enter a valid whole number for quantity",
        severity: "error",
      });
      return;
    }

    try {
      await dispatch(
        createNewInventory({
          productId: selectedProduct._id,
          quantity: parseInt(quantity, 10),
        })
      ).unwrap();

      await dispatch(fetchAllInventory());

      setSnackbar({
        open: true,
        message: "Quantity added successfully!",
        severity: "success",
      });
      setOpenQuantityDialog(false);
      setQuantity("");
      setSelectedProduct(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add quantity",
        severity: "error",
      });
    }
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
      field: "quantity",
      headerName: "Quantity",
      flex: 0.5,
      renderCell: (params) => (
        <Typography variant="body2">
          {getProductQuantity(params.row._id)}
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
    quantity: getProductQuantity(product._id),
  }));

  // 🔹 Add Product Success Handler
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

      {/* Quantity Dialog */}
      <Dialog
        open={openQuantityDialog}
        onClose={() => setOpenQuantityDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add Quantity</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            inputProps={{ min: 1, step: 1 }}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQuantityDialog(false)}>Cancel</Button>
          <Button onClick={handleQuantitySubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

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
