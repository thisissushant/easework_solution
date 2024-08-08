import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import useSupplierInfo from "../../../../../../hooks/useSupplierInformation";

const AddNewSupplier = ({
  open,
  handleClose,
  onSupplierCreated,
  categoryCardId, // Use categoryCardId instead of supplierId
}) => {
  const initialSupplierState = {
    supplier_name: "",
    supplier_id: "",
    country: "",
    city: "",
    zipcode: "",
    contact_number: "",
    email: "",
    financial_score: "",
    sustainability_score: "",
    minority_supplier: false,
    on_time_delivery_score: "",
    quality_score: "",
    overall_rating: "",
    review: "",
    recommendation_reason: "",
  };

  const [newSupplier, setNewSupplier] = useState(initialSupplierState);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const { searchSuppliers, createSupplier, loading, error } =
    useSupplierInfo(categoryCardId); // Use categoryCardId

  const handleSearch = useCallback(
    async (term) => {
      console.log("Searching for term:", term);
      if (!term) {
        console.log("Empty search term, clearing results");
        setSearchResults([]);
        return;
      }

      setSearching(true);
      try {
        console.log("Calling searchSuppliers with term:", term);
        const results = await searchSuppliers(term);
        console.log("Search results:", results);
        setSearchResults(results);
      } catch (error) {
        console.error("Error during supplier search:", error);
      } finally {
        setSearching(false);
      }
    },
    [searchSuppliers]
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSupplier((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSupplierSelect = (event, value) => {
    console.log("Selected supplier:", value);
    if (value) {
      setNewSupplier({
        ...initialSupplierState,
        ...Object.fromEntries(
          Object.entries(value).map(([key, val]) => [key, val || "NA"])
        ),
        zipcode: value.zip_code || "NA",
        minority_supplier: value.minority_supplier || false,
      });
    } else {
      setNewSupplier(initialSupplierState);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!categoryCardId) {
        // Check for categoryCardId
        console.error("Error: categoryCardId is not provided");
        // Handle the error appropriately (e.g., show an error message to the user)
        return;
      }
      const supplierData = {
        ...newSupplier,
        zipcode:
          newSupplier.zipcode === "NA" ? 0 : parseInt(newSupplier.zipcode) || 0,
        on_time_delivery_score:
          newSupplier.on_time_delivery_score === "NA"
            ? 0
            : parseFloat(newSupplier.on_time_delivery_score) || 0,
        financial_score:
          newSupplier.financial_score === "NA"
            ? 0
            : parseFloat(newSupplier.financial_score) || 0,
        quality_score:
          newSupplier.quality_score === "NA"
            ? 0
            : parseFloat(newSupplier.quality_score) || 0,
        sustainability_score:
          newSupplier.sustainability_score === "NA"
            ? 0
            : parseFloat(newSupplier.sustainability_score) || 0,
      };
      const createdSupplier = await createSupplier(supplierData);
      onSupplierCreated(createdSupplier);
      handleClose();
    } catch (error) {
      console.error("Error creating supplier:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  const handleDialogClose = () => {
    setNewSupplier(initialSupplierState);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth>
      <DialogTitle>Assign Supplier</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={searchResults}
          getOptionLabel={(option) =>
            `${option.supplier_name || "Unknown"} (${option.supplier_id || "No ID"})`
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search and Select Supplier"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {searching ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          onChange={handleSupplierSelect}
          onInputChange={(event, newInputValue) => {
            setSearchTerm(newInputValue);
            handleSearch(newInputValue);
          }}
          loading={searching}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="supplier_id"
          label="Supplier ID"
          type="text"
          fullWidth
          variant="standard"
          value={newSupplier.supplier_id}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="supplier_name"
          label="Supplier Name"
          type="text"
          fullWidth
          variant="standard"
          value={newSupplier.supplier_name}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="country"
          label="Country"
          type="text"
          fullWidth
          variant="standard"
          value={newSupplier.country}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="city"
          label="City"
          type="text"
          fullWidth
          variant="standard"
          value={newSupplier.city}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="zipcode"
          label="Zip Code"
          type="text"
          fullWidth
          variant="standard"
          value={newSupplier.zipcode}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="contact_number"
          label="Contact Number"
          type="text"
          fullWidth
          variant="standard"
          value={newSupplier.contact_number}
          onChange={handleInputChange}
        />
        
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          variant="standard"
          value={newSupplier.email}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="on_time_delivery_score"
          label="On-Time Delivery Score"
          type="text"
          fullWidth
          variant="standard"
          value={newSupplier.on_time_delivery_score}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="financial_score"
          label="Financial Score"
          type="text"
          fullWidth
          variant="standard"
          value={newSupplier.financial_score}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="quality_score"
          label="Quality Score"
          type="text"
          fullWidth
          variant="standard"
          value={newSupplier.quality_score}
          onChange={handleInputChange}
        />
        
        <TextField
          margin="dense"
          name="Minority Supplier"
          label="Minority Supplier"
          type="text"
          fullWidth
          variant="standard"
          value={newSupplier.minority_supplier}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Assigning..." : "Assign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewSupplier;
