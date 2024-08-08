import { useEffect, useState } from 'react';
import axios from 'axios';
import { MASTER_DATA } from 'store/constant';

const usesupplierMasterData = () => {
  const [supplierMasterData, setsupplierMasterData] = useState([]);

  useEffect(() => {
    const fetchsupplierMasterData = async () => {
      try {
        const response = await axios.get(`${MASTER_DATA}/supplierMasterData/getAllSuppliers`);
        setsupplierMasterData(response.data);
      } catch (error) {
        console.error('Error fetching cost center data: ', error);
      }
    };

    fetchsupplierMasterData();
  }, []);

  return { supplierMasterData };
};

export default usesupplierMasterData;
