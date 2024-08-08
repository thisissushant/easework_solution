import React, { useEffect, useState } from "react";
import axios from "axios";
 
import { MASTER_DATA } from "store/constant";
 
const useGlAccount = () => {
  const [glAccountId, setGlAccountId] = useState([]);
 
  useEffect(() => {
    const fetchGlAccountId = async () => {
      try {
        const response = await axios.get(`${MASTER_DATA}/glAccount/getAllGlAccounts`);
        setGlAccountId(response.data);
      } catch (error) {
        console.log("Error fetching cost center data:", error);
      }
    };
    fetchGlAccountId();
  }, []);
  return { glAccountId };
};
 
export default useGlAccount;