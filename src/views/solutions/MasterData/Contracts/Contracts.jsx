import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Menu,
  MenuItem,
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
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { DataGrid } from "@mui/x-data-grid";
import useContracts from "hooks/useContracts";
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
}));

const Contracts = () => {
  const classes = useStyles();
  const { contracts } = useContracts();
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newRow, setNewRow] = useState({
    supplier_name: "",
    avg_cost_per_hour: 0,
    hours_worked: 0,
    fixed_cost: 0,
    supplier_id: "",
    contract_id: "",
    contract_value: 0,
    contract_utilised: 0,
    contract_term: 0,
    form_id: "",
    form_description: "",
    category: "",
    parent_category: "",
    description: "",
    currency: "",
    contract_start_date: new Date().toISOString(),
    contract_end_date: new Date().toISOString()
  });

  useEffect(() => {
    if (contracts) {
      const { transformedColumns, transformedRows } = transformData(contracts);
      setColumns(transformedColumns);
      setRows(transformedRows);
    } else {
      setColumns([
        { field: 'supplier_name', headerName: 'Supplier Name', flex: 1, minWidth: 150 },
        { field: 'avg_cost_per_hour', headerName: 'Avg Cost Per Hour', flex: 1, minWidth: 150 },
        { field: 'hours_worked', headerName: 'Hours Worked', flex: 1, minWidth: 150 },
        { field: 'fixed_cost', headerName: 'Fixed Cost', flex: 1, minWidth: 150 },
        { field: 'supplier_id', headerName: 'Supplier ID', flex: 1, minWidth: 150 },
        { field: 'contract_id', headerName: 'Contract ID', flex: 1, minWidth: 150 },
        { field: 'contract_value', headerName: 'Contract Value', flex: 1, minWidth: 150 },
        { field: 'contract_utilised', headerName: 'Contract Utilised', flex: 1, minWidth: 150 },
        { field: 'contract_term', headerName: 'Contract Term', flex: 1, minWidth: 150 },
        { field: 'form_id', headerName: 'Form ID', flex: 1, minWidth: 150 },
        { field: 'form_description', headerName: 'Form Description', flex: 1, minWidth: 150 },
        { field: 'category', headerName: 'Category', flex: 1, minWidth: 150 },
        { field: 'parent_category', headerName: 'Parent Category', flex: 1, minWidth: 150 },
        { field: 'description', headerName: 'Description', flex: 1, minWidth: 150 },
        { field: 'currency', headerName: 'Currency', flex: 1, minWidth: 150 },
        { field: 'contract_start_date', headerName: 'Contract Start Date', flex: 1, minWidth: 150 },
        { field: 'contract_end_date', headerName: 'Contract End Date', flex: 1, minWidth: 150 },
      ]);
      setRows([]);
    }
  }, [contracts]);

  useEffect(() => {
    filterRows();
  }, [searchTerm, rows]);

  const handleBulkUpload = (event) => {
    const file = event.target.files[0];
    console.log("File uploaded:", file.name);
    // Implement bulk upload logic here
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (column) => {
    console.log("Filtering by:", column);
    setAnchorEl(null);
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

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewRow({
      supplier_name: "",
      avg_cost_per_hour: 0,
      hours_worked: 0,
      fixed_cost: 0,
      supplier_id: "",
      contract_id: "",
      contract_value: 0,
      contract_utilised: 0,
      contract_term: 0,
      form_id: "",
      form_description: "",
      category: "",
      parent_category: "",
      description: "",
      currency: "",
      contract_start_date: new Date().toISOString(),
      contract_end_date: new Date().toISOString()
    });
  };

  const handleNewRowChange = (event) => {
    const { name, value, type } = event.target;
    setNewRow((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleAddRow = async () => {
    try {
      const response = await axios.post(`${MASTER_DATA}/contracts/createContract`, newRow);
      console.log("Row added:", response.data);
      setRows((prevRows) => [...prevRows, { ...newRow, id: prevRows.length + 1 }]);
      handleCloseAddDialog();
      toast.success(`New contract added: ${newRow.contract_id}`);
    } catch (error) {
      console.error("Error adding row:", error);
      toast.error("Failed to add new contract");
    }
  };

  const handleDeleteRow = async (row) => {
    try {
      await axios.delete(`${MASTER_DATA}/contracts/deleteContract/${row.contract_id}`);
      setRows((prevRows) => prevRows.filter((r) => r.id !== row.id));
      toast.success(`Contract ${row.contract_id} deleted`);
    } catch (error) {
      console.error("Error deleting row:", error);
      toast.error("Failed to delete contract");
    }
  };

  return (
    <MainCard title="Contracts">
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
                <Tooltip title="Create New Contract">
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

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
          {columns.map((column, index) => (
            <MenuItem key={index} onClick={() => handleFilterSelect(column.field)}>
              {column.headerName}
            </MenuItem>
          ))}
        </Menu>

        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>Add New Contract</DialogTitle>
          <DialogContent style={{ paddingTop: '20px' }}>
            {Object.keys(newRow).map((key) => (
              <FormControl fullWidth key={key} style={{ marginBottom: '16px' }}>
                <TextField
                  name={key}
                  label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  value={newRow[key]}
                  onChange={handleNewRowChange}
                  type={key.includes('date') ? 'datetime-local' : 
                        ['avg_cost_per_hour', 'hours_worked', 'fixed_cost', 'contract_value', 'contract_utilised', 'contract_term'].includes(key) ? 'number' : 'text'}
                  InputLabelProps={{ shrink: true }}
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

export default Contracts;