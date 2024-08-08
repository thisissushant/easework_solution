import React, { useState, useEffect } from "react";
import {
  List,
  Paper,
  ListItem,
  ListItemText,
  Collapse,
  Box,
  Container,
  Avatar,
  Typography,
  Tooltip,
  Chip,
  Divider,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RecommendedBadge from "./RecommendedBadge";
import SupplierTabs from "./SupplierTabs";

const PreferredSuppliers = ({ suppliers: initialSuppliers, categoryName }) => {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [expandedSupplier, setExpandedSupplier] = useState({});
  const [tabValue, setTabValue] = useState({});
  const [searchTerm, setSearchTerm] = useState({});

  useEffect(() => {
    setSuppliers(initialSuppliers);
  }, [initialSuppliers]);

  const handleExpandSupplierClick = (supplierId) => {
    setExpandedSupplier((prev) => ({
      ...prev,
      [supplierId]: !prev[supplierId],
    }));
  };

  const handleTabChange = (supplierId, newValue) => {
    setTabValue((prev) => ({ ...prev, [supplierId]: newValue }));
  };

  if (!suppliers || suppliers.length === 0) {
    return (
      <Typography variant="body1">
        No preferred suppliers available at the moment.
      </Typography>
    );
  }
  const formatValue = (value) => {
    return value === null || value === undefined || value === ""
      ? "N/A"
      : value;
  };

  const sortedSuppliers = [...suppliers].sort((a, b) => b.overallRating - a.overallRating);

  return (
    <div>
      <Container maxWidth="full" sx={{ mt: 1 }}>
        <List>
          {sortedSuppliers.map((supplier) => (
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
                  {supplier.name ? supplier.name.charAt(0).toUpperCase() : "?"}
                </Avatar>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: "#2c3e50" }}
                      >
                        {supplier.name}
                      </Typography>

                      {console.log(supplier)}
                      {supplier?.recommendation_reason && (
                        <Tooltip title={formatValue(supplier?.recommendation_reason)} arrow placement="top">
                          <span>
                            <RecommendedBadge />
                          </span>
                        </Tooltip>
                      )}
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body1"
                        color="text.primary"
                        sx={{ fontWeight: "medium", mb: 1 }}
                      >
                        Supplier ID: {formatValue(supplier.id)}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 1.5,
                          borderRadius: 2,
                        }}
                      >
                        <LocationOnIcon
                          sx={{
                            color: "#6b6be2",
                            mr: 1.5,
                            fontSize: "1.2rem",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#333",
                          }}
                        >
                          {formatValue(supplier.city)},{" "}
                          {formatValue(supplier.country)} -{" "}
                          {formatValue(supplier.zipcode)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap", mt: 0 }}>
                        <Chip
                          label={`Overall Rating: ${formatValue(supplier.overallRating)}`}
                          variant="outlined"
                          sx={{
                            borderColor: "#6b6be2",
                          }}
                        />
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
                  <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2, mb: 2 }}>
                    <Chip
                      label={`On-time Delivery: ${formatValue(supplier.onTimeDeliveryScore)}`}
                      variant="outlined"
                      sx={{ m: 0.5, borderColor: "#6b6be2", color: "#6b6be2" }}
                    />
                    <Chip
                      label={`Financial: ${formatValue(supplier.financialScore)}`}
                      variant="outlined"
                      sx={{ m: 0.5, borderColor: "#6b6be2", color: "#6b6be2" }}
                    />
                    <Chip
                      label={`Quality: ${formatValue(supplier.qualityScore)}`}
                      variant="outlined"
                      sx={{ m: 0.5, borderColor: "#6b6be2", color: "#6b6be2" }}
                    />
                    <Chip
                      label={`Sustainability: ${formatValue(supplier.sustainabilityScore)}`}
                      variant="outlined"
                      sx={{ m: 0.5, borderColor: "#6b6be2", color: "#6b6be2" }}
                    />
                    <Chip
                      label={`Minority: ${formatValue(supplier.minorityStatus)}`}
                      variant="outlined"
                      sx={{ m: 0.5, borderColor: "#6b6be2", color: "#6b6be2" }}
                    />
                  </Box>
                  <Box>
                    <Divider />
                  </Box>

                  <SupplierTabs
                    supplier={supplier}
                    categoryName={categoryName}
                    tabValue={tabValue[supplier.id] || 0}
                    handleTabChange={(newValue) =>
                      handleTabChange(supplier.id, newValue)
                    }
                    searchTerm={searchTerm[supplier.id]}
                    setSearchTerm={(value) =>
                      setSearchTerm((prev) => ({
                        ...prev,
                        [supplier.id]: value,
                      }))
                    }


                  />
                </Box>
              </Collapse>
            </Paper>
          ))}
        </List>
      </Container>
    </div>
  );
};

export default PreferredSuppliers;
