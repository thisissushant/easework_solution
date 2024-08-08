import { useState, useCallback } from "react";
import axios from "axios";
import { MASTER_DATA } from "../store/constant";

const useCostSavingOpportunity = (categoryCardId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [opportunities, setOpportunities] = useState([]);

  const getOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${MASTER_DATA}/costSavingOpportinity/getCostSavingOpportunities/${categoryCardId}`
      );
      setOpportunities(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error(
        "Error fetching opportunities:",
        err.response?.data || err.message
      );
      setError(
        "Error fetching opportunities: " +
          (err.response?.data?.message || err.message)
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, [categoryCardId]);

  const createOpportunity = useCallback(
    async (opportunityData) => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${MASTER_DATA}/costSavingOpportinity/createCostSavingOpportunity/${categoryCardId}`,
          opportunityData
        );
        setOpportunities((prevOpportunities) => [
          ...prevOpportunities,
          response.data,
        ]);
        setError(null);
        return response.data;
      } catch (err) {
        console.error(
          "Error creating opportunity:",
          err.response?.data || err.message
        );
        setError(
          "Error creating opportunity: " +
            (err.response?.data?.message || err.message)
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categoryCardId]
  );

  const updateOpportunity = useCallback(
    async (opportunityId, updateData) => {
      try {
        setLoading(true);
        const response = await axios.patch(
          `${MASTER_DATA}/costSavingOpportinity/updateCostSavingOpportunity/${categoryCardId}`,
          updateData,
          { params: { opportunity_id: opportunityId } }
        );
        setOpportunities((prevOpportunities) =>
          prevOpportunities.map((o) =>
            o.opportunity_id === opportunityId ? response.data : o
          )
        );
        setError(null);
        return response.data;
      } catch (err) {
        console.error(
          "Error updating opportunity:",
          err.response?.data || err.message
        );
        setError(
          "Error updating opportunity: " +
            (err.response?.data?.message || err.message)
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categoryCardId]
  );

  const deleteOpportunity = useCallback(
    async (opportunityId) => {
      try {
        setLoading(true);
        await axios.delete(
          `${MASTER_DATA}/costSavingOpportinity/deleteCostSavingOpportunity/${categoryCardId}`,
          { params: { opportunity_id: opportunityId } }
        );
        setOpportunities((prevOpportunities) =>
          prevOpportunities.filter((o) => o.opportunity_id !== opportunityId)
        );
        setError(null);
      } catch (err) {
        console.error(
          "Error deleting opportunity:",
          err.response?.data || err.message
        );
        setError(
          "Error deleting opportunity: " +
            (err.response?.data?.message || err.message)
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categoryCardId]
  );

  const createTask = useCallback(
    async (opportunityId, taskData) => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${MASTER_DATA}/costSavingOpportinity/createTask/${categoryCardId}`,
          taskData,
          { params: { opportunity_id: opportunityId } }
        );
        setError(null);
        return response.data;
      } catch (err) {
        console.error(
          "Error creating task:",
          err.response?.data || err.message
        );
        setError(
          "Error creating task: " + (err.response?.data?.message || err.message)
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categoryCardId]
  );

  const getAllTasks = useCallback(
    async (opportunityId) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${MASTER_DATA}/costSavingOpportinity/getAllTasks/${categoryCardId}/${opportunityId}`
        );
        setError(null);
        return response.data;
      } catch (err) {
        console.error(
          "Error fetching tasks:",
          err.response?.data || err.message
        );
        setError(
          "Error fetching tasks: " +
            (err.response?.data?.message || err.message)
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categoryCardId]
  );

  const deleteTask = useCallback(
    async (opportunityId, taskNumber) => {
      try {
        setLoading(true);
        await axios.delete(
          `${MASTER_DATA}/costSavingOpportinity/deleteTask/${categoryCardId}/${opportunityId}/${taskNumber}`
        );
        setError(null);
      } catch (err) {
        console.error(
          "Error deleting task:",
          err.response?.data || err.message
        );
        setError(
          "Error deleting task: " + (err.response?.data?.message || err.message)
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categoryCardId]
  );

  const updateTask = useCallback(
    async (opportunityId, taskNumber, updateData) => {
      try {
        setLoading(true);
        const response = await axios.put(
          `${MASTER_DATA}/costSavingOpportinity/updateTask/${categoryCardId}/${opportunityId}/${taskNumber}`,
          updateData
        );
        setError(null);
        return response.data;
      } catch (err) {
        console.error(
          "Error updating task:",
          err.response?.data || err.message
        );
        setError(
          "Error updating task: " + (err.response?.data?.message || err.message)
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categoryCardId]
  );

  return {
    loading,
    error,
    opportunities,
    getOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    createTask,
    getAllTasks,
    deleteTask,
    updateTask,
  };
};

export default useCostSavingOpportunity;
