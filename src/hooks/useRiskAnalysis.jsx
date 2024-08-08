import { useState, useCallback } from "react";
import axios from "axios";
import { MASTER_DATA } from "../store/constant";

const useRiskAnalysis = (categoryCardId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const createRisk = useCallback(async (riskData) => {
    try {
      setLoading(true);
      console.log("Creating risk:", riskData);
      const response = await axios.post(
        `${MASTER_DATA}/riskAnalysis/createRisk/${categoryCardId}`,
        riskData
      );
      console.log("Risk created:", response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error creating risk:", err.response?.data || err.message);
      setError(
        "Error creating risk: " + (err.response?.data?.message || err.message)
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllRisks = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching all risks");
      const response = await axios.get(
        `${MASTER_DATA}/riskAnalysis/getAllRisks/${categoryCardId}`
      );
      console.log("Risks fetched:", response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error fetching risks:", err.response?.data || err.message);
      setError(
        "Error fetching risks: " + (err.response?.data?.message || err.message)
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRisk = useCallback(async (riskId) => {
    try {
      setLoading(true);
      console.log("Deleting risk:", riskId);
      await axios.delete(
        `${MASTER_DATA}/riskAnalysis/deleteRisk/${categoryCardId}`,
        {
          params: { risk_id: riskId },
        }
      );
      console.log("Risk deleted:", riskId);
      setError(null);
    } catch (err) {
      console.error("Error deleting risk:", err.response?.data || err.message);
      setError(
        "Error deleting risk: " + (err.response?.data?.message || err.message)
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (riskId, taskData) => {
    try {
      setLoading(true);
      console.log("Creating task:", taskData);
      const response = await axios.post(
        `${MASTER_DATA}/riskAnalysis/createTask/${categoryCardId}`,
        taskData,
        {
          params: { risk_id: riskId },
        }
      );
      console.log("Task created:", response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error creating task:", err.response?.data || err.message);
      setError(
        "Error creating task: " + (err.response?.data?.message || err.message)
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (riskId, taskNumber) => {
    try {
      setLoading(true);
      console.log("Deleting task:", taskNumber, "for risk:", riskId);
      await axios.delete(
        `${MASTER_DATA}/riskAnalysis/deleteTask/${categoryCardId}/${riskId}/${taskNumber}`
      );
      console.log("Task deleted:", taskNumber);
      setError(null);
    } catch (err) {
      console.error("Error deleting task:", err.response?.data || err.message);
      setError(
        "Error deleting task: " + (err.response?.data?.message || err.message)
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllTasks = useCallback(async (riskId) => {
    try {
      setLoading(true);
      console.log("Fetching all tasks for risk:", riskId);
      const response = await axios.get(
        `${MASTER_DATA}/riskAnalysis/getAllTasks/${categoryCardId}/${riskId}`
      );
      console.log("Tasks fetched:", response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error fetching tasks:", err.response?.data || err.message);
      setError(
        "Error fetching tasks: " + (err.response?.data?.message || err.message)
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createRisk,
    getAllRisks,
    deleteRisk,
    createTask,
    getAllTasks,
    deleteTask,
  };
};

export default useRiskAnalysis;
