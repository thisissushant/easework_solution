import { useState, useCallback } from "react";
import axios from "axios";
import { MASTER_DATA } from "../store/constant";

const useProcessAndDocument = (categoryCardId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getQuestionnaires = useCallback(async () => {
    try {
      setLoading(true);
  
      const response = await axios.get(
        `${MASTER_DATA}/processAndDocuments/get-questionnaires/${categoryCardId}`
      );
      
      setError(null);
      // Ensure we always return an array
      return response?.data;
    } catch (err) {
      console.error(
        "Error fetching questionnaires:",
        err.response?.data || err.message
      );
      setError(
        "Error fetching questionnaires: " +
          (err.response?.data?.message || err.message)
      );
      return []; // Return an empty array in case of error
    } finally {
      setLoading(false);
    }
  }, [categoryCardId]);

  const addQuestionnaire = useCallback(
    async (questionnaireData) => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${MASTER_DATA}/processAndDocuments/add-questionnaire/${categoryCardId}`,
          questionnaireData
        );
        setError(null);
        return response.data;
      } catch (err) {
        console.error(
          "Error adding questionnaire:",
          err.response?.data || err.message
        );
        setError(
          "Error adding questionnaire: " +
            (err.response?.data?.message || err.message)
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categoryCardId]
  );

  const updateQuestionnaire = useCallback(
    async (questionnaireData) => {
      try {
        setLoading(true);
        
        const response = await axios.put(
          `${MASTER_DATA}/processAndDocuments/update-questionnaire/${categoryCardId}`,
          questionnaireData
        );
        
        setError(null);
        return response.data;
      } catch (err) {
        console.error(
          "Error updating questionnaire:",
          err.response?.data || err.message
        );
        setError(
          "Error updating questionnaire: " +
            (err.response?.data?.message || err.message)
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categoryCardId]
  );

  const deleteQuestionnaire = useCallback(
    async (category, text) => {
      try {
        setLoading(true);
        await axios.delete(
          `${MASTER_DATA}/processAndDocuments/delete-questionnaire/${categoryCardId}/${category}/${encodeURIComponent(text)}`
        );
        setError(null);
      } catch (err) {
        console.error(
          "Error deleting questionnaire:",
          err.response?.data || err.message
        );
        setError(
          "Error deleting questionnaire: " +
            (err.response?.data?.message || err.message)
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categoryCardId]
  );

  const toggleQuestionnaireActivation = useCallback(
    async (questionnaireData) => {
      try {
        setLoading(true);
        
        const response = await axios.patch(
          `${MASTER_DATA}/processAndDocuments/activate-questionnaire/${categoryCardId}`,
          questionnaireData
        );
        
        setError(null);
        return response.data;
      } catch (err) {
        console.error(
          "Error toggling questionnaire activation:",
          err.response?.data || err.message
        );
        setError(
          "Error toggling questionnaire activation: " +
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
    getQuestionnaires,
    addQuestionnaire,
    updateQuestionnaire,
    deleteQuestionnaire,
    toggleQuestionnaireActivation,
  };
};

export default useProcessAndDocument;
