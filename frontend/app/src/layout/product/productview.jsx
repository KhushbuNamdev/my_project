



import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../Slice/productSlice";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MDDataGrid from "../../custom/MDdatagrid";
import MDButton from "../../custom/MDbutton";
import MDSearchbar from "../../custom/MDsearchbar";
import AddProduct from "./addproduct";

const ProductView = () => {
  const dispatch = useDispatch();
  const { products: initialProducts = [], loading, error } = useSelector(
    (state) => state.product
  );
  const { categories = [] } = useSelector((state) => state.category);

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);

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

  // Edit/Delete placeholders
  const handleEdit = (product) => console.log("Edit clicked for:", product);
  const handleDelete = (product) => console.log("Delete clicked for:", product);

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
              onClick={() => handleEdit(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDelete(params.row)}
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
  const rows = filteredProducts.map((product, index) => ({
    id: product._id || product.id || `row-${index}`,
    name: product.name || "Unnamed Product",
    categoryIds: product.categoryIds || [],
  }));

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
        onSuccess={handleProductAdded} // pass callback
      />
    </Box>
  );
};

export default ProductView;


