// ResourcePlanningApp.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Paper,
  Grid,
  Chip,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  InputAdornment,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import {
  Add as AddIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CalendarMonth as CalendarIcon,
  FiberManualRecord as DotIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  Delete,
} from "@mui/icons-material";

import {
  doc,
  updateDoc,
  collection,
  query,
  getDocs,
  where,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase-config";

const ResourcePlanningApp = () => {
  const [viewMode, setViewMode] = useState("process"); // process, resource, calendar
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [processDialog, setProcessDialog] = useState({
    open: false,
    workOrder: null,
    processes: [],
  });

  // State for work orders, resources, and loading status
  const [workOrders, setWorkOrders] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch resources first
      const resourcesSnapshot = await getDocs(collection(db, "resources"));
      const resourcesData = resourcesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResources(resourcesData);

      // Create work orders query
      let workOrdersQuery;
      if (filterStatus && filterStatus !== "All") {
        workOrdersQuery = query(
          collection(db, "newOrders"),
          where("status", "==", filterStatus),
          orderBy("start", "asc")
        );
      } else {
        workOrdersQuery = query(
          collection(db, "newOrders"),
          orderBy("start", "asc")
        );
      }

      // Fetch work orders
      const workOrdersSnapshot = await getDocs(workOrdersQuery);
      const workOrdersData = workOrdersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // For each work order, fetch its processes
      const workOrdersWithProcesses = await Promise.all(
        workOrdersData.map(async (wo) => {
          const processesQuery = query(
            collection(db, "processes"),
            where("workOrderId", "==", wo.id)
          );
          const processesSnapshot = await getDocs(processesQuery);
          const processes = processesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          return { ...wo, processes: processes.length > 0 ? processes : [] };
        })
      );

      setWorkOrders(workOrdersWithProcesses);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filter changes
  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  // Filter work orders based on search term
  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesSearch =
      wo.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Handle resource reassignment
  const handleResourceChange = async (workOrderId, processId, newResource) => {
    try {
      const processRef = doc(db, "processes", processId);
      await updateDoc(processRef, {
        resource: newResource,
      });

      // Update local state
      setWorkOrders((prev) =>
        prev.map((wo) => {
          if (wo.id === workOrderId) {
            return {
              ...wo,
              processes: wo.processes.map((process) => {
                if (process.id === processId) {
                  return { ...process, resource: newResource };
                }
                return process;
              }),
            };
          }
          return wo;
        })
      );
    } catch (error) {
      console.error("Error updating resource assignment:", error);
      // Add error handling/notification
    }

    setSelectedProcess(null);
  };

  const handleTemplateEdit = (workOrder) => {
    // Import the process template generator
    import("../data/data").then(({ generateProcessesFromTemplate }) => {
      // Generate initial template
      const templateProcesses = generateProcessesFromTemplate(
        workOrder.id,
        workOrder.state || "DEFAULT",
        workOrder.start?.toDate() || new Date()
      );

      setProcessDialog({
        open: true,
        workOrder,
        processes: templateProcesses,
      });
    });
  };

  // Function to save customized processes
  const saveCustomizedProcesses = async () => {
    try {
      const { workOrder, processes } = processDialog;

      // Add processes to Firestore
      const batch = writeBatch(db);
      processes.forEach((process) => {
        const processRef = doc(collection(db, "processes"));
        batch.set(processRef, {
          ...process,
          id: processRef.id,
        });
      });

      await batch.commit();

      // Update local state
      setWorkOrders((prev) =>
        prev.map((wo) => {
          if (wo.id === workOrder.id) {
            return {
              ...wo,
              processes: processes,
            };
          }
          return wo;
        })
      );

      setProcessDialog({ open: false, workOrder: null, processes: [] });
    } catch (error) {
      console.error("Error saving customized processes:", error);
    }
  };

  // Function to generate and add processes for a work order
  const generateProcesses = async (workOrder) => {
    try {
      // Import the process template generator
      const { generateProcessesFromTemplate } = await import("../data/data");

      // Generate processes based on work order type (using state field)
      const processes = generateProcessesFromTemplate(
        workOrder.id,
        workOrder.state || "DEFAULT",
        workOrder.start?.toDate() || new Date()
      );

      // Add processes to Firestore
      const batch = writeBatch(db);
      processes.forEach((process) => {
        const processRef = doc(collection(db, "processes"));
        batch.set(processRef, {
          ...process,
          id: processRef.id, // Use Firestore auto-generated ID
        });
      });

      await batch.commit();

      // Update local state
      setWorkOrders((prev) =>
        prev.map((wo) => {
          if (wo.id === workOrder.id) {
            return {
              ...wo,
              processes: processes,
            };
          }
          return wo;
        })
      );

      return true;
    } catch (error) {
      console.error("Error generating processes:", error);
      return false;
    }
  };

  // Calculate resource utilization
  const calculateUtilization = (resourceName) => {
    let totalHours = 0;

    workOrders.forEach((wo) => {
      wo.processes?.forEach((process) => {
        if (process.resource === resourceName) {
          totalHours += process.duration || 0;
        }
      });
    });

    const resource = resources.find((r) => r.name === resourceName);
    const capacity = resource ? resource.capacity : 40;
    const utilization = Math.min(
      100,
      Math.round((totalHours / capacity) * 100)
    );

    return utilization;
  };

  // Status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "primary";
      case "In Progress":
      case "Released":
        return "secondary";
      case "Completed":
      case "Finished":
        return "success";
      default:
        return "default";
    }
  };

  // Priority chip color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchData();
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error loading data: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#f5f5f5",
        width: "100%",
      }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Work Order Resource Planning
          </Typography>
          <Button variant="contained" color="secondary" startIcon={<AddIcon />}>
            New Work Order
          </Button>
          <IconButton color="inherit" sx={{ ml: 2 }}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Controls */}
      <Paper sx={{ mb: 2 }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Tabs
            value={viewMode}
            onChange={(e, newValue) => setViewMode(newValue)}
            indicatorColor="primary"
            textColor="primary">
            <Tab value="process" label="Process View" />
            <Tab value="resource" label="Resource View" />
            <Tab
              value="calendar"
              label="Calendar View"
              icon={<CalendarIcon fontSize="small" />}
              iconPosition="start"
            />
          </Tabs>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}>
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="Released">Released</MenuItem>
              <MenuItem value="Finished">Finished</MenuItem>
            </Select>

            <TextField
              placeholder="Search work orders..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Resource Selection Dialog */}
      <Dialog
        open={selectedProcess !== null}
        onClose={() => setSelectedProcess(null)}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>Select Resource</DialogTitle>
        <DialogContent>
          <List sx={{ maxHeight: 300, overflow: "auto" }}>
            {resources.map((resource) => (
              <ListItem
                key={resource.id}
                button
                onClick={() =>
                  handleResourceChange(
                    selectedProcess?.workOrderId,
                    selectedProcess?.processId,
                    resource.name
                  )
                }>
                <ListItemIcon>
                  <DotIcon sx={{ color: resource.color }} />
                </ListItemIcon>
                <ListItemText primary={resource.name} />
                <Chip
                  label={`${calculateUtilization(resource.name)}% Utilized`}
                  size="small"
                  color={
                    calculateUtilization(resource.name) > 90
                      ? "error"
                      : calculateUtilization(resource.name) > 70
                      ? "warning"
                      : "success"
                  }
                  variant="outlined"
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedProcess(null)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Main content */}
      <Container maxWidth="xl" sx={{ flex: 1, py: 3, overflow: "auto" }}>
        {viewMode === "process" && (
          <Grid container spacing={3}>
            {filteredWorkOrders.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="h6" color="text.secondary">
                    No work orders found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters or search terms
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              filteredWorkOrders.map((workOrder) => (
                <Grid item xs={12} key={workOrder.id}>
                  <Paper elevation={2}>
                    {/* Work Order Header */}
                    <Box
                      sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #eee",
                      }}>
                      <Box>
                        <Typography variant="h6" gutterBottom={false}>
                          {workOrder.orderNumber}: {workOrder.description}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mt: 0.5,
                          }}>
                          <Typography variant="body2" color="text.secondary">
                            Due:{" "}
                            {workOrder.end?.toDate().toLocaleDateString() ||
                              "N/A"}
                          </Typography>
                          <Chip
                            label={workOrder.priority || "Medium"}
                            size="small"
                            color={getPriorityColor(
                              workOrder.priority || "Medium"
                            )}
                          />
                          <Chip
                            label={workOrder.status}
                            size="small"
                            color={getStatusColor(workOrder.status)}
                          />
                        </Box>
                      </Box>
                      <Box>
                        <Button
                          startIcon={<EditIcon />}
                          sx={{ mr: 1 }}
                          size="small">
                          Edit
                        </Button>
                        <Button
                          startIcon={<InfoIcon />}
                          variant="outlined"
                          size="small">
                          Details
                        </Button>
                      </Box>
                    </Box>

                    {/* Process Steps Bar */}
                    {workOrder.processes && workOrder.processes.length > 0 ? (
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          borderBottom: "1px solid #f5f5f5",
                        }}>
                        <Box
                          sx={{
                            height: 32,
                            bgcolor: "#f5f5f5",
                            borderRadius: 1,
                            display: "flex",
                            overflow: "hidden",
                          }}>
                          {workOrder.processes.map((process) => {
                            const totalDuration = workOrder.processes.reduce(
                              (sum, p) => sum + (p.duration || 0),
                              0
                            );
                            const width =
                              totalDuration > 0
                                ? `${
                                    ((process.duration || 0) / totalDuration) *
                                    100
                                  }%`
                                : "0%";

                            return (
                              <Box
                                key={process.id}
                                sx={{
                                  width: width,
                                  bgcolor: process.color || "#ccc",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  px: 1,
                                }}
                                title={process.name}>
                                {process.name}
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ px: 2, py: 2, textAlign: "center" }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom>
                          No processes defined for this work order
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                          }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => generateProcesses(workOrder)}>
                            Generate Standard Processes
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleTemplateEdit(workOrder)}>
                            Customize Processes
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {/* Resource Allocation Bar */}
                    {workOrder.processes && workOrder.processes.length > 0 && (
                      <Box sx={{ px: 2, py: 1 }}>
                        <Box
                          sx={{
                            height: 32,
                            bgcolor: "#f5f5f5",
                            borderRadius: 1,
                            display: "flex",
                            overflow: "hidden",
                          }}>
                          {workOrder.processes.map((process) => {
                            const totalDuration = workOrder.processes.reduce(
                              (sum, p) => sum + (p.duration || 0),
                              0
                            );
                            const width =
                              totalDuration > 0
                                ? `${
                                    ((process.duration || 0) / totalDuration) *
                                    100
                                  }%`
                                : "0%";
                            const resourceColor =
                              resources.find((r) => r.name === process.resource)
                                ?.color || "#9E9E9E";

                            return (
                              <Box
                                key={process.id}
                                sx={{
                                  width: width,
                                  bgcolor: process.resource
                                    ? resourceColor
                                    : "#e0e0e0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  px: 1,
                                  cursor: "pointer",
                                  "&:hover": {
                                    opacity: 0.9,
                                  },
                                }}
                                title={`${process.name} - ${
                                  process.resource || "Unassigned"
                                }`}
                                onClick={() =>
                                  setSelectedProcess({
                                    workOrderId: workOrder.id,
                                    processId: process.id,
                                    name: process.name,
                                    currentResource: process.resource,
                                  })
                                }>
                                {process.resource || "Assign"}
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {viewMode === "resource" && (
          <Grid container spacing={3}>
            {resources.map((resource) => {
              const utilization = calculateUtilization(resource.name);
              const utilizationColor =
                utilization > 90
                  ? "error"
                  : utilization > 70
                  ? "warning"
                  : "success";

              return (
                <Grid item xs={12} key={resource.id}>
                  <Paper elevation={2}>
                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #eee",
                      }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            bgcolor: resource.color,
                            mr: 1.5,
                          }}
                        />
                        <Typography variant="subtitle1">
                          {resource.name}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ width: 160 }}>
                          <LinearProgress
                            variant="determinate"
                            value={utilization}
                            color={utilizationColor}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {utilization}% Utilized
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ p: 2, minHeight: 64 }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {workOrders.flatMap((wo) =>
                          (wo.processes || [])
                            .filter((p) => p.resource === resource.name)
                            .map((process) => (
                              <Chip
                                key={`${wo.id}-${process.id}`}
                                label={
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 0.5,
                                      alignItems: "center",
                                    }}>
                                    <Typography
                                      variant="caption"
                                      fontWeight="bold">
                                      {wo.orderNumber}
                                    </Typography>
                                    <Typography variant="caption">
                                      {process.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary">
                                      ({process.duration || 0}h)
                                    </Typography>
                                  </Box>
                                }
                                size="small"
                                sx={{
                                  bgcolor: `${process.color}20`,
                                  border: `1px solid ${process.color}40`,
                                }}
                              />
                            ))
                        )}
                        {workOrders
                          .flatMap((wo) => wo.processes || [])
                          .filter((p) => p.resource === resource.name)
                          .length === 0 && (
                          <Typography variant="body2" color="text.secondary">
                            No processes assigned to this resource
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}

        {viewMode === "calendar" && (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Calendar View
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Calendar integration would display resource assignments by date
            </Typography>
            <Box
              sx={{
                p: 4,
                border: "1px dashed #ccc",
                borderRadius: 1,
                textAlign: "center",
                color: "#aaa",
              }}>
              Calendar view implementation
            </Box>
          </Paper>
        )}
        {/* Process Template Dialog */}
        <Dialog
          open={processDialog.open}
          onClose={() => setProcessDialog({ ...processDialog, open: false })}
          maxWidth="md"
          fullWidth>
          <DialogTitle>Customize Process Template</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Work Order: {processDialog.workOrder?.orderNumber} -{" "}
              {processDialog.workOrder?.description}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <TableContainer component={Paper}>
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
                    {processDialog.processes.map((process, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            size="small"
                            fullWidth
                            value={process.name}
                            onChange={(e) => {
                              const updatedProcesses = [
                                ...processDialog.processes,
                              ];
                              updatedProcesses[index].name = e.target.value;
                              setProcessDialog({
                                ...processDialog,
                                processes: updatedProcesses,
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            size="small"
                            type="number"
                            value={process.duration}
                            onChange={(e) => {
                              const updatedProcesses = [
                                ...processDialog.processes,
                              ];
                              updatedProcesses[index].duration = parseInt(
                                e.target.value
                              );
                              setProcessDialog({
                                ...processDialog,
                                processes: updatedProcesses,
                              });
                            }}
                            InputProps={{
                              inputProps: { min: 1 },
                            }}
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              bgcolor: process.color,
                              borderRadius: "4px",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={process.resourceType}
                            onChange={(e) => {
                              const updatedProcesses = [
                                ...processDialog.processes,
                              ];
                              updatedProcesses[index].resourceType =
                                e.target.value;
                              setProcessDialog({
                                ...processDialog,
                                processes: updatedProcesses,
                              });
                            }}
                            sx={{ width: 140 }}>
                            <MenuItem value="Technician">Technician</MenuItem>
                            <MenuItem value="Engineer">Engineer</MenuItem>
                            <MenuItem value="Specialist">Specialist</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => {
                              const updatedProcesses = [
                                ...processDialog.processes,
                              ];
                              updatedProcesses.splice(index, 1);
                              setProcessDialog({
                                ...processDialog,
                                processes: updatedProcesses,
                              });
                            }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                variant="text"
                startIcon={<AddIcon />}
                onClick={() => {
                  setProcessDialog({
                    ...processDialog,
                    processes: [
                      ...processDialog.processes,
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
                    ],
                  });
                }}
                sx={{ mt: 2 }}>
                Add Process
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setProcessDialog({
                  open: false,
                  workOrder: null,
                  processes: [],
                })
              }>
              Cancel
            </Button>
            <Button variant="contained" onClick={saveCustomizedProcesses}>
              Create Processes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ResourcePlanningApp;
