import React, { useEffect, useState } from "react";
import axios from "axios";
 
import { MASTER_DATA } from "store/constant";
 
const useContract = () => {
  const [contracts, setContracts] = useState([]);
 
  useEffect(() => {
    const fetchGlAccountId = async () => {
      try {
        const response = await axios.get(`${MASTER_DATA}/contracts/getAllContracts`);
        setContracts(response.data);
      } catch (error) {
        console.log("Error fetching cost center data:", error);
      }
    };
    fetchGlAccountId();
  }, []);
  return { contracts };
};
 
export default useContract;