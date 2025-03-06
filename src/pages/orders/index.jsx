// components/WorkOrderPlanning/index.jsx
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
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";

import WorkOrderCard from "./WorkOrderCard";
import ResourceView from "./ResourceView";
import ResourceSelectionDialog from "../dialogs/ResourceSelectionDialog";
import ProcessTemplateDialog from "../dialogs/ProcessTemplateDialog";

import { useWorkOrders } from "../../hooks/useWorkOrders";
import { useResources } from "../../hooks/useResources";
import { useProcesses } from "../../hooks/useProcesses";

const WorkOrderPlanning = () => {
  const [viewMode, setViewMode] = useState("process");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [processDialog, setProcessDialog] = useState({
    open: false,
    workOrder: null,
    processes: [],
  });

  // Fetch work orders and resources
  const {
    workOrders,
    loading: workOrdersLoading,
    error: workOrdersError,
    refreshWorkOrders,
  } = useWorkOrders(filterStatus);
  const {
    resources,
    loading: resourcesLoading,
    error: resourcesError,
  } = useResources();
  const {
    workOrdersWithProcesses,
    loading: processesLoading,
    error: processesError,
    assignResource,
    generateProcesses,
  } = useProcesses(workOrders);

  // Filter work orders based on search term
  const filteredWorkOrders = workOrdersWithProcesses.filter((wo) => {
    const matchesSearch =
      wo.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate resource utilization
  const calculateUtilization = (resourceName) => {
    let totalHours = 0;

    workOrdersWithProcesses.forEach((wo) => {
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

  // Handle resource selection
  const handleResourceChange = async (workOrderId, processId, newResource) => {
    await assignResource(workOrderId, processId, newResource);
    setSelectedProcess(null);
  };

  // Handle template editing
  const handleTemplateEdit = (workOrder) => {
    import("../../utils/processTemplates").then(
      ({ generateProcessesFromTemplate }) => {
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
      }
    );
  };

  // Loading state
  const isLoading = workOrdersLoading || resourcesLoading || processesLoading;
  if (isLoading) {
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
  const error = workOrdersError || resourcesError || processesError;
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

            <IconButton onClick={refreshWorkOrders}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Resource Selection Dialog */}
      <ResourceSelectionDialog
        open={selectedProcess !== null}
        process={selectedProcess}
        resources={resources}
        calculateUtilization={calculateUtilization}
        onResourceSelect={handleResourceChange}
        onClose={() => setSelectedProcess(null)}
      />

      {/* Process Template Dialog */}
      <ProcessTemplateDialog
        open={processDialog.open}
        workOrder={processDialog.workOrder}
        processes={processDialog.processes}
        onSave={(processes) => {
          // Save the processes
          // ...implementation
        }}
        onClose={() =>
          setProcessDialog({ open: false, workOrder: null, processes: [] })
        }
      />

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
                  <WorkOrderCard
                    workOrder={workOrder}
                    onGenerateProcesses={generateProcesses}
                    onCustomizeProcesses={handleTemplateEdit}
                    onProcessClick={setSelectedProcess}
                  />
                </Grid>
              ))
            )}
          </Grid>
        )}

        {viewMode === "resource" && (
          <ResourceView
            resources={resources}
            workOrders={workOrdersWithProcesses}
            calculateUtilization={calculateUtilization}
          />
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

export default WorkOrderPlanning;
