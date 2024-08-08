import { useState, useCallback } from "react";
import axios from "axios";
import { MASTER_DATA } from "../store/constant";

const usePolicy = (categoryCardId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [policies, setPolicies] = useState([]);

  const getAllPolicies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${MASTER_DATA}/policy/getAllPolicies/${categoryCardId}`
      );
      setPolicies(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error(
        "Error fetching policies:",
        err.response?.data || err.message
      );
      setError(
        "Error fetching policies: " +
          (err.response?.data?.message || err.message)
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, [categoryCardId]);

  const createPolicy = useCallback(
    async (policyData) => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${MASTER_DATA}/policy/createPolicy/${categoryCardId}`,
          policyData
        );
        setPolicies((prevPolicies) => [...prevPolicies, response.data]);
        setError(null);
        return response.data;
      } catch (err) {
        console.error(
          "Error creating policy:",
          err.response?.data || err.message
        );
        setError(
          "Error creating policy: " +
            (err.response?.data?.message || err.message)
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categoryCardId]
  );

  const updatePolicy = useCallback(
    async (policyData) => {
      try {
        setLoading(true);
        const response = await axios.patch(
          `${MASTER_DATA}/policy/updatePolicy/${categoryCardId}`,
          {
            policy_id: policyData.policy_id,
            policy: policyData.policy,
            policy_wordings: policyData.policy_wordings,
            outcome: policyData.outcome,
            message: policyData.message,
            activate: policyData.activate,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setPolicies((prevPolicies) =>
          prevPolicies.map((p) =>
            p.policy_id === response.data.policy_id ? response.data : p
          )
        );
        setError(null);
        return response.data;
      } catch (err) {
        console.error(
          "Error updating policy:",
          err.response?.data || err.message
        );
        setError(
          "Error updating policy: " +
            (err.response?.data?.message || err.message)
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categoryCardId]
  );

  const deletePolicy = useCallback(
    async (policyId) => {
      try {
        setLoading(true);
        await axios.delete(
          `${MASTER_DATA}/policy/deletePolicy/${categoryCardId}`,
          { params: { policy_id: policyId } }
        );
        setPolicies((prevPolicies) =>
          prevPolicies.filter((p) => p.policy_id !== policyId)
        );
        setError(null);
      } catch (err) {
        console.error(
          "Error deleting policy:",
          err.response?.data || err.message
        );
        setError(
          "Error deleting policy: " +
            (err.response?.data?.message || err.message)
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categoryCardId]
  );

  const togglePolicyActivation = useCallback(
    async (policyId, isActive) => {
      try {
        setLoading(true);
        const response = await axios.patch(
          `${MASTER_DATA}/policy/togglePolicyActivation/${categoryCardId}`,
          { policy_id: policyId, activate: isActive },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setPolicies((prevPolicies) =>
          prevPolicies.map((p) =>
            p.policy_id === policyId ? { ...p, activate: isActive } : p
          )
        );
        setError(null);
        return response.data;
      } catch (err) {
        console.error(
          "Error toggling policy activation:",
          err.response?.data || err.message
        );
        setError(
          "Error toggling policy activation: " +
            (err.response?.data?.message || err.message)
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
    policies,
    getAllPolicies,
    createPolicy,
    updatePolicy,
    deletePolicy,
    togglePolicyActivation,
  };
};

export default usePolicy;
