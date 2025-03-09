// src/pages/orders/dialogs/ProcessTemplateDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const ProcessTemplateDialog = ({
  open,
  workOrder,
  processes,
  onSave,
  onClose,
}) => {
  const [localProcesses, setLocalProcesses] = useState([]);

  useEffect(() => {
    if (processes) {
      setLocalProcesses([...processes]);
    }
  }, [processes]);

  const handleProcessChange = (index, field, value) => {
    const updatedProcesses = [...localProcesses];
    updatedProcesses[index][field] = value;
    setLocalProcesses(updatedProcesses);
  };

  const handleAddProcess = () => {
    setLocalProcesses([
      ...localProcesses,
      {
        name: "New Process",
        duration: 2,
        color: "#9E9E9E",
        resourceType: "Technician",
        resource: null,
        startDay: 0,
        endDay: 2,
        status: "Pending",
        timeLogged: 0,
        notes: "",
      },
    ]);
  };

  const handleRemoveProcess = (index) => {
    const updatedProcesses = [...localProcesses];
    updatedProcesses.splice(index, 1);
    setLocalProcesses(updatedProcesses);
  };

  const handleSave = () => {
    onSave(localProcesses);
  };

  // Color options
  const colorOptions = [
    { value: "#4285F4", label: "Blue" },
    { value: "#34A853", label: "Green" },
    { value: "#FBBC05", label: "Yellow" },
    { value: "#EA4335", label: "Red" },
    { value: "#673AB7", label: "Purple" },
    { value: "#9E9E9E", label: "Gray" },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Customize Process Template</DialogTitle>
      <DialogContent>
        {workOrder && (
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Work Order: {workOrder.orderNumber} - {workOrder.description}
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Process Name</TableCell>
                <TableCell align="right">Duration (hours)</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Resource Type</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localProcesses.map((process, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      value={process.name}
                      onChange={(e) =>
                        handleProcessChange(index, "name", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      size="small"
                      type="number"
                      value={process.duration}
                      onChange={(e) =>
                        handleProcessChange(
                          index,
                          "duration",
                          parseInt(e.target.value)
                        )
                      }
                      InputProps={{
                        inputProps: { min: 1 },
                      }}
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={process.color}
                      onChange={(e) =>
                        handleProcessChange(index, "color", e.target.value)
                      }
                      sx={{ width: 120 }}
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              bgcolor: selected,
                              mr: 1,
                            }}
                          />
                          {
                            colorOptions.find(
                              (option) => option.value === selected
                            )?.label
                          }
                        </Box>
                      )}>
                      {colorOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                bgcolor: option.value,
                                mr: 1,
                              }}
                            />
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={process.resourceType}
                      onChange={(e) =>
                        handleProcessChange(
                          index,
                          "resourceType",
                          e.target.value
                        )
                      }
                      sx={{ width: 140 }}>
                      <MenuItem value="Technician">Technician</MenuItem>
                      <MenuItem value="Engineer">Engineer</MenuItem>
                      <MenuItem value="Specialist">Specialist</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveProcess(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={handleAddProcess}
            sx={{ mt: 2 }}>
            Add Process
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Create Processes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProcessTemplateDialog;
