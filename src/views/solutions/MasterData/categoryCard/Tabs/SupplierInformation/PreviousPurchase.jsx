import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Box,
  Grid,
  Avatar,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Tooltip from "@mui/material/Tooltip";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { MASTER_DATA } from "store/constant";
import axios from "axios";

const RatingChip = ({ score, label }) => {
  return (
    <Chip
      label={`${label}: ${typeof score === 'boolean' ? score : score ? score.toFixed(2) : "N/A"}`}
      sx={{
        border: "1px solid #6b6be2",
        color: "#6b6be2",
        bgcolor: "background.paper",
        mr: 1,
        mb: 1,
      }}
    />
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const PreviousPurchase = ({ previousPurchases, categoryName }) => {
  const [expandedSupplier, setExpandedSupplier] = useState({});
  const [tabValue, setTabValue] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async (supplier_id) => {
      try {
        const response = await axios.get(`${MASTER_DATA}/purchaseOrders/${categoryName}/supplierPOs/${supplier_id}`);
        setData(prevData => ({
          ...prevData,
          [supplier_id]: response.data
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    previousPurchases.forEach((purchase) => {
      fetchData(purchase.id);
    });
  }, [categoryName, previousPurchases]);

  const handleExpandSupplierClick = (supplierId) => {
    setExpandedSupplier((prev) => ({
      ...prev,
      [supplierId]: !prev[supplierId],
    }));
  };

  const handleTabChange = (supplierId, newValue) => {
    setTabValue((prev) => ({ ...prev, [supplierId]: newValue }));
  };

  const filterEmptyColumns = (columns, dataArray) => {
    return columns.filter(column =>
      dataArray.some(row => row[column.field] != null && row[column.field] !== '')
    );
  };

  if (!previousPurchases || previousPurchases.length === 0) {
    return <Typography>No Approved Suppliers available</Typography>;
  }
  const getSupplierIdFromRowId = (rowId) => {
    return rowId.split('_')[0];
  };
  return (
    <div>
      <Container maxWidth="2xl" sx={{ mt: 1 }}>
        <List>
          {previousPurchases.map((supplier) => (
            <Paper
              sx={{
                mb: 1,
                borderRadius: 5,
                overflow: "hidden",
                border: "1px solid #e6e6e6",
                boxShadow: "none",
              }}
              key={supplier.id}
            >
              <ListItem
                button
                onClick={() => handleExpandSupplierClick(supplier.id)}
                sx={{
                  backgroundColor: "#ffffff",
                  "&:hover": { backgroundColor: "#f3f6f4" },
                  transition: "background-color 0.3s",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#d0e0e3",
                    mr: 2,
                    width: 60,
                    height: 60,
                    fontSize: "1.5rem",
                  }}
                >
                  {supplier.name[0]}
                </Avatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: "#2c3e50" }}
                    >
                      {supplier.name}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body1"
                        color="text.primary"
                        sx={{ fontWeight: "medium", mb: 1 }}
                      >
                        Supplier ID: {supplier.id}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <LocationOnIcon sx={{ color: "#6b6be2", mr: 1 }} />
                        <Typography variant="body2">
                          {supplier.city}, {supplier.country} -{" "}
                          {supplier.zipcode}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1 }}>
                        <RatingChip
                          score={
                            (supplier.onTimeDeliveryScore +
                              supplier.financialScore +
                              supplier.qualityScore) /
                            3
                          }
                          label="Overall Rating"
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 1,
                        }}
                      ></Box>
                    </React.Fragment>
                  }
                />
                {expandedSupplier[supplier.id] ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItem>
              <Collapse
                in={expandedSupplier[supplier.id]}
                timeout="auto"
                unmountOnExit
              >
                <Box sx={{ p: 2, bgcolor: "background.paper" }}>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        mt: 1,
                        bgcolor: "background.paper",
                      }}
                    >
                      <RatingChip
                        score={supplier.onTimeDeliveryScore}
                        label="On-time Delivery"
                      />
                      <RatingChip
                        score={supplier.financialScore}
                        label="Financial"
                        sx={{ bgcolor: "background.paper" }}
                      />
                      <RatingChip
                        score={supplier.qualityScore}
                        label="Quality"
                      />
                      <RatingChip
                        score={supplier.onTimeDeliveryScore}
                        label="Sustainability"
                      />
                      <RatingChip
                        score={supplier.minoritySupplier}
                        label="Minority"
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      mt: 2,
                      color: "#6b6be2",
                    }}
                  >
                    <Tabs
                      value={tabValue[supplier.id] || 0}
                      onChange={(event, newValue) =>
                        handleTabChange(supplier.id, newValue)
                      }
                    >

                      <Tab label="PO" />

                    </Tabs>
                  </Box>

                  <TabPanel value={tabValue[supplier.id] || 0} index={0}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Tooltip title="Upload CSV" placement="top">
                        <IconButton
                          aria-label="upload csv"
                          component="label"
                          sx={{
                            color: "#6b6be2",
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
                    <div style={{ height: 400, width: "100%" }}>
                      <DataGrid
                        rows={data[supplier.id] || []}
                        columns={filterEmptyColumns([
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
                          { field: 'form_id', headerName: 'Form ID', width: 130 },
                          { field: 'form_description', headerName: 'Form Description', width: 130 },
                        ], data[supplier.id] || [])}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        checkboxSelection
                        disableSelectionOnClick
                        getRowId={(row) => `${row.supplier_id}_${row.po_number}_${row.product_id}`}
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
                  </TabPanel>
                </Box>
              </Collapse>
            </Paper>
          ))}
        </List>
      </Container>
    </div>
  );
};
export default PreviousPurchase;
