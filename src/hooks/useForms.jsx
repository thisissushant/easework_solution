import React, { useEffect, useState } from "react";
import axios from "axios";
 
import { MASTER_DATA } from "store/constant";
 
const useForms = () => {
  const [forms, setForms] = useState([]);
 
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`${MASTER_DATA}/form`);
        setForms(response.data);
      } catch (error) {
        console.log("Error fetching cost center data:", error);
      }
    };
    fetchForms();
  }, []);
  return { forms };
};
 
export default useForms;