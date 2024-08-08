import React, { useState } from "react";
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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Tooltip from "@mui/material/Tooltip";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const ScoreChip = ({ score, label }) => {
  const getColor = (score) => {
    if (score >= 4.5) return "#4caf50";
    if (score >= 4) return "#8bc34a";
    if (score >= 3.5) return "#ffeb3b";
    if (score >= 3) return "#ffc107";
    return "#f44336";
  };

  return (
    <Chip
      label={`${label}: ${score.toFixed(2)}`}
      sx={{
        backgroundColor: getColor(score),
        color: "white",
        fontWeight: "bold",
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
const PreviousPurchase = () => {
  const [expandedSupplier, setExpandedSupplier] = useState({});
  const [tabValue, setTabValue] = useState({});
  const [preferredSuppliers, setPreferredSuppliers] = useState([
    {
      name: "LG Electronics",
      id: "SA001",
      onTimeDeliveryScore: 4.75,
      financialScore: 4.4,
      qualityScore: 4.0,
      avgCost: "$1000",
      referenceCatalog: "CAT001",
      referenceContract: "CON001",
      avgCostPerHour: "$50",
      fixedCostEngagement: "$5000",
      formId: "FORM001",
      country: "United States",
      city: "Round Rock",
      zipcode: "78682",
      formDescription: "Standard Service Agreement",
      catalogData: [
        {
          catalogId: "CAT001",
          category: "Laptops",
          subcategory: "Business",
          productName: "Latitude 5520",
          productId: "LAT5520",
          description: "Business laptop",
          specifications: '15.6" FHD, Intel i7, 16GB RAM, 512GB SSD',
          unitPrice: 1299,
          currency: "USD",
          leadTime: 7,
          quantity: 100,
        },
        {
          catalogId: "CAT001",
          category: "Desktops",
          subcategory: "Workstation",
          productName: "Precision 3650",
          productId: "PRE3650",
          description: "Tower workstation",
          specifications:
            "Intel Xeon W-1250, 32GB RAM, 1TB SSD, NVIDIA Quadro P1000",
          unitPrice: 1799,
          currency: "USD",
          leadTime: 10,
          quantity: 50,
        },
      ],
    },
    {
      name: "Samsung Electronics",
      id: "SA002",
      onTimeDeliveryScore: 3.0,
      financialScore: 4.4,
      qualityScore: 4.9,
      avgCost: "$1000",
      referenceCatalog: "CAT001",
      referenceContract: "CON001",
      avgCostPerHour: "$50",
      fixedCostEngagement: "$5000",
      formId: "FORM001",
      country: "United States",
      city: "Palo Alto",
      zipcode: "94304",
      formDescription: "Standard Service Agreement",
      catalogData: [
        {
          catalogId: "CAT001",
          category: "Laptops",
          subcategory: "Business",
          productName: "Latitude 5520",
          productId: "LAT5520",
          description: "Business laptop",
          specifications: '15.6" FHD, Intel i7, 16GB RAM, 512GB SSD',
          unitPrice: 1299,
          currency: "USD",
          leadTime: 7,
          quantity: 100,
        },
        {
          catalogId: "CAT001",
          category: "Desktops",
          subcategory: "Workstation",
          productName: "Precision 3650",
          productId: "PRE3650",
          description: "Tower workstation",
          specifications:
            "Intel Xeon W-1250, 32GB RAM, 1TB SSD, NVIDIA Quadro P1000",
          unitPrice: 1799,
          currency: "USD",
          leadTime: 10,
          quantity: 50,
        },
      ],
    },
    {
      name: "Lanovo",
      id: "SA003",
      onTimeDeliveryScore: 4.4,
      financialScore: 5.0,
      qualityScore: 4.0,
      avgCost: "$1000",
      referenceCatalog: "CAT001",
      referenceContract: "CON001",
      avgCostPerHour: "$50",
      fixedCostEngagement: "$5000",
      formId: "FORM001",
      country: "China",
      city: "Beijing",
      zipcode: "100085",
      formDescription: "Standard Service Agreement",
      catalogData: [
        {
          catalogId: "CAT001",
          category: "Laptops",
          subcategory: "Business",
          productName: "Latitude 5520",
          productId: "LAT5520",
          description: "Business laptop",
          specifications: '15.6" FHD, Intel i7, 16GB RAM, 512GB SSD',
          unitPrice: 1299,
          currency: "USD",
          leadTime: 7,
          quantity: 100,
        },
        {
          catalogId: "CAT001",
          category: "Desktops",
          subcategory: "Workstation",
          productName: "Precision 3650",
          productId: "PRE3650",
          description: "Tower workstation",
          specifications:
            "Intel Xeon W-1250, 32GB RAM, 1TB SSD, NVIDIA Quadro P1000",
          unitPrice: 1799,
          currency: "USD",
          leadTime: 10,
          quantity: 50,
        },
      ],
    },
    // Add more suppliers here...
  ]);

  const handleExpandSupplierClick = (supplierId) => {
    setExpandedSupplier((prev) => ({
      ...prev,
      [supplierId]: !prev[supplierId],
    }));
  };

  const handleTabChange = (supplierId, newValue) => {
    setTabValue((prev) => ({ ...prev, [supplierId]: newValue }));
  };

  return (
    <div>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "#2c3e50",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ShoppingCartIcon sx={{ mr: 1, color: "#6b6be2" }} />
            Previous Purchase
          </Typography>
        </Box>
        <List>
          {preferredSuppliers.map((supplier) => (
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
                      <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1 }}>
                        <ScoreChip
                          score={supplier.onTimeDeliveryScore}
                          label="On-time Delivery"
                        />
                        <ScoreChip
                          score={supplier.financialScore}
                          label="Financial"
                        />
                        <ScoreChip
                          score={supplier.qualityScore}
                          label="Quality"
                        />
                      </Box>
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
                  <Box
                    sx={{
                      bgcolor: "background.paper",
                      p: 2,
                      borderRadius: 3,
                      border: "1px solid #e6e6e6",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ color: "#6b6be2", fontWeight: "bold", mb: 2 }}
                    >
                      Supplier Details
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            mb: 1,
                            p: 1,
                            border: "1px solid #e0e0e0",
                            borderRadius: 3,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            <strong>Avg Cost</strong>
                          </Typography>
                          <Typography variant="body1">
                            {supplier.avgCost}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            mb: 1,
                            p: 1,
                            border: "1px solid #e0e0e0",
                            borderRadius: 3,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            <strong>Avg Cost Per Hour</strong>
                          </Typography>
                          <Typography variant="body1">
                            {supplier.avgCostPerHour}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            mb: 1,
                            p: 1,
                            border: "1px solid #e0e0e0",
                            borderRadius: 3,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            <strong>Fixed Cost Engagement</strong>
                          </Typography>
                          <Typography variant="body1">
                            {supplier.fixedCostEngagement}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            mb: 1,
                            p: 1,
                            border: "1px solid #e0e0e0",
                            borderRadius: 3,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            <strong>Reference Catalog</strong>
                          </Typography>
                          <Typography variant="body1">
                            {supplier.referenceCatalog}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            mb: 1,
                            p: 1,
                            border: "1px solid #e0e0e0",
                            borderRadius: 3,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            <strong>Reference Contract</strong>
                          </Typography>
                          <Typography variant="body1">
                            {supplier.referenceContract}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            mb: 1,
                            p: 1,
                            border: "1px solid #e0e0e0",
                            borderRadius: 3,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            <strong>Form ID</strong>
                          </Typography>
                          <Typography variant="body1">
                            {supplier.formId}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box
                      sx={{
                        mt: 1,
                        p: 1,
                        border: "1px solid #e0e0e0",
                        borderRadius: 3,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        <strong>Form Description</strong>
                      </Typography>
                      <Typography variant="body1">
                        {supplier.formDescription}
                      </Typography>
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
                      <Tab label="Catalog" />
                      <Tab label="Contract" />
                      <Tab label="PO" />
                      <Tab label="Forms" />
                    </Tabs>
                  </Box>
                  <TabPanel value={tabValue[supplier.id] || 0} index={0}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">Catalog Information</Typography>
                      <Tooltip title="Upload CSV">
                        <IconButton
                          aria-label="upload csv"
                          component="label"
                          sx={{
                            color: "#6b6be2",
                            "&:hover": {
                              color: "#5a5ad1", // A slightly darker shade for hover effect
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
                        rows={supplier.catalogData}
                        columns={[
                          { field: "catalogId", headerName: "ID", width: 70 },
                          {
                            field: "category",
                            headerName: "Category",
                            width: 130,
                          },
                          {
                            field: "subcategory",
                            headerName: "Subcategory",
                            width: 130,
                          },
                          {
                            field: "productName",
                            headerName: "Product",
                            width: 130,
                          },
                          {
                            field: "productId",
                            headerName: "Product ID",
                            width: 130,
                          },
                          {
                            field: "description",
                            headerName: "Description",
                            width: 200,
                          },
                          {
                            field: "specifications",
                            headerName: "Specs",
                            width: 200,
                          },
                          {
                            field: "unitPrice",
                            headerName: "Price",
                            type: "number",
                            width: 90,
                            align: "right",
                          },
                          {
                            field: "currency",
                            headerName: "Currency",
                            width: 90,
                          },
                          {
                            field: "leadTime",
                            headerName: "Lead Time",
                            type: "number",
                            width: 110,
                            align: "right",
                          },
                          {
                            field: "quantity",
                            headerName: "Qty",
                            type: "number",
                            width: 90,
                            align: "right",
                          },
                        ]}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        checkboxSelection
                        disableSelectionOnClick
                        getRowId={(row) => row.productId}
                      />
                    </div>
                  </TabPanel>
                  <TabPanel value={tabValue[supplier.id] || 0} index={1}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">Contact Information</Typography>
                      <Tooltip title="Upload CSV">
                        <IconButton
                          aria-label="upload csv"
                          component="label"
                          sx={{
                            color: "#6b6be2",
                            "&:hover": {
                              color: "#5a5ad1", // A slightly darker shade for hover effect
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
                        rows={supplier.catalogData}
                        columns={[
                          { field: "catalogId", headerName: "ID", width: 70 },
                          {
                            field: "category",
                            headerName: "Category",
                            width: 130,
                          },
                          {
                            field: "subcategory",
                            headerName: "Subcategory",
                            width: 130,
                          },
                          {
                            field: "productName",
                            headerName: "Product",
                            width: 130,
                          },
                          {
                            field: "productId",
                            headerName: "Product ID",
                            width: 130,
                          },
                          {
                            field: "description",
                            headerName: "Description",
                            width: 200,
                          },
                          {
                            field: "specifications",
                            headerName: "Specs",
                            width: 200,
                          },
                          {
                            field: "unitPrice",
                            headerName: "Price",
                            type: "number",
                            width: 90,
                            align: "right",
                          },
                          {
                            field: "currency",
                            headerName: "Currency",
                            width: 90,
                          },
                          {
                            field: "leadTime",
                            headerName: "Lead Time",
                            type: "number",
                            width: 110,
                            align: "right",
                          },
                          {
                            field: "quantity",
                            headerName: "Qty",
                            type: "number",
                            width: 90,
                            align: "right",
                          },
                        ]}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        checkboxSelection
                        disableSelectionOnClick
                        getRowId={(row) => row.productId}
                      />
                    </div>
                  </TabPanel>
                  <TabPanel value={tabValue[supplier.id] || 0} index={2}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">
                        Purchase Order Information Information
                      </Typography>
                      <Tooltip title="Upload CSV">
                        <IconButton
                          aria-label="upload csv"
                          component="label"
                          sx={{
                            color: "#6b6be2",
                            "&:hover": {
                              color: "#5a5ad1", // A slightly darker shade for hover effect
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
                        rows={supplier.catalogData}
                        columns={[
                          { field: "catalogId", headerName: "ID", width: 70 },
                          {
                            field: "category",
                            headerName: "Category",
                            width: 130,
                          },
                          {
                            field: "subcategory",
                            headerName: "Subcategory",
                            width: 130,
                          },
                          {
                            field: "productName",
                            headerName: "Product",
                            width: 130,
                          },
                          {
                            field: "productId",
                            headerName: "Product ID",
                            width: 130,
                          },
                          {
                            field: "description",
                            headerName: "Description",
                            width: 200,
                          },
                          {
                            field: "specifications",
                            headerName: "Specs",
                            width: 200,
                          },
                          {
                            field: "unitPrice",
                            headerName: "Price",
                            type: "number",
                            width: 90,
                            align: "right",
                          },
                          {
                            field: "currency",
                            headerName: "Currency",
                            width: 90,
                          },
                          {
                            field: "leadTime",
                            headerName: "Lead Time",
                            type: "number",
                            width: 110,
                            align: "right",
                          },
                          {
                            field: "quantity",
                            headerName: "Qty",
                            type: "number",
                            width: 90,
                            align: "right",
                          },
                        ]}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        checkboxSelection
                        disableSelectionOnClick
                        getRowId={(row) => row.productId}
                      />
                    </div>
                  </TabPanel>
                  <TabPanel value={tabValue[supplier.id] || 0} index={3}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">Form</Typography>
                      <Tooltip title="Upload CSV">
                        <IconButton
                          aria-label="upload csv"
                          component="label"
                          sx={{
                            color: "#6b6be2",
                            "&:hover": {
                              color: "#5a5ad1", // A slightly darker shade for hover effect
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
                        rows={supplier.catalogData}
                        columns={[
                          { field: "catalogId", headerName: "ID", width: 70 },
                          {
                            field: "category",
                            headerName: "Category",
                            width: 130,
                          },
                          {
                            field: "subcategory",
                            headerName: "Subcategory",
                            width: 130,
                          },
                          {
                            field: "productName",
                            headerName: "Product",
                            width: 130,
                          },
                          {
                            field: "productId",
                            headerName: "Product ID",
                            width: 130,
                          },
                          {
                            field: "description",
                            headerName: "Description",
                            width: 200,
                          },
                          {
                            field: "specifications",
                            headerName: "Specs",
                            width: 200,
                          },
                          {
                            field: "unitPrice",
                            headerName: "Price",
                            type: "number",
                            width: 90,
                            align: "right",
                          },
                          {
                            field: "currency",
                            headerName: "Currency",
                            width: 90,
                          },
                          {
                            field: "leadTime",
                            headerName: "Lead Time",
                            type: "number",
                            width: 110,
                            align: "right",
                          },
                          {
                            field: "quantity",
                            headerName: "Qty",
                            type: "number",
                            width: 90,
                            align: "right",
                          },
                        ]}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        checkboxSelection
                        disableSelectionOnClick
                        getRowId={(row) => row.productId}
                      />
                    </div>
                    <Typography>
                      Access and fill out necessary forms for {supplier.name}
                    </Typography>
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
