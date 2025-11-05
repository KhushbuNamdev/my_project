
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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

  // Load products initially
  useEffect(() => {
    dispatch(fetchAllProducts())
      .unwrap()
      .then((res) => {
        setProducts(Array.isArray(res) ? res : res?.products || []);
      })
      .catch(() => setProducts([]));
  }, [dispatch]);

  // Format categoryIds into names
  const formatCategories = (categoryIds) => {
    if (!categoryIds || !Array.isArray(categoryIds)) return "No categories";
    return categoryIds.map((cat) => cat.name).join(", ");
  };

  // Handle edit button click
  const handleEditClick = (product) => {
    setEditDialog({
      open: true,
      product: {
        ...product,
        // Ensure categoryIds is an array of IDs (not objects)
        categoryIds: Array.isArray(product.categoryIds) 
          ? product.categoryIds.map(cat => typeof cat === 'object' ? cat._id : cat)
          : []
      }
    });
  };
  
  // Handle successful product update
  // const handleProductUpdated = (updatedProduct) => {
  //   // Update the local state with the updated product
  //   setProducts(prev => 
  //     prev.map(p => p._id === updatedProduct._id ? {
  //       ...updatedProduct,
  //       // Ensure categories are properly formatted
  //       categoryIds: Array.isArray(updatedProduct.categoryIds) 
  //         ? updatedProduct.categoryIds.map(cat => ({
  //             _id: typeof cat === 'object' ? cat._id : cat,
  //             name: typeof cat === 'object' 
  //               ? (cat.name || 'Uncategorized') 
  //               : (categories.find(c => c._id === cat)?.name || 'Loading...')
  //           }))
  //         : []
  //     } : p)
  //   );
  // };
const handleProductUpdated = async (updatedProduct) => {
  try {
    // Show success message
    setSnackbar({
      open: true,
      message: 'Product updated successfully!',
      severity: 'success'
    });

    // Close the edit dialog
    setEditDialog({ open: false, product: null });

    // Refresh the products list from the server
    const result = await dispatch(fetchAllProducts()).unwrap();
    const updatedProducts = Array.isArray(result) ? result : result?.products || [];
    setProducts(updatedProducts);

  } catch (error) {
    console.error('Error updating product:', error);
    setSnackbar({
      open: true,
      message: 'Failed to refresh product list',
      severity: 'error'
    });
  }
};
  // Handle delete button click
  const handleDeleteClick = (product) => {
    setDeleteDialog({
      open: true,
      product,
    });
  };

  // Handle actual deletion
  const handleDeleteConfirm = async () => {
    if (!deleteDialog.product || !deleteDialog.product._id) {
      console.error('Cannot delete: Product ID is missing');
      setDeleteDialog({ open: false, product: null });
      return;
    }
    
    try {
      const productId = deleteDialog.product._id;
      console.log('Attempting to delete product with ID:', productId);
      
      const result = await dispatch(removeProduct(productId)).unwrap();
      console.log('Delete result:', result);
      
      // Update local state to remove the deleted product
      setProducts(prev => prev.filter(p => p._id !== productId));
      
      // Close the dialog
      setDeleteDialog({ open: false, product: null });
      
      // Show success message
      // You might want to add a snackbar here
    } catch (error) {
      console.error('Failed to delete product:', error);
      // You might want to show an error message here
      setDeleteDialog({ open: false, product: null });
    }
  };

  // Close delete dialog
  const handleDeleteClose = () => {
    setDeleteDialog({ open: false, product: null });
  };

  // Columns for DataGrid
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
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
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
        </Box>
      ),
    },
  ];

  // Filter products based on search
  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    const productName = product.name || "";
    const productCategories = Array.isArray(product.categoryIds)
      ? product.categoryIds
      : [];
    return (
      productName.toLowerCase().includes(searchLower) ||
      productCategories.some(
        (cat) => cat?.name?.toLowerCase().includes(searchLower)
      )
    );
  });

  // Map filtered products to DataGrid rows
  const rows = filteredProducts.map((product, index) => {
    // Ensure we have a valid ID for each product
    const productId = product._id || product.id;
    if (!productId) {
      console.warn('Product is missing an ID:', product);
    }
    
    return {
      id: productId || `invalid-${index}-${Date.now()}`,
      _id: productId, // Keep the original _id for reference
      name: product.name || "Unnamed Product",
      categoryIds: product.categoryIds || [],
    };
  });

  // Callback to add new product to local state
  const handleProductAdded = (newProduct) => {
    // Ensure we have valid product data
    if (!newProduct) return;

    // Log the incoming product data for debugging
    console.log('New product received:', newProduct);

    // Extract the name from the server response
    // Check for different possible name fields in the response
    const productName = newProduct.name || newProduct.product?.name || newProduct.data?.name || 'New Product';

    // Create a properly formatted product object
    const formattedProduct = {
      ...newProduct,
      // Ensure we have a valid ID
      _id: newProduct._id || newProduct.id || `temp-${Date.now()}`,
      // Use the extracted name or fallback to 'New Product'
      name: productName,
      // Handle categories - use the ones from the server if available, otherwise map them
      categoryIds: Array.isArray(newProduct.categoryIds) 
        ? newProduct.categoryIds.map(cat => ({
            _id: typeof cat === 'object' ? cat._id : cat,
            name: typeof cat === 'object' ? (cat.name || 'Uncategorized') : 
                  (categories.find(c => c._id === cat)?.name || 'Loading...')
          }))
        : []
    };

    console.log('Formatted product:', formattedProduct);

    // Update the products list, ensuring no duplicates
    setProducts(prev => [
      formattedProduct,
      ...prev.filter(p => p._id !== formattedProduct._id)
    ]);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
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
      
      <AddProduct
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSuccess={handleProductAdded}
      />
      
      <DeleteProductDialog
        open={deleteDialog.open}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        productName={deleteDialog.product?.name || 'this product'}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
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


