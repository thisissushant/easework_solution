import React, { useEffect, useState } from "react";
import axios from "axios";

import { MASTER_DATA } from "store/constant";

const useCategoryCard = () => {
  const [categoryCard, setCategoryCard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryCard = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${MASTER_DATA}/categoryCard/getAllCategoryCards`);
        setCategoryCard(response.data);
      } catch (error) {
        console.log("Error fetching category card data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategoryCard();
  }, []);

  return { categoryCard, isLoading };
};

export default useCategoryCard;