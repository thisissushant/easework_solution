import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  TextField,
  Collapse,
  Box,
  Tooltip,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import useRiskAnalysis from "../../../../../hooks/useRiskAnalysis";

const StyledButton = styled(Button)({
  color: "#6b6be2",
  borderColor: "#6b6be2",
  "&:hover": {
    borderColor: "#5a5ad1",
  },
});

const StyledIconButton = styled("button")(({ theme }) => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#6b6be2",
  padding: theme.spacing(1),
  borderRadius: "50%",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const RiskItem = styled(ListItem)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "stretch",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  transition: "box-shadow 0.3s",
  "&:hover": {
    boxShadow: theme.shadows[2],
  },
}));

const RiskHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
}));

const RiskInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
}));

const RiskContent = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

const RiskAnalysis = ({ categoryCardId }) => {
  const {
    loading,
    error,
    createRisk,
    getAllRisks,
    deleteRisk,
    createTask,
    getAllTasks,
    deleteTask,
  } = useRiskAnalysis(categoryCardId);

  const [risks, setRisks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedRisk, setExpandedRisk] = useState(null);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [newRisk, setNewRisk] = useState({
    risk_id: "",
    risk_description: "",
    impacted_spend: "",
    risk_idenified_date: "",
  });
  const [newTask, setNewTask] = useState({
    number: "",
    steps_to_be_executed: "",
    responsible: "",
    assigned_date: "",
    status: "",
    actual_steps_taken: "",
    completion_date: "",
  });
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      const fetchedRisks = await getAllRisks();
      setRisks(fetchedRisks);
    } catch (error) {
      console.error("Error fetching risks:", error);
    }
  };

  const handleDeleteTask = async (riskId, taskNumber) => {
    try {
      await deleteTask(riskId, taskNumber);
      fetchTasks(riskId);
      setSnackbar({ open: true, message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      setSnackbar({ open: true, message: "Error deleting task" });
    }
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskSubmit = async () => {
    try {
      if (!expandedRisk) {
        throw new Error("No risk selected");
      }
      await createTask(expandedRisk, newTask);
      setNewTask({
        number: "",
        steps_to_be_executed: "",
        responsible: "",
        assigned_date: "",
        status: "",
        actual_steps_taken: "",
        completion_date: "",
      });
      setOpenTaskDialog(false);
      fetchTasks(expandedRisk);
      setSnackbar({ open: true, message: "Task added successfully" });
    } catch (error) {
      console.error("Error creating task:", error);
      setSnackbar({ open: true, message: "Error creating task" });
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchTasks = async (riskId) => {
    try {
      const fetchedTasks = await getAllTasks(riskId);
      setTasks((prev) => ({ ...prev, [riskId]: fetchedTasks }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRisk((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createRisk(newRisk);
      setNewRisk({
        risk_id: "",
        risk_description: "",
        impacted_spend: "",
        risk_idenified_date: "",
      });
      setOpenDialog(false);
      fetchRisks();
      setSnackbar({ open: true, message: "Risk added successfully" });
    } catch (error) {
      console.error("Error creating risk:", error);
      setSnackbar({ open: true, message: "Error creating risk" });
    }
  };

  const handleDelete = async (riskId) => {
    try {
      await deleteRisk(riskId);
      fetchRisks();
      setSnackbar({ open: true, message: "Risk deleted successfully" });
    } catch (error) {
      console.error("Error deleting risk:", error);
      setSnackbar({ open: true, message: "Error deleting risk" });
    }
  };

  const toggleExpand = (riskId) => {
    if (expandedRisk === riskId) {
      setExpandedRisk(null);
    } else {
      setExpandedRisk(riskId);
      fetchTasks(riskId);
    }
  };
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  if (loading) return <Box sx={{ textAlign: "center" }}>
    <CircularProgress sx={{ color: "#9747FF", mt: 20 }} />
  </Box>;


  return (
    <Container maxWidth="2xl" sx={{ mt: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mb: 2 }}>
        <Tooltip title="Add New">
          <IconButton
            onClick={() => setOpenDialog(true)}
            sx={{ color: "#6b6be2", "&:hover": { color: "#5a5ad1" } }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Risk</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Risk ID"
            name="risk_id"
            value={newRisk.risk_id}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Risk Description"
            name="risk_description"
            value={newRisk.risk_description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            fullWidth
            label="Impacted Spend"
            name="impacted_spend"
            value={newRisk.impacted_spend}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Risk Identified Date"
            name="risk_idenified_date"
            type="date"
            value={newRisk.risk_idenified_date}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <StyledButton onClick={handleSubmit}>Create Risk</StyledButton>
        </DialogActions>
      </Dialog>

      <List>
        {risks.map((risk) => (
          <RiskItem key={risk.risk_id}>
            <RiskHeader>
              <RiskInfo>
                <Typography variant="h6" fontWeight="bold">
                  Risk ID: {risk.risk_id}
                </Typography>
                <Typography variant="body1">{risk.risk_description}</Typography>
              </RiskInfo>
              <StyledIconButton onClick={() => handleDelete(risk.risk_id)}>
                <DeleteIcon />
              </StyledIconButton>
            </RiskHeader>
            <Box display="flex" justifyContent="flex-end">
              <IconButton onClick={() => toggleExpand(risk.risk_id)}>
                {expandedRisk === risk.risk_id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={expandedRisk === risk.risk_id} timeout="auto" unmountOnExit>
              <RiskContent>
                <Box display="flex" justifyContent="flex-end" mb={2}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenTaskDialog(true)}
                  >
                    Add Task
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Number</TableCell>
                        <TableCell>Steps to be Executed</TableCell>
                        <TableCell>Responsible</TableCell>
                        <TableCell>Assigned Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actual Steps Taken</TableCell>
                        <TableCell>Completion Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tasks[risk.risk_id] && tasks[risk.risk_id].length > 0 ? (
                        tasks[risk.risk_id].map((task) => (
                          <TableRow key={task.number}>
                            <TableCell>{task.number}</TableCell>
                            <TableCell>{task.steps_to_be_executed}</TableCell>
                            <TableCell>{task.responsible}</TableCell>
                            <TableCell>{task.assigned_date}</TableCell>
                            <TableCell>{task.status}</TableCell>
                            <TableCell>{task.actual_steps_taken}</TableCell>
                            <TableCell>{task.completion_date}</TableCell>
                            <TableCell>
                              <IconButton onClick={() => handleDeleteTask(risk.risk_id, task.number)}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            No tasks available for this risk.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </RiskContent>
            </Collapse>
          </RiskItem>
        ))}
      </List>

      <Dialog open={openTaskDialog} onClose={() => setOpenTaskDialog(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Task Number"
            name="number"
            value={newTask.number}
            onChange={handleTaskInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Steps to be Executed"
            name="steps_to_be_executed"
            value={newTask.steps_to_be_executed}
            onChange={handleTaskInputChange}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            fullWidth
            label="Responsible"
            name="responsible"
            value={newTask.responsible}
            onChange={handleTaskInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Assigned Date"
            name="assigned_date"
            type="date"
            value={newTask.assigned_date}
            onChange={handleTaskInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            fullWidth
            label="Status"
            name="status"
            value={newTask.status}
            onChange={handleTaskInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Actual Steps Taken"
            name="actual_steps_taken"
            value={newTask.actual_steps_taken}
            onChange={handleTaskInputChange}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            fullWidth
            label="Completion Date"
            name="completion_date"
            type="date"
            value={newTask.completion_date}
            onChange={handleTaskInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaskDialog(false)}>Cancel</Button>
          <StyledButton onClick={handleTaskSubmit}>Create Task</StyledButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
      />
    </Container>
  );
};

export default RiskAnalysis;
