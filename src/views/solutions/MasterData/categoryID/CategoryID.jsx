import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  FormControl,
  Tooltip,
  IconButton,
  CircularProgress,
  Chip,
  Popover,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { DataGrid } from "@mui/x-data-grid";
import useCategoryID from "hooks/useCategoryId";
import axios from "axios";
import { MASTER_DATA } from "store/constant";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainCard from "ui-component/cards/MainCard";

const iconColor = "#6b6be2";

const useStyles = makeStyles((theme) => ({
  iconButton: {
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    padding: '12px 20px',
    fontSize: '16px',
    border: '1px solid #5e17eb',
    borderRadius: '5px',
    outline: 'none',
    transition: 'all 0.3s ease',
    '&:focus': {
      boxShadow: '0 0 10px rgba(94, 23, 235, 0.2)',
    },
  },
  searchIcon: {
    position: 'absolute',
    right: '150px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#5e17eb',
  },
  actionIcons: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '10px',
  },
  addButton: {
    minWidth: '48px',
    width: '48px',
    height: '48px',
    borderRadius: '5px',
    marginLeft: '10px',
    backgroundColor: '#5e17eb',
    color: 'white',
    '&:hover': {
      backgroundColor: '#4a11c0',
    },
  },
  categoryChip: {
    margin: '2px',
    cursor: 'pointer',
  },
  popoverContent: {
    padding: theme.spacing(2),
    maxWidth: 300,
  },
  categoryContainer: {
    width: '100%',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  Icons: {
    color: '#5e17eb',
  },
  
}));

const CategoryID = () => {
  const classes = useStyles();
  const { categoryId } = useCategoryID();
  const [searchTerm, setSearchTerm] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newRow, setNewRow] = useState({
    parent_category_id: "",
    parent_category: "",
    parent_category_description: "",
    category_level: "",
    unspsc_code: "",
    categories: [{ category_id: "", category: "", category_description: "" }]
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState(null);

  const transformData = (data) => {
    const defaultColumns = [
      { field: 'parent_category_id', headerName: 'Parent Category ID', flex: 1, minWidth: 150 },
      { field: 'parent_category', headerName: 'Parent Category', flex: 1, minWidth: 150 },
      { field: 'parent_category_description', headerName: 'Description', flex: 1, minWidth: 150 },
      { field: 'category_level', headerName: 'Category Level', flex: 1, minWidth: 150 },
      { field: 'unspsc_code', headerName: 'UNSPSC Code', flex: 1, minWidth: 150 },
      {
        field: 'categories',
        headerName: 'Categories',
        flex: 1,
        minWidth: 250,
        renderCell: (params) => (
          <div className={classes.categoryContainer}>
            {params.value && params.value.map((category, index) => (
              <Chip
                key={index}
                label={category.category}
                className={classes.categoryChip}
                onClick={(event) => handleCategoryClick(event, category)}
                style={{ margin: '2px' }}
              />
            ))}
          </div>
        ),
      },
      {
        field: 'edit',
        headerName: 'Edit',
        width: 80,
        disableColumnMenu: true,
        sortable: false,
        renderCell: (params) => (
          <Button
            className={classes.iconButton}
            style={{ minWidth: '30px', padding: '6px' }}
            onClick={() => handleEditRow(params.row)}
          >
            <EditIcon className={classes.Icons}/>
          </Button>
        ),
      },
      {
        field: 'delete',
        headerName: 'Delete',
        width: 80,
        disableColumnMenu: true,
        sortable: false,
        renderCell: (params) => (
          <Button
            className={classes.iconButton}
            style={{ minWidth: '30px', padding: '6px' }}
            onClick={() => handleDeleteRow(params.row)}
          >
            <DeleteIcon className={classes.Icons}/>
          </Button>
        ),
      }
    ];

    if (!data || data.length === 0) {
      return { transformedColumns: defaultColumns, transformedRows: [] };
    }

    const transformedRows = data.map((item, index) => ({
      id: index + 1,
      ...item,
    }));

    return { transformedColumns: defaultColumns, transformedRows };
  };

  useEffect(() => {
    if (categoryId) {
      const { transformedColumns, transformedRows } = transformData(categoryId);
      setColumns(transformedColumns);
      setRows(transformedRows);
    } else {
      const { transformedColumns } = transformData([]);
      setColumns(transformedColumns);
      setRows([]);
    }
  }, [categoryId]);

  useEffect(() => {
    filterRows();
  }, [searchTerm, rows]);

  const filterRows = () => {
    if (searchTerm === "") {
      setFilteredRows(rows);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filteredData = rows.filter((row) => {
        return Object.keys(row).some((key) =>
          String(row[key]).toLowerCase().includes(lowercasedFilter)
        );
      });
      setFilteredRows(filteredData);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewRow({
      parent_category_id: "",
      parent_category: "",
      parent_category_description: "",
      category_level: "",
      unspsc_code: "",
      categories: [{ category_id: "", category: "", category_description: "" }]
    });
  };

  const handleNewRowChange = (event, index) => {
    const { name, value } = event.target;
    if (name.startsWith("categories")) {
      const [, field] = name.split(".");
      setNewRow(prev => ({
        ...prev,
        categories: prev.categories.map((cat, i) => 
          i === index ? { ...cat, [field]: value } : cat
        )
      }));
    } else {
      setNewRow(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCategory = () => {
    setNewRow(prev => ({
      ...prev,
      categories: [...prev.categories, { category_id: "", category: "", category_description: "" }]
    }));
  };

  const handleRemoveCategory = (index) => {
    setNewRow(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const handleAddRow = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${MASTER_DATA}/categoryId/insertSingleCategory/`, newRow);
      console.log("Row added:", response.data);
      setRows((prevRows) => [...prevRows, { ...response.data, id: prevRows.length + 1 }]);
      handleCloseAddDialog();
      toast.success(`New category added: ${response.data.parent_category_id}`);
    } catch (error) {
      console.error("Error adding row:", error);
      toast.error("Failed to add new category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRow = async (row) => {
    setIsLoading(true);
    try {
      await axios.delete(`${MASTER_DATA}/categoryId/deleteCategory/${row.parent_category_id}`);
      setRows((prevRows) => prevRows.filter((r) => r.id !== row.id));
      toast.success(`Category ${row.parent_category_id} deleted`);
    } catch (error) {
      console.error("Error deleting row:", error);
      toast.error("Failed to delete category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRow = (row) => {
    setEditedRow(row);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditedRow(null);
  };

  const handleEditedRowChange = (event, index) => {
    const { name, value } = event.target;
    if (name.startsWith("categories")) {
      const [, field] = name.split(".");
      setEditedRow(prev => ({
        ...prev,
        categories: prev.categories.map((cat, i) => 
          i === index ? { ...cat, [field]: value } : cat
        )
      }));
    } else {
      setEditedRow(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEditedRow = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`${MASTER_DATA}/categoryId/updateCategory/${editedRow.parent_category_id}`, editedRow);
      console.log("Row updated:", response.data);
      setRows((prevRows) => prevRows.map((row) => row.id === editedRow.id ? response.data : row));
      handleCloseEditDialog();
      toast.success(`Category ${response.data.parent_category_id} updated`);
    } catch (error) {
      console.error("Error updating row:", error);
      toast.error("Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpload = (event) => {
    const file = event.target.files[0];
    console.log("File uploaded:", file.name);
    toast.info(`File uploaded: ${file.name}`);
    // Implement bulk upload logic here
  };

  const handleCategoryClick = (event, category) => {
    setAnchorEl(event.currentTarget);
    setPopoverContent(category);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverContent(null);
  };

  return (
    <MainCard title="Category Id">
      <Container maxWidth="2xl">
        <ToastContainer position="top-right" autoClose={3000} />
        <Grid
          container
          spacing={2}
          alignItems="center"
          style={{ marginBottom: "20px" }}
        >
          <Grid item xs={12}>
            <div className={classes.searchContainer}>
              <input
                className={classes.searchInput}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className={classes.searchIcon} />
              <div className={classes.actionIcons}>
                <Tooltip title="Create New Category">
                  <IconButton
                    onClick={handleOpenAddDialog}
                    className={classes.addButton}
                    disabled={isLoading}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Upload CSV File">
                  <IconButton component="label" className={classes.addButton} disabled={isLoading}>
                    <UploadFileIcon />
                    <input type="file" hidden onChange={handleBulkUpload} />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </Grid>
        </Grid>

        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            disableColumnSelector
            disableDensitySelector
            checkboxSelection={false}
            loading={isLoading}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'white',
                color: '#5e17eb',
              },
              '& .MuiDataGrid-cell': {
                padding: '8px',
              },
              '& .category-column': {
                padding: '0',
              },
            }}
            componentsProps={{
              cell: {
                className: (params) => 
                  params.field === 'categories' ? 'category-column' : '',
              },
            }}
          />
        </div>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {popoverContent && (
            <div className={classes.popoverContent}>
              <Typography variant="h6">{popoverContent.category}</Typography>
              <Typography variant="body2">ID: {popoverContent.category_id}</Typography>
              <Typography variant="body2">Description: {popoverContent.category_description}</Typography>
            </div>
          )}
        </Popover>

        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogContent style={{ paddingTop: '20px' }}>
            {Object.keys(newRow).filter(key => key !== 'categories').map((key) => (
              <FormControl fullWidth key={key} style={{ marginBottom: '16px' }}>
                <TextField
                  name={key}
                  label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  value={newRow[key]}
                  onChange={handleNewRowChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            ))}
            <h4>Categories</h4>
            {newRow.categories.map((cat, index) => (
              <div key={index}>
                <TextField
                  name={`categories.category_id`}
                  label="Category ID"
                  value={cat.category_id}
                  onChange={(e) => handleNewRowChange(e, index)}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: '8px' }}
                />
                <TextField
                  name={`categories.category`}
                  label="Category"
                  value={cat.category}
                  onChange={(e) => handleNewRowChange(e, index)}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: '8px' }}
                />
                <TextField
                  name={`categories.category_description`}
                  label="Category Description"
                  value={cat.category_description}
                  onChange={(e) => handleNewRowChange(e, index)}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: '8px' }}
                />
                <Button onClick={() => handleRemoveCategory(index)}>Remove</Button>
              </div>
            ))}
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} sx={{ color: "#666" }} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleAddRow} variant="outlined" sx={{ borderColor: iconColor, color: iconColor }} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent style={{ paddingTop: '20px' }}>
            {editedRow && Object.keys(editedRow).filter(key => key !== 'categories').map((key) => (
              <FormControl fullWidth key={key} style={{ marginBottom: '16px' }}>
                <TextField
                  name={key}
                  label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  value={editedRow[key]}
                  onChange={handleEditedRowChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  variant="outlined"
                  disabled={key === 'id' || key === 'parent_category_id'}
                />
              </FormControl>
            ))}
            <h4>Categories</h4>
            {editedRow && editedRow.categories.map((cat, index) => (
              <div key={index}>
                <TextField
                  name={`categories.category_id`}
                  label="Category ID"
                  value={cat.category_id}
                  onChange={(e) => handleEditedRowChange(e, index)}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: '8px' }}
                />
                <TextField
                  name={`categories.category`}
                  label="Category"
                  value={cat.category}
                  onChange={(e) => handleEditedRowChange(e, index)}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: '8px' }}
                />
                <TextField
                  name={`categories.category_description`}
                  label="Category Description"
                  value={cat.category_description}
                  onChange={(e) => handleEditedRowChange(e, index)}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: '8px' }}
                />
              </div>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleSaveEditedRow} variant="contained" color="primary" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainCard>
  );
};

export default CategoryID;