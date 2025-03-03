import React, { useState } from "react";
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
  Close as CloseIcon,
} from "@mui/icons-material";

const ResourcePlanningApp = () => {
  // Sample data - in a real app, this would come from an API
  const [workOrders, setWorkOrders] = useState([
    {
      id: "WO-1001",
      title: "Equipment Maintenance (Quarterly)",
      priority: "Medium",
      dueDate: "2025-03-15",
      status: "Scheduled",
      processes: [
        {
          id: "p1",
          name: "Setup",
          duration: 2,
          color: "#4285F4",
          resource: "Tech 1",
        },
        {
          id: "p2",
          name: "Inspection",
          duration: 4,
          color: "#34A853",
          resource: "Tech 1",
        },
        {
          id: "p3",
          name: "Maintenance Work",
          duration: 6,
          color: "#FBBC05",
          resource: "Tech 1",
        },
        {
          id: "p4",
          name: "Maintenance Work",
          duration: 2,
          color: "#FBBC05",
          resource: "Eng 1",
        },
        {
          id: "p5",
          name: "Testing",
          duration: 3,
          color: "#EA4335",
          resource: "Eng 1",
        },
        {
          id: "p6",
          name: "Documentation",
          duration: 3,
          color: "#673AB7",
          resource: "Tech 1",
        },
        {
          id: "p7",
          name: "Close",
          duration: 2,
          color: "#9E9E9E",
          resource: "Tech 1",
        },
      ],
    },
    {
      id: "WO-1002",
      title: "Air Handler Repair (Emergency)",
      priority: "High",
      dueDate: "2025-03-05",
      status: "In Progress",
      processes: [
        {
          id: "p8",
          name: "Setup",
          duration: 1,
          color: "#4285F4",
          resource: "Eng 2",
        },
        {
          id: "p9",
          name: "Diagnostics",
          duration: 3,
          color: "#EA4335",
          resource: "Eng 2",
        },
        {
          id: "p10",
          name: "Repair Work",
          duration: 4,
          color: "#FBBC05",
          resource: "Eng 2",
        },
        {
          id: "p11",
          name: "Repair Work",
          duration: 4,
          color: "#FBBC05",
          resource: "HVAC Spec",
        },
        {
          id: "p12",
          name: "Testing",
          duration: 3,
          color: "#EA4335",
          resource: "Eng 2",
        },
        {
          id: "p13",
          name: "Documentation",
          duration: 4,
          color: "#673AB7",
          resource: "Eng 2",
        },
      ],
    },
  ]);

  const resources = [
    { id: "r1", name: "Tech 1", color: "#03A9F4", capacity: 40 },
    { id: "r2", name: "Tech 2", color: "#03A9F4", capacity: 40 },
    { id: "r3", name: "Eng 1", color: "#009688", capacity: 40 },
    { id: "r4", name: "Eng 2", color: "#009688", capacity: 40 },
    { id: "r5", name: "HVAC Spec", color: "#8BC34A", capacity: 30 },
    { id: "r6", name: "Elec 1", color: "#E91E63", capacity: 40 },
    { id: "r7", name: "Elec 2", color: "#9C27B0", capacity: 40 },
  ];

  const [viewMode, setViewMode] = useState("process"); // process, resource, calendar
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProcess, setSelectedProcess] = useState(null);

  // Filter work orders based on status and search term
  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesStatus = filterStatus === "All" || wo.status === filterStatus;
    const matchesSearch =
      wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle resource reassignment
  const handleResourceChange = (workOrderId, processId, newResource) => {
    setWorkOrders((prevWorkOrders) => {
      return prevWorkOrders.map((wo) => {
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
      });
    });

    setSelectedProcess(null);
  };

  // Calculate resource utilization
  const calculateUtilization = (resourceName) => {
    let totalHours = 0;

    workOrders.forEach((wo) => {
      wo.processes.forEach((process) => {
        if (process.resource === resourceName) {
          totalHours += process.duration;
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
        return "secondary";
      case "Completed":
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#f5f5f5",
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
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
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

            <IconButton>
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
            {filteredWorkOrders.map((workOrder) => (
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
                        {workOrder.id}: {workOrder.title}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mt: 0.5,
                        }}>
                        <Typography variant="body2" color="text.secondary">
                          Due: {workOrder.dueDate}
                        </Typography>
                        <Chip
                          label={workOrder.priority}
                          size="small"
                          color={getPriorityColor(workOrder.priority)}
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
                  <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #f5f5f5" }}>
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
                          (sum, p) => sum + p.duration,
                          0
                        );
                        const width = `${
                          (process.duration / totalDuration) * 100
                        }%`;

                        return (
                          <Box
                            key={process.id}
                            sx={{
                              width: width,
                              bgcolor: process.color,
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

                  {/* Resource Allocation Bar */}
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
                          (sum, p) => sum + p.duration,
                          0
                        );
                        const width = `${
                          (process.duration / totalDuration) * 100
                        }%`;
                        const resourceColor =
                          resources.find((r) => r.name === process.resource)
                            ?.color || "#9E9E9E";

                        return (
                          <Box
                            key={process.id}
                            sx={{
                              width: width,
                              bgcolor: resourceColor,
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
                            title={`${process.name} - ${process.resource}`}
                            onClick={() =>
                              setSelectedProcess({
                                workOrderId: workOrder.id,
                                processId: process.id,
                                name: process.name,
                                currentResource: process.resource,
                              })
                            }>
                            {process.resource}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
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
                          wo.processes
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
                                      {wo.id}
                                    </Typography>
                                    <Typography variant="caption">
                                      {process.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary">
                                      ({process.duration}h)
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
      </Container>
    </Box>
  );
};

export default ResourcePlanningApp;
