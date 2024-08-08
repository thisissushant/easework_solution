import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
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
  Container
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import * as XLSX from "xlsx";
import useApproval from "../../../../../hooks/useApproval"; // Import the custom hook

const iconColor = "#6b6be2";

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
};

const ApprovalPage = ({ categoryCardId }) => {
  const {
    approvals,
    loading,
    error,
    createApproval,
    updateApproval,
    deleteApproval,
    toggleApprovalActivation,
  } = useApproval(categoryCardId);

  const [approvalType, setApprovalType] = useState("");
  const [buyerApprovals, setBuyerApprovals] = useState([]);
  const [supervisorApprovals, setSupervisorApprovals] = useState([]);
  const [newEntry, setNewEntry] = useState({
    limits: "",
    role: "",
    userId: "",
    intakeRequestType: "",
    active: true,
  });
  const [editingEntry, setEditingEntry] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuEntryId, setMenuEntryId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const fileInputRef = useRef(null);

  // Update local state when approvals change
  useEffect(() => {
    if (approvals) {
      setBuyerApprovals(
        approvals.buyer_approval.map((approval, index) => ({
          id: index + 1,
          intakeRequestType: approval.intake_request_type,
          limits: approval.approval_limit,
          role: approval.role,
          userId: approval.user_id,
          active: approval.activate,
          approval_id: approval.approval_id,
        }))
      );
      setSupervisorApprovals(
        approvals.supervisor_approval.map((approval, index) => ({
          id: index + 1,
          limits: approval.approval_limit,
          role: approval.role,
          userId: approval.user_id,
          active: approval.activate,
          approval_id: approval.approval_id,
        }))
      );
    }
  }, [approvals]);

  const handleApprovalTypeChange = (event) => {
    setApprovalType(event.target.value);
    setSelectedRows([]);
  };

  const handleAddEntry = async () => {
    if (
      newEntry.limits.trim() !== "" &&
      newEntry.role.trim() !== "" &&
      newEntry.userId.trim() !== ""
    ) {
      const isDuplicate = (
        approvalType === "buyer" ? buyerApprovals : supervisorApprovals
      ).some(
        (entry) =>
          entry.limits === newEntry.limits &&
          entry.role === newEntry.role &&
          entry.userId.toLowerCase() === newEntry.userId.toLowerCase() &&
          (approvalType !== "buyer" ||
            entry.intakeRequestType === newEntry.intakeRequestType)
      );

      if (isDuplicate) {
        setSnackbarMessage("This exact entry already exists.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      } else {
        try {
          const postData = {
            type: approvalType,
            approval_limit: newEntry.limits,
            role: newEntry.role,
            user_id: newEntry.userId,
            intake_request_type:
              approvalType === "buyer" ? newEntry.intakeRequestType : "",
          };

          await createApproval(postData);

          setNewEntry({
            limits: "",
            role: "",
            userId: "",
            intakeRequestType: "",
            active: true,
          });
          setOpenAddDialog(false);
          setSnackbarMessage("Entry added successfully.");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        } catch (error) {
          console.error("Error creating approval:", error);
          setSnackbarMessage("Error creating approval. Please try again.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      }
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setOpenEditDialog(true);
    handleCloseMenu();
  };

  const handleSaveEdit = async () => {
    const currentApprovals =
      approvalType === "buyer" ? buyerApprovals : supervisorApprovals;
    const isDuplicate = currentApprovals.some(
      (entry) =>
        entry.id !== editingEntry.id &&
        entry.limits === editingEntry.limits &&
        entry.role === editingEntry.role &&
        entry.userId.toLowerCase() === editingEntry.userId.toLowerCase() &&
        (approvalType !== "buyer" ||
          entry.intakeRequestType === editingEntry.intakeRequestType)
    );

    if (isDuplicate) {
      setSnackbarMessage("This exact entry already exists.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const requestBody = {
        type: approvalType,
        approval_id: editingEntry.approval_id,
        approval_limit: editingEntry.limits,
        role: editingEntry.role,
        user_id: editingEntry.userId,
        intake_request_type:
          approvalType === "buyer" ? editingEntry.intakeRequestType : "",
      };

      await updateApproval(requestBody);

      setOpenEditDialog(false);
      setEditingEntry(null);
      setSnackbarMessage("Entry updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating approval:", error);
      setSnackbarMessage("Error updating approval. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleToggleActive = useCallback(
    async (id) => {
      let entry;
      let newStatus;

      if (approvalType === "buyer") {
        entry = buyerApprovals.find((a) => a.id === id);
      } else {
        entry = supervisorApprovals.find((a) => a.id === id);
      }
      newStatus = !entry.active;

      try {
        await toggleApprovalActivation(
          entry.approval_id,
          approvalType,
          newStatus
        );

        setSnackbarMessage("Approval status updated successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error updating approval status:", error);
        setSnackbarMessage("Error updating approval status. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    },
    [
      approvalType,
      buyerApprovals,
      supervisorApprovals,
      toggleApprovalActivation,
    ]
  );

  const handleDeleteEntry = async (id) => {
    const entryToDelete =
      approvalType === "buyer"
        ? buyerApprovals.find((entry) => entry.id === id)
        : supervisorApprovals.find((entry) => entry.id === id);

    if (!entryToDelete) {
      console.error("Entry not found");
      return;
    }

    try {
      await deleteApproval(approvalType, entryToDelete.approval_id);

      handleCloseMenu();
      setSnackbarMessage("Entry deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting approval:", error);
      setSnackbarMessage("Error deleting approval. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuEntryId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuEntryId(null);
  };

  const handleBulkToggleActive = async (activate) => {
    for (const id of selectedRows) {
      const entry =
        approvalType === "buyer"
          ? buyerApprovals.find((a) => a.id === id)
          : supervisorApprovals.find((a) => a.id === id);

      if (entry) {
        try {
          await toggleApprovalActivation(
            entry.approval_id,
            approvalType,
            activate
          );
        } catch (error) {
          console.error("Error updating approval status:", error);
        }
      }
    }

    setSnackbarMessage(
      `Bulk status update ${activate ? "activated" : "deactivated"} successfully.`
    );
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
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

        const currentApprovals =
          approvalType === "buyer" ? buyerApprovals : supervisorApprovals;
        const newApprovals = jsonData.filter((row) => {
          return !currentApprovals.some(
            (existing) =>
              existing.limits === row.limits &&
              existing.role === row.role &&
              existing.userId.toLowerCase() === row.userId.toLowerCase() &&
              (approvalType !== "buyer" ||
                existing.intakeRequestType === row.intakeRequestType)
          );
        });

        for (const approval of newApprovals) {
          try {
            await createApproval({
              type: approvalType,
              approval_limit: approval.limits,
              role: approval.role,
              user_id: approval.userId,
              intake_request_type:
                approvalType === "buyer" ? approval.intakeRequestType : "",
            });
          } catch (error) {
            console.error("Error adding approval from CSV/Excel:", error);
          }
        }

        setSnackbarMessage(
          `${newApprovals.length} new approvals imported successfully.`
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error processing file:", error);
        setSnackbarMessage(
          "Failed to process file. Please check the format and try again."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        resetFileInput();
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: "limits",
        headerName: "Approval Limits",
        width: 200,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "role",
        headerName: "Role",
        width: 200,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "userId",
        headerName: "User ID",
        flex: 1,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "active",
        headerName: "Status",
        width: 120,
        headerClassName: "super-app-theme--header",
        renderCell: (params) => (
          <Tooltip title={params.row.active ? "Deactivate" : "Activate"}>
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
          </Tooltip>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 100,
        headerClassName: "super-app-theme--header",
        renderCell: (params) => (
          <IconButton onClick={(e) => handleOpenMenu(e, params.row.id)}>
            <MoreVertIcon sx={{ color: iconColor }} />
          </IconButton>
        ),
      },
    ];

    if (approvalType === "buyer") {
      return [
        {
          field: "intakeRequestType",
          headerName: "Intake Request Type",
          width: 200,
          headerClassName: "super-app-theme--header",
        },
        ...baseColumns,
      ];
    } else {
      return baseColumns;
    }
  }, [approvalType, handleToggleActive]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="2xl" sx={{ mt: 0 }}>
      <Paper>
        <FormControl
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#5e17eb",
            },
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#5e17eb",
            },
            "&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#5e17eb",
              },
            "& .MuiInputLabel-root": {
              color: "#5e17eb",
            },
            "&.Mui-focused .MuiInputLabel-root": {
              color: "#5e17eb",
            },
          }}
        >
          <InputLabel id="approval-type-label">Select Approval Type</InputLabel>
          <Select
            labelId="approval-type-label"
            value={approvalType}
            onChange={handleApprovalTypeChange}
            label="Select Approval Type"
          >
            <MenuItem value="supervisor">Supervisor Approval</MenuItem>
            <MenuItem value="buyer">Buyer Approval</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {approvalType && (
        <Paper>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mb: 2,
              mt: 2,
            }}
          >
            <input
              accept=".csv,.xlsx,.xls"
              style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={handleCSVUpload}
              ref={fileInputRef}
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

          <DataGrid
            rows={
              approvalType === "buyer" ? buyerApprovals : supervisorApprovals
            }
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            autoHeight
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
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
              },
              "& .MuiDataGrid-row": {
                bgcolor: "white",
              },
              "& .MuiDataGrid-row:hover": {
                bgcolor: "white",
              },
            }}
            onSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
          />

          {selectedRows.length > 0 && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={() => handleBulkToggleActive(true)}
                sx={{
                  borderColor: iconColor,
                  color: iconColor,
                  mr: 1,
                  "&:hover": {
                    borderColor: iconColor,
                    bgcolor: "white",
                  },
                }}
              >
                Activate Selected
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleBulkToggleActive(false)}
                sx={{
                  borderColor: iconColor,
                  color: iconColor,
                  "&:hover": {
                    borderColor: iconColor,
                    bgcolor: "white",
                  },
                }}
              >
                Deactivate Selected
              </Button>
            </Box>
          )}
        </Paper>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() =>
            handleEditEntry(
              approvalType === "buyer"
                ? buyerApprovals.find((entry) => entry.id === menuEntryId)
                : supervisorApprovals.find((entry) => entry.id === menuEntryId)
            )
          }
        >
          <EditIcon sx={{ mr: 1, color: iconColor }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteEntry(menuEntryId)}>
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
        <DialogTitle sx={{ color: iconColor }}>Add New Entry</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Approval Limits</InputLabel>
            <Select
              value={newEntry.limits}
              onChange={(e) =>
                setNewEntry({ ...newEntry, limits: e.target.value })
              }
              label="Approval Limits"
            >
              <MenuItem value="Upto 50000">Upto 50000</MenuItem>
              <MenuItem value="50001 - 250000">50001 - 250000</MenuItem>
              <MenuItem value="250001 - 1000000">250001 - 1000000</MenuItem>
              <MenuItem value="Above 100000">Above 100000</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Role"
            type="text"
            fullWidth
            variant="outlined"
            value={newEntry.role}
            onChange={(e) => setNewEntry({ ...newEntry, role: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label="User ID"
            type="email"
            fullWidth
            variant="outlined"
            value={newEntry.userId}
            onChange={(e) =>
              setNewEntry({ ...newEntry, userId: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          {approvalType === "buyer" && (
            <TextField
              margin="dense"
              label="Intake Request Type"
              type="text"
              fullWidth
              variant="outlined"
              value={newEntry.intakeRequestType}
              onChange={(e) =>
                setNewEntry({ ...newEntry, intakeRequestType: e.target.value })
              }
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenAddDialog(false)}
            sx={{ color: "#666" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddEntry}
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
        <DialogTitle sx={{ color: iconColor }}>Edit Entry</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Approval Limits</InputLabel>
            <Select
              value={editingEntry?.limits || ""}
              onChange={(e) =>
                setEditingEntry({ ...editingEntry, limits: e.target.value })
              }
              label="Approval Limits"
            >
              <MenuItem value="Upto 50000">Upto 50000</MenuItem>
              <MenuItem value="50001 - 250000">50001 - 250000</MenuItem>
              <MenuItem value="250001 - 1000000">250001 - 1000000</MenuItem>
              <MenuItem value="Above 100000">Above 100000</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Role"
            type="text"
            fullWidth
            variant="outlined"
            value={editingEntry?.role || ""}
            onChange={(e) =>
              setEditingEntry({ ...editingEntry, role: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label="User ID"
            type="email"
            fullWidth
            variant="outlined"
            value={editingEntry?.userId || ""}
            onChange={(e) =>
              setEditingEntry({ ...editingEntry, userId: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          {approvalType === "buyer" && (
            <TextField
              margin="dense"
              label="Intake Request Type"
              type="text"
              fullWidth
              variant="outlined"
              value={editingEntry?.intakeRequestType || ""}
              onChange={(e) =>
                setEditingEntry({
                  ...editingEntry,
                  intakeRequestType: e.target.value,
                })
              }
              sx={{ mt: 2 }}
            />
          )}
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
        onClose={() => {
          setSnackbarOpen(false);
          setSnackbarMessage("");
          setSnackbarSeverity("info");
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => {
            setSnackbarOpen(false);
            setSnackbarMessage("");
            setSnackbarSeverity("info");
          }}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ApprovalPage;
