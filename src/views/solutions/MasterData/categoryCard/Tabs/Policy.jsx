import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Switch,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip,
  Container
} from "@mui/material";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import usePolicy from "../../../../../hooks/usePolicy"; // Import the usePolicy hook

const iconColor = "#6b6be2";

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
};

const Policy = ({ categoryCardId }) => {
  const {
    loading,
    error,
    policies,
    getAllPolicies,
    createPolicy,
    updatePolicy,
    deletePolicy,
    togglePolicyActivation,
  } = usePolicy(categoryCardId);

  const [newPolicy, setNewPolicy] = useState({
    policy: "",
    policy_wordings: "",
    outcome: "",
    message: "",
    activate: true,
  });
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPolicyId, setMenuPolicyId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  useEffect(() => {
    getAllPolicies();
  }, [getAllPolicies]);

  const handleAddPolicy = async () => {
    if (newPolicy.policy.trim() !== "") {
      try {
        await createPolicy(newPolicy);
        setOpenAddDialog(false);
        setNewPolicy({
          policy: "",
          policy_wordings: "",
          outcome: "",
          message: "",
          activate: true,
        });
        setSnackbarMessage("Policy added successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage("Failed to add policy. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleEditPolicy = (policy) => {
    setEditingPolicy(policy);
    setOpenEditDialog(true);
    handleCloseMenu();
  };

  const handleSaveEdit = async () => {
    try {
      await updatePolicy(editingPolicy);
      setOpenEditDialog(false);
      setEditingPolicy(null);
      setSnackbarMessage("Policy updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error in handleSaveEdit:", error);
      setSnackbarMessage("Failed to update policy. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleToggleActive = async (policyId, isActive) => {
    try {
      await togglePolicyActivation(policyId, isActive);
      setSnackbarMessage(
        `Policy ${isActive ? "activated" : "deactivated"} successfully.`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(
        "Failed to toggle policy activation. Please try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeletePolicy = async (policyId) => {
    try {
      await deletePolicy(policyId);
      handleCloseMenu();
      setSnackbarMessage("Policy deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete policy. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuPolicyId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuPolicyId(null);
  };

  const handleCSVUpload = (event) => {
    // Implement CSV upload logic here
    console.log("CSV upload functionality not implemented yet");
  };

  const columns = [
    {
      field: "policy",
      headerName: "Policy",
      width: 180,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
    },
    {
      field: "policy_wordings",
      headerName: "Policy Wordings",
      width: 250,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
    },
    {
      field: "outcome",
      headerName: "Outcome",
      width: 150,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
    },
    {
      field: "message",
      headerName: "Message",
      width: 200,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
    },
    {
      field: "activate",
      headerName: "Status",
      width: 150,
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" width="100%">
          <Tooltip title={params.row.activate ? "Deactivate" : "Activate"}>
            <Switch
              checked={params.row.activate}
              onChange={() =>
                handleToggleActive(params.row.policy_id, !params.row.activate)
              }
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
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" width="100%">
          <IconButton onClick={(e) => handleOpenMenu(e, params.row.policy_id)}>
            <MoreVertIcon sx={{ color: iconColor }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="2xl" sx={{ mt: 0 }}>
      <Paper
        sx={{
          width: "100%",
          mb: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            p: 2,
            width: "100%",
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
            rows={policies}
            columns={columns}
            getRowId={(row) => row.policy_id}
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
                    justifyContent: "flex-start",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  {loading && (
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
          />
        </Box>
      </Paper>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Policy</DialogTitle>
        <DialogContent>
          <TextField
            label="Policy"
            fullWidth
            margin="dense"
            value={newPolicy.policy}
            onChange={(e) =>
              setNewPolicy((prev) => ({ ...prev, policy: e.target.value }))
            }
          />
          <TextField
            label="Policy Wordings"
            fullWidth
            margin="dense"
            value={newPolicy.policy_wordings}
            onChange={(e) =>
              setNewPolicy((prev) => ({
                ...prev,
                policy_wordings: e.target.value,
              }))
            }
          />
          <TextField
            label="Outcome"
            fullWidth
            margin="dense"
            value={newPolicy.outcome}
            onChange={(e) =>
              setNewPolicy((prev) => ({ ...prev, outcome: e.target.value }))
            }
          />
          <TextField
            label="Message"
            fullWidth
            margin="dense"
            value={newPolicy.message}
            onChange={(e) =>
              setNewPolicy((prev) => ({ ...prev, message: e.target.value }))
            }
          />
          <Box display="flex" alignItems="center" mt={2}>
            <Typography>Activate</Typography>
            <Switch
              checked={newPolicy.activate}
              onChange={(e) =>
                setNewPolicy((prev) => ({ ...prev, activate: e.target.checked }))
              }
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddPolicy} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Policy</DialogTitle>
        <DialogContent>
          {editingPolicy && (
            <>
              <TextField
                label="Policy"
                fullWidth
                margin="dense"
                value={editingPolicy.policy}
                onChange={(e) =>
                  setEditingPolicy((prev) => ({
                    ...prev,
                    policy: e.target.value,
                  }))
                }
              />
              <TextField
                label="Policy Wordings"
                fullWidth
                margin="dense"
                value={editingPolicy.policy_wordings}
                onChange={(e) =>
                  setEditingPolicy((prev) => ({
                    ...prev,
                    policy_wordings: e.target.value,
                  }))
                }
              />
              <TextField
                label="Outcome"
                fullWidth
                margin="dense"
                value={editingPolicy.outcome}
                onChange={(e) =>
                  setEditingPolicy((prev) => ({
                    ...prev,
                    outcome: e.target.value,
                  }))
                }
              />
              <TextField
                label="Message"
                fullWidth
                margin="dense"
                value={editingPolicy.message}
                onChange={(e) =>
                  setEditingPolicy((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
              />
              <Box display="flex" alignItems="center" mt={2}>
                <Typography>Activate</Typography>
                <Switch
                  checked={editingPolicy.activate}
                  onChange={(e) =>
                    setEditingPolicy((prev) => ({
                      ...prev,
                      activate: e.target.checked,
                    }))
                  }
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
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() => {
            const policy = policies.find((p) => p.policy_id === menuPolicyId);
            handleEditPolicy(policy);
          }}
        >
          <EditIcon sx={{ color: iconColor, mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeletePolicy(menuPolicyId)}>
          <DeleteIcon sx={{ color: iconColor, mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
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

export default Policy;