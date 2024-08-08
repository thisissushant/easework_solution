import React, { useState, useEffect } from "react";
import {
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Tooltip,
  CircularProgress
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import useSupplierInfo from "../../../../../../hooks/useSupplierInformation";
import PreferredSuppliers from "./PreferredSuppliers";
import PreviousPurchase from "./PreviousPurchase";
import AddNewSupplier from "./AddNewSupplier";

const SupplierInformation = ({ categoryCardId, supplierId, categoryName }) => {


  const { supplierData, loading, error, createSupplier, refetchSupplierData } =
    useSupplierInfo(categoryCardId);

  const [preferredSuppliers, setPreferredSuppliers] = useState([]);
  const [previousPurchases, setPreviousPurchases] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const parseScore = (score) => {
    const numericScore = parseFloat(score);
    return !isNaN(numericScore) ? numericScore : score;
  };


  useEffect(() => {
    if (supplierData) {

      if (supplierData.preferred_suppliers) {
        setPreferredSuppliers(
          supplierData.preferred_suppliers.map((supplier) => ({
            name: supplier.supplier_name,
            id: supplier.supplier_id,
            onTimeDeliveryScore: parseScore(supplier.on_time_delivery_score),
            financialScore: parseScore(supplier.financial_score),
            qualityScore: parseScore(supplier.quality_score),
            sustainabilityScore: parseScore(supplier.sustainability_score),
            minorityStatus: supplier.minority_supplier,
            avgCost: supplier.avg_cost,
            referenceCatalog: supplier.reference_catalog,
            referenceContract: supplier.reference_contract,
            avgCostPerHour: supplier.avg_cost_per_hr,
            fixedCostEngagement: supplier.fixed_cost_engagement,
            formId: supplier.form_id,
            formDescription: supplier.form_description,
            country: supplier.country,
            city: supplier.city,
            zipcode: supplier.zipcode,
            recommendation_reason: supplier.recommendation_reason,
            averageProjectSuccessRate: parseScore(
              supplier.average_project_success_rate
            ),
            overallRating: parseScore(supplier.overall_rating),
            ratingReason: supplier.rating_reason,
          }))
        );
      }

      if (supplierData.approved_suppliers) {
        setPreviousPurchases(
          supplierData.approved_suppliers.map((purchase) => {
            const parseScore = (score) => {
              const numericScore = parseFloat(score);
              return !isNaN(numericScore) ? numericScore : score;
            };

            return {
              name: purchase.supplier_name,
              id: purchase.supplier_id,
              onTimeDeliveryScore: parseScore(purchase.on_time_delivery_score),
              financialScore: parseScore(purchase.financial_score),
              qualityScore: parseScore(purchase.quality_score),
              avgCost: purchase.avg_cost,
              referenceCatalog: purchase.catalog_id,
              referenceContract: purchase.contract_id,
              avgCostPerHour: purchase.avg_cost_per_hr,
              fixedCostEngagement: purchase.fixed_cost_engagement,
              formId: purchase.form_id,
              formDescription: purchase.form_description,
              country: purchase.country,
              city: purchase.city,
              zipcode: purchase.zipcode,
              poNumber: purchase.po_number,
              averageProjectSuccessRate: parseScore(
                purchase.average_project_success_rate
              ),
              overallRating: parseScore(purchase.overall_rating),
              ratingReason: purchase.rating_reason,
              email: purchase.email,
              sustainabilityScore: purchase.sustainability_score,
              minoritySupplier: purchase.minority_supplier,
            };
          })
        );
      }
    }
  }, [supplierData]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSupplierCreated = async (createdSupplier) => {
    const newSupplier = {
      name: createdSupplier.supplier_name,
      id: createdSupplier.supplier_id,
      country: createdSupplier.country,
      city: createdSupplier.city,
      zipcode: createdSupplier.zip_code,
      catalogId: createdSupplier.catalog_id,
      contactNumber: createdSupplier.contact_number,
      email: createdSupplier.email,
      sustainabilityScore: parseScore(createdSupplier.sustainability_score),
      financialScore: parseScore(createdSupplier.financial_score),
      minorityStatus: formatMinorityStatus(createdSupplier.minority_supplier),
      qualityScore: parseScore(createdSupplier.quality_score),
      onTimeDeliveryScore: parseScore(createdSupplier.on_time_delivery_score),
      overallRating: parseScore(createdSupplier.overall_rating),
      avgCost: createdSupplier.avg_cost,
      referenceCatalog: createdSupplier.reference_catalog,
      referenceContract: createdSupplier.reference_contract,
      avgCostPerHour: createdSupplier.avg_cost_per_hr,
      fixedCostEngagement: createdSupplier.fixed_cost_engagement,
      formId: createdSupplier.form_id,
      formDescription: createdSupplier.form_description,
      averageProjectSuccessRate: parseScore(
        createdSupplier.average_project_success_rate
      ),
      ratingReason: createdSupplier.rating_reason,
      isNew: true,
    };

    setPreferredSuppliers((prev) => [...(prev || []), newSupplier]);
    await refetchSupplierData();
  };

  if (loading) return <Box sx={{ textAlign: "center" }}>
    <CircularProgress sx={{ color: "#9747FF", mt: 20 }} />
  </Box>;
  if (error) return <div>Error: {error}</div>;

  return (

    <Container maxWidth="2xl" sx={{ mt: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
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
          <StorefrontIcon sx={{ mr: 1, color: "#6b6be2" }} />
          Preferred Suppliers
        </Typography>
        <Tooltip title="Assign Supplier">
          <IconButton
            onClick={handleOpenDialog}
            sx={{ color: "#6b6be2", "&:hover": { color: "#5a5ad1" } }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <PreferredSuppliers suppliers={preferredSuppliers} categoryName={categoryName} />
      <Typography
        variant="h4"
        sx={{
          color: "#2c3e50",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          mt: 4
        }}
      >
        <ShoppingCartIcon sx={{ color: "#6b6be2" }} />
        Approved Suppliers
      </Typography>
      <PreviousPurchase previousPurchases={previousPurchases} categoryName={categoryName} />
      <AddNewSupplier
        open={openDialog}
        handleClose={handleCloseDialog}
        onSupplierCreated={handleSupplierCreated}
        supplierId={supplierId}
        categoryCardId={categoryCardId}
      />
    </Container>

  );
};

export default SupplierInformation;
