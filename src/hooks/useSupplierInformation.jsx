import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MASTER_DATA } from "../store/constant";

const useSupplierInfo = (categoryCardId,category_name) => {
  const [supplierData, setSupplierData] = useState(null);
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const fetchSupplierData = useCallback(async () => {
    if (!categoryCardId) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `${MASTER_DATA}/categoryCardSuppliers/getSupplierInformation/${categoryCardId}`
      );
      setSupplierData(response.data);
      setError(null);
    } catch (err) {
      setError("Error fetching supplier data");
      setSupplierData(null);
    } finally {
      setLoading(false);
    }
  }, [categoryCardId]);

  const fetchAllSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${MASTER_DATA}/supplierMasterData/getAllSuppliers`
      );
      setAllSuppliers(response.data);
      setError(null);
    } catch (err) {
      setError("Error fetching all suppliers");
      setAllSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (categoryCardId) {
      fetchSupplierData();
    } else {
      fetchAllSuppliers();
    }
  }, [categoryCardId, fetchSupplierData, fetchAllSuppliers]);

  const refetch = useCallback(() => {
    if (categoryCardId) {
      fetchSupplierData();
    } else {
      fetchAllSuppliers();
    }
  }, [categoryCardId, fetchSupplierData, fetchAllSuppliers]);

  const searchSuppliers = useCallback(async (term) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${MASTER_DATA}/supplierMasterData/getAllSuppliers?term=${term}`
      );
      return response.data;
    } catch (err) {
      console.error("Error searching suppliers:", err);
      setError("Error searching suppliers");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createSupplier = useCallback(
    async (supplierData) => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${MASTER_DATA}/categoryCardSuppliers/insertPrefferedSupplier/${categoryCardId}`,
          supplierData,
          {
            headers: {
              "Content-Type": "application/json", 
            },
          }
        );
        return response.data;
      } catch (err) {
        console.error("Error creating supplier:", err);
        setError("Error creating supplier");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categoryCardId]
  );

  return {
    supplierData,
    allSuppliers,
    loading,
    error,
    refetch,
    searchSuppliers,
    createSupplier,
  };
};

export default useSupplierInfo;
