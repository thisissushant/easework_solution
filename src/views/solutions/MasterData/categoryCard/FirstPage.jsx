import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Link,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Typography,
  Switch,
  TextField,
  CircularProgress
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import countryList from "react-select-country-list";
import MainCard from "ui-component/cards/MainCard";
import useCategoryCard from "hooks/useCategoryCard";
import useCategoryID from "hooks/useCategoryId";
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';

const useStyles = makeStyles((theme) => ({
  iconButton: {
    "&:hover": {
      backgroundColor: theme.palette.grey[300],
    },
  },
  customNoRowsOverlay: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    "& .ant-empty-img-1": {
      fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
    },
    "& .ant-empty-img-2": {
      fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
    },
    "& .ant-empty-img-3": {
      fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
    },
    "& .ant-empty-img-4": {
      fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
    },
    "& .ant-empty-img-5": {
      fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
      fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
    },
  },
  label: {
    backgroundColor: "white",
    padding: "0 5px",
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
    right: '80px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#5e17eb',
  },
  createButton: {
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
  tableHeader: {
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#f0f0f0',
      '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: 'bold',
        fontSize: '1rem',
        color: '#5e17eb',
      },
    },
  },
  formControl: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'gray',
      },
      '&:hover fieldset': {
        borderColor: 'gray',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'gray',
      },
    },
  },
}));

const FirstPage = ({ onCategorySelect, onAddCategories, categories, setCategories, handleStatusChange, categoryStates }) => {
  const classes = useStyles();
  const { categoryCard, isLoading } = useCategoryCard();
  const { categoryId } = useCategoryID();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({
    parent_category_id: "",
    parent_category_name: "",
    description: "",
    category_level: "",
    unspsc_code: "",
    subcategories: [],
    category_owner: "",
    country: "",
  });

  const allCategories = useMemo(() => [...categoryCard, ...categories], [categoryCard, categories]);

  useEffect(() => {
    setFilteredRows(allCategories);
  }, [allCategories]);

  const countries = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    const filterRows = () => {
      if (searchTerm === "") {
        setFilteredRows(allCategories);
      } else {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = allCategories.filter((row) => {
          return Object.keys(row).some((key) =>
            String(row[key]).toLowerCase().includes(lowercasedFilter)
          );
        });
        setFilteredRows(filteredData);
      }
    };
    filterRows();
  }, [searchTerm, allCategories]);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewCategory({
      parent_category_id: "",
      parent_category_name: "",
      description: "",
      category_level: "",
      unspsc_code: "",
      subcategories: [],
      category_owner: "",
      country: "",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryIdChange = (event) => {
    const selectedId = event.target.value;
    const selectedCategory = categoryId.find(
      (cat) => cat.parent_category_id === selectedId
    );
    if (selectedCategory) {
      setNewCategory({
        ...selectedCategory,
        subcategories: [],
        category_owner: "",
        country: "",
      });
    }
  };

  const handleSubcategoriesChange = (event) => {
    setNewCategory((prev) => ({ ...prev, subcategories: event.target.value }));
  };

  const handleSaveCategory = () => {
    if (!newCategory.parent_category_id || !newCategory.category_owner || !newCategory.country) {
      return;
    }

    const newCategories = newCategory.subcategories.map(subcategory => ({
      ...newCategory,
      subcategory_id: subcategory.id,
      subcategory_name: subcategory.name,
      category_card_id: `CCD_${subcategory.id}_${subcategory.name}_${newCategory.country}`,
      status: false
    }));

    onAddCategories(newCategories);
    handleCloseAddDialog();
  };

  const handleCountryChange = (event) => {
    setNewCategory((prev) => ({ ...prev, country: event.target.value }));
  };

  const CustomNoRowsOverlay = () => {
    return (
      <GridOverlay className={classes.customNoRowsOverlay}>
        <Typography variant="h6" color="textSecondary">
          No such category found!
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Create your own category by clicking the Maintain Category Card button.
        </Typography>
      </GridOverlay>
    );
  };

  const columns = useMemo(() => [
    {
      field: "category_card_id",
      headerName: "Category Card ID",
      flex: 2,
      renderCell: (params) => (
        <Link
          component="button"
          variant="body2"
          className="link-hover-effect"
          style={{ color: 'black', textDecoration: "none", position: 'relative' }}
          onClick={() => onCategorySelect(params.row)}
        >
          {params.value}
          <OpenInNewIcon style={{ fontSize: 'small', position: 'absolute', top: 0, right: -15 }} />
        </Link>
      ),
    },
    { field: "category_card_description", headerName: "Category Card Description", flex: 2 },
    { field: "parent_category_id", headerName: "Parent Category ID", flex: 1 },
    { field: "parent_category_name", headerName: "Parent Category Name", flex: 1.5 },
    { field: "country", headerName: "Country", flex: 1 },
    { field: "category_owner", headerName: "Category Owner", flex: 2 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const isChecked = categoryStates[params.row.category_card_id] !== undefined 
          ? categoryStates[params.row.category_card_id] 
          : params.value;
        
        return (
          <Switch
            checked={isChecked}
            onChange={() => {
              handleStatusChange(params.row.category_card_id, !isChecked);
            }}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#5e17eb",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#5e17eb",
              },
            }}
          />
        );
      },
    }
  ], [handleStatusChange, categoryStates]);

  return (
    <MainCard border={false} title="Category Card">
      <Container maxWidth="2xl">
        <div className={classes.searchContainer}>
          <input
            className={classes.searchInput}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className={classes.searchIcon} />
          <Tooltip placement="top" title="Create Category Card">
            <Button
              variant="contained"
              className={classes.createButton}
              onClick={handleOpenAddDialog}
            >
              <AddIcon />
            </Button>
          </Tooltip>
        </div>

        <div style={{ height: 700, width: "100%" }} className={classes.tableHeader}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10]}
            disableSelectionOnClick
            disableColumnSelector
            disableDensitySelector
            checkboxSelection={false}
            getRowId={(row) =>
              row.category_card_id || `temp-${row.parent_category_id}-${row.country}`
            }
            loading={isLoading}
            components={{
              NoRowsOverlay: () => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  {isLoading && (
                    <CircularProgress sx={{ color: "#9747FF !important" }} />
                  )}
                </Box>
              ),
            }}
          />
        </div>

        <Dialog
          open={openAddDialog}
          onClose={handleCloseAddDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h4">Create Category Card</Typography>
          </DialogTitle>
          <DialogContent style={{ paddingTop: "20px" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal" className={classes.formControl} required>
                  <InputLabel id="category-id-label">Parent Category ID</InputLabel>
                  <Select
                    labelId="category-id-label"
                    name="parent_category_id"
                    value={newCategory.parent_category_id}
                    onChange={handleCategoryIdChange}
                    label="Parent Category ID"
                  >
                    {categoryId &&
                      categoryId.map((cat) => (
                        <MenuItem
                          key={cat.parent_category_id}
                          value={cat.parent_category_id}
                        >
                          {cat.parent_category_id}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Parent Category Name"
                  name="parent_category_name"
                  value={newCategory.parent_category_name}
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="normal"
                  className={classes.formControl}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={newCategory.description}
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="normal"
                  multiline
                  rows={3}
                  className={classes.formControl}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Category Level"
                  name="category_level"
                  value={newCategory.category_level}
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="normal"
                  className={classes.formControl}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="UNSPSC Code"
                  name="unspsc_code"
                  value={newCategory.unspsc_code}
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="normal"
                  className={classes.formControl}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal" className={classes.formControl} disabled={!newCategory.parent_category_id}>
                  <InputLabel id="subcategories-label">Subcategory</InputLabel>
                  <Select
                    labelId="subcategories-label"
                    multiple
                    name="subcategories"
                    value={newCategory.subcategories}
                    onChange={handleSubcategoriesChange}
                    label="Subcategory"
                    renderValue={(selected) => (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {selected.map((value) => (
                          <Chip key={value.id} label={`${value.id}: ${value.name}`} />
                        ))}
                      </div>
                    )}
                  >
                    {newCategory.parent_category_id &&
                      categoryId
                        .find(
                          (cat) => cat.parent_category_id === newCategory.parent_category_id
                        )
                        ?.subcategories?.map((subcategory) => (
                          <MenuItem key={subcategory.id} value={subcategory}>
                            {`${subcategory.id}: ${subcategory.name}`}
                          </MenuItem>
                        ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                 fullWidth
                 label="Category Owner"
                 name="category_owner"
                 value={newCategory.category_owner}
                 onChange={handleInputChange}
                 margin="normal"
                 className={classes.formControl}
                 required
               />
             </Grid>
             <Grid item xs={6}>
               <FormControl fullWidth margin="normal" className={classes.formControl} required>
                 <InputLabel id="country-label">Country</InputLabel>
                 <Select
                   labelId="country-label"
                   name="country"
                   value={newCategory.country}
                   onChange={handleCountryChange}
                   label="Country">
                   {countries.map((country) => (
                     <MenuItem key={country.value} value={country.value}>
                       <span
                         className={`flag-icon flag-icon-${country.value.toLowerCase()}`}
                         style={{ marginRight: "8px" }}
                       ></span>
                       {country.label}
                     </MenuItem>
                   ))}
                 </Select>
               </FormControl>
             </Grid>
           </Grid>
         </DialogContent>
         <DialogActions>
           <Button onClick={handleCloseAddDialog} style={{ color: '#5e17eb' }}>
             Cancel
           </Button>
           <Button 
             onClick={handleSaveCategory} 
             variant="contained" 
             color="primary"
             disabled={!newCategory.parent_category_id || !newCategory.category_owner || !newCategory.country}
           >
             Save
           </Button>
         </DialogActions>
       </Dialog>
     </Container>
   </MainCard>
 );
};

export default FirstPage;