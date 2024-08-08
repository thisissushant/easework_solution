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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  Tooltip,
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
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import useCostSavingOpportunity from "../../../../../hooks/useCostSavingOpprtunity";

const StyledButton = styled(Button)({
  color: "",
  borderColor: "#5e17eb",
  "&:hover": {
    borderColor: "#5a5ad1",
  },
});

const StyledIconButton = styled("button")(({ theme }) => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#5e17eb",
  padding: theme.spacing(1),
  borderRadius: "50%",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const OpportunityItem = styled(ListItem)(({ theme }) => ({
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

const OpportunityHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
}));

const OpportunityInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
}));

const OpportunityContent = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

const CostSavingOpportunities = ({ categoryCardId }) => {
  const {
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
  } = useCostSavingOpportunity(categoryCardId);

  const [openDialog, setOpenDialog] = useState(false);
  const [expandedOpportunity, setExpandedOpportunity] = useState(null);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    opportunity_id: "",
    opportunity: "",
    potential_cost_saving: "",
    opportunity_idenified_date: "",
  });
  const [newTask, setNewTask] = useState({
    number: "",
    steps_to_be_executed: "",
    responsible: "",
    assigned_date: "",
    status: "",
    actual_savings_achieved: "",
    completion_date: "",
  });
  const [tasks, setTasks] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const [editOpportunity, setEditOpportunity] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [openEditOpportunityDialog, setOpenEditOpportunityDialog] =
    useState(false);
  const [openEditTaskDialog, setOpenEditTaskDialog] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, [categoryCardId]);

  const fetchOpportunities = async () => {
    try {
      await getOpportunities();
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      setSnackbar({ open: true, message: "Error fetching opportunities" });
    }
  };

  const fetchTasks = async (opportunityId) => {
    try {
      const fetchedTasks = await getAllTasks(opportunityId);
      setTasks((prev) => ({ ...prev, [opportunityId]: fetchedTasks }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setSnackbar({ open: true, message: "Error fetching tasks" });
    }
  };

  const handleDeleteTask = async (opportunityId, taskNumber) => {
    try {
      await deleteTask(opportunityId, taskNumber);
      fetchTasks(opportunityId);
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
      if (!expandedOpportunity) {
        throw new Error("No opportunity selected");
      }
      await createTask(expandedOpportunity, newTask);
      setNewTask({
        number: "",
        steps_to_be_executed: "",
        responsible: "",
        assigned_date: "",
        status: "",
        actual_savings_achieved: "",
        completion_date: "",
      });
      setOpenTaskDialog(false);
      fetchTasks(expandedOpportunity);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOpportunity((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpportunitySubmit = async () => {
    try {
      await createOpportunity(newOpportunity);
      setNewOpportunity({
        opportunity_id: "",
        opportunity: "",
        potential_cost_saving: "",
        opportunity_idenified_date: "",
      });
      setOpenDialog(false);
      fetchOpportunities();
      setSnackbar({ open: true, message: "Opportunity added successfully" });
    } catch (error) {
      console.error("Error creating opportunity:", error);
      setSnackbar({ open: true, message: "Error creating opportunity" });
    }
  };

  const handleDeleteOpportunity = async (opportunityId) => {
    try {
      await deleteOpportunity(opportunityId);
      fetchOpportunities();
      setSnackbar({ open: true, message: "Opportunity deleted successfully" });
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      setSnackbar({ open: true, message: "Error deleting opportunity" });
    }
  };

  const toggleExpand = (opportunityId) => {
    if (expandedOpportunity === opportunityId) {
      setExpandedOpportunity(null);
    } else {
      setExpandedOpportunity(opportunityId);
      fetchTasks(opportunityId);
    }
  };

  const handleEditOpportunity = async () => {
    try {
      await updateOpportunity(editOpportunity.opportunity_id, editOpportunity);
      setOpenEditOpportunityDialog(false);
      fetchOpportunities();
      setSnackbar({ open: true, message: "Opportunity updated successfully" });
    } catch (error) {
      console.error("Error updating opportunity:", error);
      setSnackbar({ open: true, message: "Error updating opportunity" });
    }
  };

  const handleEditTask = async () => {
    try {
      await updateTask(editTask.opportunity_id, editTask.number, editTask);
      setOpenEditTaskDialog(false);
      fetchTasks(editTask.opportunity_id);
      setSnackbar({ open: true, message: "Task updated successfully" });
    } catch (error) {
      console.error("Error updating task:", error);
      setSnackbar({ open: true, message: "Error updating task" });
    }
  };

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
        <DialogTitle>Add New Cost Saving Opportunity</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Opportunity ID"
            name="opportunity_id"
            value={newOpportunity.opportunity_id}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Opportunity Name"
            name="opportunity"
            value={newOpportunity.opportunity}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            fullWidth
            label="Potential Cost Saving"
            name="potential_cost_saving"
            value={newOpportunity.potential_cost_saving}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Opportunity Identified Date"
            name="opportunity_idenified_date"
            type="date"
            value={newOpportunity.opportunity_idenified_date}
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
          <StyledButton onClick={handleOpportunitySubmit}>
            Create Opportunity
          </StyledButton>
        </DialogActions>
      </Dialog>

      <List>
        {opportunities.map((opportunity) => (
          <OpportunityItem key={opportunity.opportunity_id}>
            <OpportunityHeader>
              <OpportunityInfo>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Opportunity ID: {opportunity.opportunity_id}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {opportunity.opportunity}
                </Typography>
                <Chip
                  label={`Potential Saving: $${opportunity.potential_cost_saving}`}
                  size="small"
                  variant="outlined"
                  style={{
                    borderColor: "#5e17eb",
                    marginTop: "8px",
                  }}
                />
              </OpportunityInfo>
              <Box>
                <StyledIconButton
                  onClick={() => toggleExpand(opportunity.opportunity_id)}
                >
                  {expandedOpportunity === opportunity.opportunity_id ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </StyledIconButton>
                <StyledIconButton
                  onClick={() => {
                    setEditOpportunity(opportunity);
                    setOpenEditOpportunityDialog(true);
                  }}
                >
                  <EditIcon />
                </StyledIconButton>
                <StyledIconButton
                  onClick={() =>
                    handleDeleteOpportunity(opportunity.opportunity_id)
                  }
                >
                  <DeleteIcon />
                </StyledIconButton>
              </Box>
            </OpportunityHeader>
            <Collapse
              in={expandedOpportunity === opportunity.opportunity_id}
              timeout="auto"
              unmountOnExit
            >
              <OpportunityContent>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#5e17eb", mb: 1 }}
                  >
                    Oppertunity Name
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={opportunity.opportunity}
                    multiline
                    rows={3}
                    InputProps={{
                      readOnly: true,
                      style: {
                        backgroundColor: "white",
                      },
                    }}
                    sx={{
                      backgroundColor: "white !important",
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white !important",
                        "& textarea": {
                          backgroundColor: "white !important",
                        },
                        "& fieldset": {
                          borderColor: "rgba(0, 0, 0, 0.23)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(0, 0, 0, 0.23)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "rgba(0, 0, 0, 0.23)",
                          borderWidth: "1px",
                        },
                      },
                    }}
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#5e17eb", mb: 1 }}
                  >
                    Tasks
                  </Typography>
                  <StyledButton
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenTaskDialog(true)}
                    style={{ marginBottom: "10px" }}
                  >
                    Add New Task
                  </StyledButton>
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="tasks table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Number</TableCell>
                          <TableCell>Steps to be Executed</TableCell>
                          <TableCell>Responsible</TableCell>
                          <TableCell>Assigned Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actual Savings</TableCell>
                          <TableCell>Completion Date</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tasks[opportunity.opportunity_id]?.map((task) => (
                          <TableRow key={task.number}>
                            <TableCell>{task.number}</TableCell>
                            <TableCell>{task.steps_to_be_executed}</TableCell>
                            <TableCell>{task.responsible}</TableCell>
                            <TableCell>{task.assigned_date}</TableCell>
                            <TableCell>{task.status}</TableCell>
                            <TableCell>
                              {task.actual_savings_achieved}
                            </TableCell>
                            <TableCell>{task.completion_date}</TableCell>
                            <TableCell>
                              <StyledIconButton
                                onClick={() => {
                                  setEditTask({
                                    ...task,
                                    opportunity_id: opportunity.opportunity_id,
                                  });
                                  setOpenEditTaskDialog(true);
                                }}
                                size="small"
                              >
                                <EditIcon />
                              </StyledIconButton>
                              <StyledIconButton
                                onClick={() =>
                                  handleDeleteTask(
                                    opportunity.opportunity_id,
                                    task.number
                                  )
                                }
                                size="small"
                              >
                                <DeleteIcon />
                              </StyledIconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </OpportunityContent>
            </Collapse>
          </OpportunityItem>
        ))}
      </List>

      {/* Add New Task Dialog */}
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
            label="Actual Savings Achieved"
            name="actual_savings_achieved"
            value={newTask.actual_savings_achieved}
            onChange={handleTaskInputChange}
            margin="normal"
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaskDialog(false)}>Cancel</Button>
          <StyledButton onClick={handleTaskSubmit}>Add Task</StyledButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditOpportunityDialog}
        onClose={() => setOpenEditOpportunityDialog(false)}
      >
        <DialogTitle>Edit Opportunity</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Opportunity ID"
            name="opportunity_id"
            value={editOpportunity?.opportunity_id || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Opportunity Name"
            name="opportunity"
            value={editOpportunity?.opportunity || ""}
            onChange={(e) =>
              setEditOpportunity({
                ...editOpportunity,
                opportunity: e.target.value,
              })
            }
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            fullWidth
            label="Potential Cost Saving"
            name="potential_cost_saving"
            value={editOpportunity?.potential_cost_saving || ""}
            onChange={(e) =>
              setEditOpportunity({
                ...editOpportunity,
                potential_cost_saving: e.target.value,
              })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Opportunity Identified Date"
            name="opportunity_idenified_date"
            type="date"
            value={editOpportunity?.opportunity_idenified_date || ""}
            onChange={(e) =>
              setEditOpportunity({
                ...editOpportunity,
                opportunity_idenified_date: e.target.value,
              })
            }
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditOpportunityDialog(false)}>
            Cancel
          </Button>
          <StyledButton onClick={handleEditOpportunity}>
            Update Opportunity
          </StyledButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditTaskDialog}
        onClose={() => setOpenEditTaskDialog(false)}
      >
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Task Number"
            name="number"
            value={editTask?.number || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Steps to be Executed"
            name="steps_to_be_executed"
            value={editTask?.steps_to_be_executed || ""}
            onChange={(e) =>
              setEditTask({ ...editTask, steps_to_be_executed: e.target.value })
            }
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            fullWidth
            label="Task Responsible"
            name="responsible"
            value={editTask?.responsible || ""}
            onChange={(e) =>
              setEditTask({ ...editTask, responsible: e.target.value })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Task Assigned Date"
            name="assigned_date"
            type="date"
            value={editTask?.assigned_date || ""}
            onChange={(e) =>
              setEditTask({ ...editTask, assigned_date: e.target.value })
            }
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            fullWidth
            label="Task Status"
            name="status"
            value={editTask?.status || ""}
            onChange={(e) =>
              setEditTask({ ...editTask, status: e.target.value })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Actual Savings"
            name="actual_savings_achieved"
            value={editTask?.actual_savings_achieved || ""}
            onChange={(e) =>
              setEditTask({
                ...editTask,
                actual_savings_achieved: e.target.value,
              })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Task Completion Date"
            name="completion_date"
            type="date"
            value={editTask?.completion_date || ""}
            onChange={(e) =>
              setEditTask({ ...editTask, completion_date: e.target.value })
            }
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditTaskDialog(false)}>Cancel</Button>
          <StyledButton onClick={handleEditTask}>Update Task</StyledButton>
        </DialogActions>
      </Dialog>

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
      />
    </Container>
  );
};

export default CostSavingOpportunities;
