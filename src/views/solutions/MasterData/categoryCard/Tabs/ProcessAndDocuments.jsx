import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Menu,
  Switch,
  Snackbar,
  Alert,
  Tooltip,
  Container,
  CircularProgress
} from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import * as XLSX from "xlsx";
import useProcessAndDocument from "../../../../../hooks/useProcessAndDocument";

const iconColor = "#6b6be2";

const questionCategories = [
  "Technical",
  "Commercial",
  "Warranty",
  "About Company",
  "Certificates",
  "Financial",
  "Reference",
  "Consultant Qualification",
  "Expertise Areas",
  "Project Scope",
  "Availability",
  "Rates And Pricing"
];

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
};

const ProcessAndDocuments = ({ categoryCardId }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ category: "", text: "" });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuQuestionId, setMenuQuestionId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const {
    loading,
    error,
    getQuestionnaires,
    addQuestionnaire,
    updateQuestionnaire,
    deleteQuestionnaire,
    toggleQuestionnaireActivation,
  } = useProcessAndDocument(categoryCardId);

  useEffect(() => {
    fetchQuestionnaires();
  }, [categoryCardId]);

  const fetchQuestionnaires = async () => {
    try {
      const data = await getQuestionnaires();
      if (data && data.quick_quote_questionnaire_and_documents) {
        const formattedQuestions = data.quick_quote_questionnaire_and_documents.map((q, index) => ({
          id: index + 1,
          category: q.question_category,
          text: q.questionnaire,
          active: q.isActivate,
        }));
        setQuestions(formattedQuestions);
      } else {
        console.error("Received data is not in the expected format:", data);
        setSnackbarMessage("Failed to fetch questionnaires. Unexpected data format.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error fetching questionnaires:", error);
      setSnackbarMessage("Failed to fetch questionnaires. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleAddQuestion = async () => {
    if (newQuestion.text.trim() !== "" && newQuestion.category !== "") {
      const isDuplicate = questions.some(
        (q) => q.text.toLowerCase() === newQuestion.text.toLowerCase()
      );

      if (isDuplicate) {
        setSnackbarMessage("This question already exists.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      } else {
        try {
          const response = await addQuestionnaire({
            question_category: newQuestion.category,
            questionnaire: newQuestion.text,
            isActivate: true,
          });

          if (response) {
            await fetchQuestionnaires();
            setNewQuestion({ category: "", text: "" });
            setOpenAddDialog(false);
            setSnackbarMessage("Question added successfully.");
            setSnackbarSeverity("success");
          }
        } catch (error) {
          console.error("Error adding question:", error);
          setSnackbarMessage("Failed to add question. Please try again.");
          setSnackbarSeverity("error");
        } finally {
          setSnackbarOpen(true);
        }
      }
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion({
      ...question,
      oldCategory: question.category,
      oldText: question.text,
      newCategory: question.category,
      newText: question.text,
    });
    setOpenEditDialog(true);
    handleCloseMenu();
  };

  const handleSaveEdit = async () => {
    const isDuplicate = questions.some(
      (q) =>
        q.id !== editingQuestion.id &&
        q.text.toLowerCase() === editingQuestion.newText.toLowerCase() &&
        q.category === editingQuestion.newCategory
    );
    if (isDuplicate) {
      setSnackbarMessage("This question already exists.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await updateQuestionnaire({
        old_question_category: editingQuestion.oldCategory,
        old_questionnaire: editingQuestion.oldText,
        new_question_category: editingQuestion.newCategory,
        new_questionnaire: editingQuestion.newText,
        isActivate: editingQuestion.active,
      });

      if (response) {
        await fetchQuestionnaires();
        setOpenEditDialog(false);
        setEditingQuestion(null);
        setSnackbarMessage("Question updated successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error updating question:", error);
      setSnackbarMessage("Failed to update question. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleToggleActive = useCallback(
    async (id) => {
      const questionToToggle = questions.find((q) => q.id === id);
      const newActiveState = !questionToToggle.active;

      try {
        await toggleQuestionnaireActivation({
          question_category: questionToToggle.category,
          questionnaire: questionToToggle.text,
          isActivate: newActiveState,
        });

        await fetchQuestionnaires();

        setSnackbarMessage(
          `Question ${newActiveState ? "activated" : "deactivated"} successfully.`
        );
        setSnackbarSeverity("success");
      } catch (error) {
        console.error("Error toggling question status:", error);
        setSnackbarMessage(
          "Failed to update question status. Please try again."
        );
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
      }
    },
    [questions, toggleQuestionnaireActivation, fetchQuestionnaires]
  );

  const handleDeleteQuestion = async (id) => {
    const questionToDelete = questions.find((q) => q.id === id);
    try {
      await deleteQuestionnaire(
        questionToDelete.category,
        questionToDelete.text
      );
      await fetchQuestionnaires();
      handleCloseMenu();
      setSnackbarMessage("Question deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting question:", error);
      setSnackbarMessage("Failed to delete question. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuQuestionId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuQuestionId(null);
  };

  const handleCSVUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        for (const row of jsonData) {
          try {
            await addQuestionnaire({
              question_category: row.question_category || "",
              questionnaire: row.questionnaire || "",
              isActivate: true,
            });
          } catch (error) {
            console.error("Error adding question from CSV/Excel:", error);
          }
        }

        await fetchQuestionnaires();

        setSnackbarMessage("Questions imported successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error processing file:", error);
        setSnackbarMessage(
          "Failed to process file. Please check the format and try again."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const columns = [
    {
      field: "category",
      headerName: "Question Category",
      width: 200,
      headerClassName: "super-app-theme--header",
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: "text",
      headerName: "Questionnaire",
      flex: 1,
      headerClassName: "super-app-theme--header",
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: "active",
      headerName: "Status",
      width: 120,
      headerClassName: "super-app-theme--header",
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Switch
          checked={params.row.active}
          onChange={() => handleToggleActive(params.row.id)}
          color="primary"
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: iconColor,
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: iconColor,
            },
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      headerClassName: "super-app-theme--header",
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <IconButton onClick={(e) => handleOpenMenu(e, params.row.id)}>
          <MoreVertIcon sx={{ color: iconColor }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Container maxWidth="2xl" sx={{ mt: 0 }}>
      <Paper sx={{  mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            p: 2,
            width: '100%',
          }}
        >
          <input
            accept=".csv,.xlsx,.xls"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={handleCSVUpload}
          />
          <label htmlFor="raised-button-file">
            <Tooltip title="Upload CSV">
              <IconButton component="span" sx={{ color: iconColor, mr: 1 }}>
                <UploadFileIcon />
              </IconButton>
            </Tooltip>
          </label>

          <Tooltip title="Add New">
            <IconButton
              onClick={() => setOpenAddDialog(true)}
              sx={{ color: "#6b6be2", "&:hover": { color: "#5a5ad1" } }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={questions}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            loading={loading}
            components={{
              Toolbar: CustomToolbar,
              NoRowsOverlay: () => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  {isLoading && (
                    <CircularProgress sx={{ color: "#9747FF !important" }} />
                  )}
                </Box>
              ),
            }}
            sx={{
              "& .super-app-theme--header": {
                backgroundColor: "#ffffff",
                color: "#5e17eb",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-columnHeaders": {
                borderBottom: "2px solid #ccc",
                minHeight: "56px !important",
                maxHeight: "56px !important",
                lineHeight: "56px !important",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
                fontSize: "16px",
                padding: "0 16px",
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
                padding: "0 16px",
              },
              "& .MuiDataGrid-row.active": {
                bgcolor: "white",
              },
              "& .MuiDataGrid-row:hover": {
                bgcolor: "white",
              },
            }}
            getRowClassName={(params) => (params.row.active ? "active" : "")}
          />
        </Box>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() =>
            handleEditQuestion(questions.find((q) => q.id === menuQuestionId))
          }
        >
          <EditIcon sx={{ mr: 1, color: iconColor }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteQuestion(menuQuestionId)}>
          <DeleteIcon sx={{ mr: 1, color: iconColor }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ color: iconColor }}>Add New Question</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Question Category</InputLabel>
            <Select
             value={newQuestion.category}
             onChange={(e) =>
               setNewQuestion({ ...newQuestion, category: e.target.value })
             }
             label="Question Category"
           >
             {questionCategories.map((category) => (
               <MenuItem key={category} value={category}>
                 {category}
               </MenuItem>
             ))}
           </Select>
         </FormControl>
         <TextField
           autoFocus
           margin="dense"
           label="Question"
           type="text"
           fullWidth
           variant="outlined"
           value={newQuestion.text}
           onChange={(e) =>
             setNewQuestion({ ...newQuestion, text: e.target.value })
           }
           sx={{ mt: 2 }}
         />
       </DialogContent>
       <DialogActions sx={{ p: 2 }}>
         <Button
           onClick={() => setOpenAddDialog(false)}
           sx={{ color: "#666" }}
         >
           Cancel
         </Button>
         <Button
           onClick={handleAddQuestion}
           variant="outlined"
           sx={{ borderColor: iconColor, color: iconColor }}
         >
           Add
         </Button>
       </DialogActions>
     </Dialog>

     <Dialog
       open={openEditDialog}
       onClose={() => setOpenEditDialog(false)}
       fullWidth
       maxWidth="sm"
     >
       <DialogTitle sx={{ color: iconColor }}>Edit Question</DialogTitle>
       <DialogContent>
         <FormControl fullWidth sx={{ mt: 2 }}>
           <InputLabel>Question Category</InputLabel>
           <Select
             value={editingQuestion?.newCategory || ""}
             onChange={(e) =>
               setEditingQuestion({
                 ...editingQuestion,
                 newCategory: e.target.value,
               })
             }
             label="Question Category"
           >
             {questionCategories.map((category) => (
               <MenuItem key={category} value={category}>
                 {category}
               </MenuItem>
             ))}
           </Select>
         </FormControl>
         <TextField
           autoFocus
           margin="dense"
           label="Question"
           type="text"
           fullWidth
           variant="outlined"
           value={editingQuestion?.newText || ""}
           onChange={(e) =>
             setEditingQuestion({
               ...editingQuestion,
               newText: e.target.value,
             })
           }
           sx={{ mt: 2 }}
         />
       </DialogContent>
       <DialogActions sx={{ p: 2 }}>
         <Button
           onClick={() => setOpenEditDialog(false)}
           sx={{ color: "#666" }}
         >
           Cancel
         </Button>
         <Button
           onClick={handleSaveEdit}
           variant="outlined"
           sx={{ borderColor: iconColor, color: iconColor }}
         >
           Save
         </Button>
       </DialogActions>
     </Dialog>

     <Snackbar
       open={snackbarOpen}
       autoHideDuration={6000}
       onClose={() => setSnackbarOpen(false)}
       anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
     >
       <Alert
         onClose={() => setSnackbarOpen(false)}
         severity={snackbarSeverity}
         sx={{ width: "100%" }}
       >
         {snackbarMessage}
       </Alert>
     </Snackbar>
   </Container>
 );
};

export default ProcessAndDocuments;