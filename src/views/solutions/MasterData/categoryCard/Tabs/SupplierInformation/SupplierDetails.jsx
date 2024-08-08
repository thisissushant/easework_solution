import React from "react";
import { Box, Typography, Grid, TextField } from "@mui/material";

const SupplierDetails = ({ supplier }) => {
  return (
    <Box
      sx={
        {
          /* ... */
        }
      }
    >
      <Typography
        variant="h5"
        sx={
          {
            /* ... */
          }
        }
      >
        Supplier Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ color: "#6b6be2", mb: 1 }}>
              Avg Cost
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={supplier.avgCost}
              InputProps={{
                readOnly: true,
                style: {
                  height: "40px",
                  backgroundColor: "white",
                },
              }}
              sx={{
                backgroundColor: "white !important",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white !important",
                  "& input": {
                    backgroundColor: "white !important",
                  },
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderWidth: "1px",
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ color: "#6b6be2", mb: 1 }}>
              Avg Cost Per Hour
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={supplier.avgCostPerHour}
              InputProps={{
                readOnly: true,
                style: {
                  height: "40px",
                  backgroundColor: "white",
                },
              }}
              sx={{
                backgroundColor: "white !important",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white !important",
                  "& input": {
                    backgroundColor: "white !important",
                  },
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderWidth: "1px",
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ color: "#6b6be2", mb: 1 }}>
              Fixed Cost Engagement
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={supplier.fixedCostEngagement}
              InputProps={{
                readOnly: true,
                style: {
                  height: "40px",
                  backgroundColor: "white",
                },
              }}
              sx={{
                backgroundColor: "white !important",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white !important",
                  "& input": {
                    backgroundColor: "white !important",
                  },
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderWidth: "1px",
                  },
                },
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ color: "#6b6be2", mb: 1 }}>
              Reference Catalog
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={supplier.referenceCatalog}
              InputProps={{
                readOnly: true,
                style: {
                  height: "40px",
                  backgroundColor: "white",
                },
              }}
              sx={{
                backgroundColor: "white !important",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white !important",
                  "& input": {
                    backgroundColor: "white !important",
                  },
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderWidth: "1px",
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ color: "#6b6be2", mb: 1 }}>
              Reference Contract
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={supplier.referenceContract}
              InputProps={{
                readOnly: true,
                style: {
                  height: "40px",
                  backgroundColor: "white",
                },
              }}
              sx={{
                backgroundColor: "white !important",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white !important",
                  "& input": {
                    backgroundColor: "white !important",
                  },
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderWidth: "1px",
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ color: "#6b6be2", mb: 1 }}>
              Form ID
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={supplier.formId}
              InputProps={{
                readOnly: true,
                style: {
                  height: "40px",
                  backgroundColor: "white",
                },
              }}
              sx={{
                backgroundColor: "white !important",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white !important",
                  "& input": {
                    backgroundColor: "white !important",
                  },
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderWidth: "1px",
                  },
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupplierDetails;
