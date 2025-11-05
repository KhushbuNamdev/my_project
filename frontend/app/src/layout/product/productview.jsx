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
const ProductView = () => {
  const dispatch = useDispatch();
  const { products = [], loading, error } = useSelector((state) => state.product);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAllProducts({}));
  }, [dispatch]);

  // ✅ Format categoryIds into readable string
  const formatCategories = (categoryIds) => {
    if (!categoryIds || !Array.isArray(categoryIds)) return "No categories";
    return categoryIds.map((cat) => cat.name).join(", ");
  };

  // ✅ Handle Edit & Delete actions (you can connect logic later)
  const handleEdit = (product) => {
    console.log("Edit clicked for:", product);
    // open edit dialog or navigate to edit page
  };

  const handleDelete = (product) => {
    console.log("Delete clicked for:", product);
    // open confirmation dialog or dispatch removeProduct thunk
  };

  // ✅ Define DataGrid columns
  const columns = [
    {
      field: "name",
      headerName: "Product Name",
      flex: 1,
      sortable: true,
    },
    {
      field: "categoryIds",
      headerName: "Categories",
      flex: 1,
      sortable: false,
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
      sortable: false,
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

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      (product.categoryIds && 
        product.categoryIds.some(cat => 
          cat.name && cat.name.toLowerCase().includes(searchLower)
        ))
    );
  });

  // Map filtered products for DataGrid
  const rows = filteredProducts.map((product) => ({
    id: product._id || product.id,
    name: product.name,
    categoryIds: product.categoryIds,
  }));

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
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <MDSearchbar 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: '300px' }}
          />
          <MDButton>
            Add Product
          </MDButton>
        </Box>
      <MDDataGrid rows={rows} columns={columns} pageSize={10} />
      </Box>
    </Box>
  );
};

export default ProductView;
