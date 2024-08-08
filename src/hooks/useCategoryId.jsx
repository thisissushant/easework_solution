import React, { useEffect, useState } from "react";
import axios from "axios";
 
import { MASTER_DATA } from "store/constant";
 
const useCategoryID = () => {
  const [categoryId, setCategoryId] = useState([]);
 
  useEffect(() => {
    const fetchCategoryId = async () => {
      try {
        const response = await axios.get(`${MASTER_DATA}/categoryId/allCategoryIds`);
        setCategoryId(response.data);
      } catch (error) {
        console.log("Error fetching cost center data:", error);
      }
    };
    fetchCategoryId();
  }, []);
  return { categoryId };
};
 
export default useCategoryID;