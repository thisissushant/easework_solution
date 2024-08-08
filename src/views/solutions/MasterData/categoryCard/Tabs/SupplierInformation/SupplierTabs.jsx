import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { DataGrid } from "@mui/x-data-grid";
import CatalogIcon from "@mui/icons-material/Category";
import ContractIcon from "@mui/icons-material/Description";
import PurchaseOrderIcon from "@mui/icons-material/Receipt";
import FormsIcon from "@mui/icons-material/Assignment";
import axios from "axios";
import { MASTER_DATA } from "store/constant";

const SupplierTabs = ({ supplier, categoryName }) => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    catalogs: [],
    contracts: [],
    purchaseOrders: [],
    forms: [],
  });
  const [tabsWithData, setTabsWithData] = useState([0, 1, 2, 3]);
  const [fetchedTabs, setFetchedTabs] = useState([]);

  const handleTabChange = (event, newValue) => {
    if (tabsWithData.includes(newValue)) {
      setTabValue(newValue);
      fetchData(newValue);
    }
  };
  const filterData = useCallback(
    (dataArray) => {
      if (!searchTerm) return dataArray;
      return dataArray.filter((item) =>
        Object.values(item).some(
          (val) =>
            val &&
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    },
    [searchTerm]
  );

  const fetchData = async (tabIndex) => {
    if (fetchedTabs.includes(tabIndex)) {
      return; // Data already fetched for this tab, no need to fetch again
    }

    setLoading(true);
    setError(null);
    try {
      let endpoint;
      switch (tabIndex) {
        case 0:
          endpoint = `${MASTER_DATA}/catalogs/${categoryName}/supplierCatalogs/${supplier.id}`;
          break;
        case 1:
          endpoint = `${MASTER_DATA}/contracts/${categoryName}/supplierContracts/${supplier.id}`;
          break;
        case 2:
          endpoint = `${MASTER_DATA}/purchaseOrders/${categoryName}/supplierPOs/${supplier.id}`;
          break;
        case 3:
          endpoint = `${MASTER_DATA}/form/${categoryName}/supplierForms/${supplier.id}`;
          break;
        default:
          break;
      }

      const response = await axios.get(endpoint);
      const newData = { ...data };
      newData[Object.keys(data)[tabIndex]] = response.data;
      setData(newData);
      setFetchedTabs([...fetchedTabs, tabIndex]);

      // Update tabsWithData
      if (response.data.length === 0) {
        setTabsWithData(prevTabs => prevTabs.filter(tab => tab !== tabIndex));
      } else if (!tabsWithData.includes(tabIndex)) {
        setTabsWithData(prevTabs => [...prevTabs, tabIndex]);
      }
    } catch (err) {
      // ... error handling ...
      // Assume no data for this tab on error
      setTabsWithData(prevTabs => prevTabs.filter(tab => tab !== tabIndex));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFetchedTabs([]);
    setTabsWithData([0, 1, 2, 3]); 
    fetchData(0);
  }, [categoryName, supplier.id]);

  const filterEmptyColumns = (columns, dataArray) => {
    return columns.filter(column =>
      dataArray.some(row => row[column.field] != null && row[column.field] !== '')
    );
  };

  const catalogColumns = [
    { field: 'catalog_id', headerName: 'Catalog ID', width: 130 },
    { field: 'product_name', headerName: 'Product Name', width: 200 },
    { field: 'product_id', headerName: 'Product ID', width: 130 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'specification', headerName: 'Specification', width: 200 },
    { field: 'unit_price', headerName: 'Unit Price', type: 'number', width: 110 },
    { field: 'quantity', headerName: 'Quantity', type: 'number', width: 110 },
    { field: 'unit_of_measure', headerName: 'Unit of Measure', width: 150 },
    { field: 'currency', headerName: 'Currency', width: 110 },
    { field: 'lead_time', headerName: 'Lead Time', type: 'number', width: 110 },
  ];

  const contractColumns = [
    { field: 'contract_id', headerName: 'Contract ID', width: 130 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'contract_start_date', headerName: 'Start Date', width: 130 },
    { field: 'contract_end_date', headerName: 'End Date', width: 130 },
    { field: 'contract_term', headerName: 'Term', type: 'number', width: 100 },
    { field: 'contract_value', headerName: 'Value', type: 'number', width: 130 },
    { field: 'contract_utilised', headerName: 'Utilised', type: 'number', width: 130 },
    { field: 'avg_cost_per_hour', headerName: 'Avg Cost/Hour', type: 'number', width: 130 },
    { field: 'hours_worked', headerName: 'Hours Worked', type: 'number', width: 130 },
    { field: 'fixed_cost', headerName: 'Fixed Cost', type: 'number', width: 130 },
    { field: 'currency', headerName: 'Currency', width: 110 },
    { field: 'form_id', headerName: 'Form ID', width: 130 },
    { field: 'form_description', headerName: 'Form Description', width: 300 },
  ];

  const poColumns = [
    { field: 'po_number', headerName: 'PO Number', width: 130 },
    { field: 'product_name', headerName: 'Product Name', width: 200 },
    { field: 'product_id', headerName: 'Product ID', width: 130 },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'parent_category', headerName: 'Parent Category', width: 150 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'specification', headerName: 'Specification', width: 200 },
    { field: 'contract_id', headerName: 'Contract ID', width: 130 },
    { field: 'catalog_id', headerName: 'Catalog ID', width: 130 },
    { field: 'unit_price', headerName: 'Unit Price', type: 'number', width: 110 },
    { field: 'quantity', headerName: 'Quantity', type: 'number', width: 110 },
    { field: 'po_amount', headerName: 'PO Amount', type: 'number', width: 130 },
    { field: 'invoice_amount', headerName: 'Invoice Amount', type: 'number', width: 130 },
    { field: 'unit_of_measure', headerName: 'Unit of Measure', width: 150 },
    { field: 'currency', headerName: 'Currency', width: 110 },
    { field: 'po_date', headerName: 'PO Date', width: 130 },
    { field: 'invoice_date', headerName: 'Invoice Date', width: 130 },
    { field: 'delivery_date', headerName: 'Delivery Date', width: 130 },
    { field: 'actual_receipt_date', headerName: 'Actual Receipt Date', width: 150 },
    { field: 'department', headerName: 'Department', width: 130 },
    { field: 'cost_center', headerName: 'Cost Center', width: 130 },
    { field: 'gl_account_id', headerName: 'GL Account ID', width: 130 },
    { field: 'requester', headerName: 'Requester', width: 130 },
    { field: 'quality_check', headerName: 'Quality Check', type: 'boolean', width: 130 },
  ];

  const formColumns = [
    { field: 'form_id', headerName: 'Form ID', width: 130 },
    { field: 'form_description', headerName: 'Form Description', width: 300 },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'country', headerName: 'Country', width: 130 },
    { field: 'parent_category', headerName: 'Parent Category', width: 150 },
  ];

  const renderDataGrid = (dataArray, columns) => {
    if (dataArray.length === 0) return null;

    const filteredColumns = filterEmptyColumns(columns, dataArray);

    return (
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filterData(dataArray)}
          columns={filteredColumns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => `${row.product_id || ''}-${row.contract_id || ''}-${row.po_number || ''}-${row.form_id || ''}`}
          sx={{
            "& .super-app-theme--header": {
              backgroundColor: "#ffffff",
              color: "#1a3e72",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "2px solid #ccc",
              minHeight: "56px !important",
              maxHeight: "56px !important",
              lineHeight: "56px !important",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              fontSize: "16px",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-row.active": {
              bgcolor: "white",
            },
            "& .MuiDataGrid-row:hover": {
              bgcolor: "white",
            },
          }}
        />
      </div>
    );
  };

  const allTabsEmpty =
    data.catalogs.length === 0 &&
    data.contracts.length === 0 &&
    data.purchaseOrders.length === 0 &&
    data.forms.length === 0;

  return (
    <>
      <Box sx={{ borderBottom: 0, borderColor: "divider", mt: 2, color: "#5e17eb" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{ style: { backgroundColor: "#5e17eb" } }}
          sx={{
            "& .MuiTab-root": {
              color: "text.secondary",
              "&.Mui-selected": { color: "#5e17eb" },
            },
          }}
        >
          <Tab icon={<CatalogIcon />} label="Catalog" disabled={!tabsWithData.includes(0)} />
          <Tab icon={<ContractIcon />} label="Contract" disabled={!tabsWithData.includes(1)} />
          <Tab icon={<PurchaseOrderIcon />} label="PO" disabled={!tabsWithData.includes(2)} />
          <Tab icon={<FormsIcon />} label="Forms" disabled={!tabsWithData.includes(3)} />
        </Tabs>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          mt: 2,
        }}
      >
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "200px",
            backgroundColor: "white",
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              "& fieldset": {
                borderColor: "#5e17eb",
              },
              "&:hover fieldset": {
                borderColor: "#5e17eb",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#5e17eb",
              },
            },
          }}
        />
        <Tooltip title="Upload CSV">
          <IconButton
            aria-label="upload csv"
            component="label"
            sx={{
              color: "#5e17eb",
              "&:hover": {
                color: "#5a5ad1",
              },
            }}
          >
            <input hidden accept=".csv" type="file" />
            <UploadFileIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {tabValue === 0 && renderDataGrid(data.catalogs, catalogColumns)}
          {tabValue === 1 && renderDataGrid(data.contracts, contractColumns)}
          {tabValue === 2 && renderDataGrid(data.purchaseOrders, poColumns)}
          {tabValue === 3 && renderDataGrid(data.forms, formColumns)}
          {data.catalogs.length === 0 && data.contracts.length === 0 &&
            data.purchaseOrders.length === 0 && data.forms.length === 0 && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                No data available for this supplier in any category.
              </Typography>
            )}
        </>
      )}
    </>
  );
};
export default SupplierTabs;