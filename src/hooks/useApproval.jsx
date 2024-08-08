import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MASTER_DATA } from "../store/constant";

const useApproval = (categoryCardId) => {
  const [approvals, setApprovals] = useState({
    buyer_approval: [],
    supervisor_approval: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${MASTER_DATA}/approval/getAllApprovals/${categoryCardId}`
      );
      setApprovals(response.data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch approvals: ${err.message}`);
      console.error("Error fetching approvals:", err);
    } finally {
      setLoading(false);
    }
  }, [categoryCardId]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const createApproval = async (approvalData) => {
    try {
      const response = await axios.post(
        `${MASTER_DATA}/approval/createApproval/${categoryCardId}`,
        approvalData
      );
      await fetchApprovals(); 
      return response.data;
    } catch (err) {
      setError("Failed to create approval");
      console.error("Error creating approval:", err);
      throw err;
    }
  };

  const updateApproval = async (approvalData) => {
    try {
      const response = await axios.patch(
        `${MASTER_DATA}/approval/updateApproval/${categoryCardId}`,
        approvalData
      );
      await fetchApprovals(); // Refresh the approvals list
      return response.data;
    } catch (err) {
      setError("Failed to update approval");
      console.error("Error updating approval:", err);
      throw err;
    }
  };

  const deleteApproval = async (approvalType, approvalId) => {
    try {
      await axios.delete(
        `${MASTER_DATA}/approval/deleteApproval/${categoryCardId}`,
        {
          data: { type: approvalType, approval_id: approvalId },
        }
      );
      await fetchApprovals(); // Refresh the approvals list
    } catch (err) {
      setError("Failed to delete approval");
      console.error("Error deleting approval:", err);
      throw err;
    }
  };

  const toggleApprovalActivation = async (
    approvalId,
    approvalType,
    activationStatus
  ) => {
    try {
      await axios.patch(
        `${MASTER_DATA}/approval/toggleApprovalActivation/${categoryCardId}`,
        {
          approval_id: approvalId,
          approval_type: approvalType,
          activation_status: activationStatus,
        }
      );
      await fetchApprovals(); // Refresh the approvals list
    } catch (err) {
      setError("Failed to toggle approval activation");
      console.error("Error toggling approval activation:", err);
      throw err;
    }
  };

  return {
    approvals,
    loading,
    error,
    fetchApprovals,
    createApproval,
    updateApproval,
    deleteApproval,
    toggleApprovalActivation,
  };
};

export default useApproval;
