import { useEffect, useState } from 'react';
import axios from 'axios';
import { MASTER_DATA } from 'store/constant';

const useCostCenter = () => {
  const [costCenter, setCostCenter] = useState([]);

  useEffect(() => {
    const fetchCostCenter = async () => {
      try {
        const response = await axios.get(`${MASTER_DATA}/costCenter/getALLCostCenters`);
        setCostCenter(response.data);
      } catch (error) {
        console.error('Error fetching cost center data: ', error);
      }
    };

    fetchCostCenter();
  }, []);

  return { costCenter };
};

export default useCostCenter;
