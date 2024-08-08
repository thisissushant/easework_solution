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
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { MASTER_DATA } from "store/constant";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainCard from "ui-component/cards/MainCard";
import UploadFileIcon from '@mui/icons-material/UploadFile';

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
}));

const Forms = () => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newRow, setNewRow] = useState({
    form_id: "",
    form_description: "",
    category: "",
    country: "",
    supplier_name: "",
    supplier_id: "",
    parent_category: "",
  });

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    filterRows();
  }, [searchTerm, rows]);

  const fetchForms = async () => {
    try {
      const response = await axios.get(`${MASTER_DATA}/form/getAllForms`);
      const { transformedColumns, transformedRows } = transformData(response.data);
      setColumns(transformedColumns);
      setRows(transformedRows);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast.error("Failed to fetch forms");
    }
  };

  const transformData = (data) => {
    if (!data || data.length === 0) {
      console.error("Input data is undefined, null, or empty");
      return { transformedColumns: [], transformedRows: [] };
    }

    const keys = Object.keys(data[0]);
    const transformedColumns = keys.map((key) => ({
      field: key,
      headerName: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      flex: 1,
      minWidth: 150,
      editable: true,
      headerClassName: 'super-app-theme--header',
    }));

    transformedColumns.push(
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
            <DeleteIcon />
          </Button>
        ),
      }
    );


    const transformedRows = data.map((item, index) => ({
      id: index + 1,
      ...item,
    }));

    return { transformedColumns, transformedRows };
  };

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
  const handleBulkUpload = (event) => {
    const file = event.target.files[0];
    console.log("File uploaded:", file.name);
    // Implement bulk upload logic here
  };
  
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewRow({
      form_id: "",
      form_description: "",
      category: "",
      country: "",
      supplier_name: "",
      supplier_id: "",
      parent_category: "",
    });
  };

  const handleNewRowChange = (event) => {
    const { name, value } = event.target;
    setNewRow((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRow = async () => {
    try {
      const response = await axios.post(`${MASTER_DATA}/form/createForm`, newRow);
      console.log("Form added:", response.data);
      setRows((prevRows) => [...prevRows, { ...newRow, id: prevRows.length + 1 }]);
      handleCloseAddDialog();
      toast.success(`New form added: ${newRow.form_id}`);
      fetchForms();
    } catch (error) {
      console.error("Error adding form:", error);
      toast.error("Failed to add new form");
    }
  };

  const handleDeleteRow = async (row) => {
    try {
      await axios.delete(`${MASTER_DATA}/form/deleteForm/${row.form_id}`);
      setRows((prevRows) => prevRows.filter((r) => r.id !== row.id));
      toast.success(`Form ${row.form_id} deleted`);
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error("Failed to delete form");
    }
  };

  return (
    <MainCard title="Forms">
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
                <Tooltip title="Create New Form">
                  <IconButton
                    onClick={handleOpenAddDialog}
                    className={classes.addButton}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Upload CSV File">
                  <IconButton component="label" className={classes.addButton}>
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
            sx={{
              '& .super-app-theme--header': {
                backgroundColor: 'white',
                color: '#5e17eb',
              },
            }}
          />
        </div>

        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>Add New Form</DialogTitle>
          <DialogContent style={{ paddingTop: '20px' }}>
            {Object.keys(newRow).map((key) => (
              <FormControl fullWidth key={key} style={{ marginBottom: '16px' }}>
                <TextField
                  name={key}
                  label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  value={newRow[key]}
                  onChange={handleNewRowChange}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} sx={{ color: "#666" }}>Cancel</Button>
            <Button onClick={handleAddRow} variant="outlined" sx={{ borderColor: iconColor, color: iconColor }}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainCard>
  );
};

export default Forms;