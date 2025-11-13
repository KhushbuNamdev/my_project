import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchCategories } from "../../Slice/categorySlice";
import MDSearchBar from "../../custom/MDsearchbar";
import MDDataGrid from "../../custom/MDdatagrid";
import AddCategory from "./addcategory";      
import EditCategory from "./editcategory"; // ✅ new import
import DeleteCategoryDialog from "./deletecategory";
import MDButton from "../../custom/MDbutton";
const CategoryView = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
 const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddSuccess = () => {
    dispatch(fetchCategories());
  };

  const handleEditSuccess = () => {
    dispatch(fetchCategories());
  };
const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setOpenDeleteDialog(true);
  };
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setOpenEditDialog(true);
  };

  const columns = [
    { field: "name", headerName: "Category Name", flex: 1, minWidth: 200 },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
       
          
        
         <> {params.value}</>
     
      ),
    },
    
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      align: "center",
      renderCell: (params) => (
        <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{pr:"10px"}}>
          <Tooltip title="Edit">
            <IconButton  onClick={() => handleEditClick(params.row)}>
            <EditIcon color="dark"/>
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">



            <IconButton
                
                onClick={() => handleDeleteClick(params.row)}
              >
                <DeleteIcon />
              </IconButton>
 </Tooltip>
        </Box>
      ),
    },
  ];

  const filteredCategories =
    categories?.filter(
      (category) =>
        category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

 return (
  <Box p={3}>
    {/* Card Container */}
    <Box
      sx={{
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(255,255,255,0.6)',
      }}
    >
      {/* Toolbar: Search + Add Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid rgba(255,255,255,0.5)',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <MDSearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search categories..."
        />
        <MDButton onClick={() => setOpenAddDialog(true)}>
          Add New Category
        </MDButton>
      </Box>

      {/* MDDataGrid */}
      {loading && categories.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <MDDataGrid
          rows={filteredCategories}
          columns={columns}
          pageSize={10}
          disableTopRadius
        />
      )}
    </Box>

    {/* Add Dialog */}
    <AddCategory
      open={openAddDialog}
      onClose={() => setOpenAddDialog(false)}
      onSuccess={handleAddSuccess}
    />

    {/* Edit Dialog */}
    <EditCategory
      open={openEditDialog}
      onClose={() => setOpenEditDialog(false)}
      onSuccess={handleEditSuccess}
      category={selectedCategory}
    />

    {/* Delete Dialog */}
    {openDeleteDialog && (
      <DeleteCategoryDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        categoryId={selectedCategory?._id}
      />
    )}
  </Box>
);

};

export default CategoryView;

