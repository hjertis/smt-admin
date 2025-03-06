// components/WorkOrderPlanning/WorkOrderCard.jsx
import React from "react";
import { Box, Paper, Typography, Button, Chip } from "@mui/material";
import { Edit as EditIcon, Info as InfoIcon } from "@mui/icons-material";
import ProcessBar from "./ProcessBar";
import { getStatusColor, getPriorityColor } from "../../utils/statusHelpers";

const WorkOrderCard = ({
  workOrder,
  onGenerateProcesses,
  onCustomizeProcesses,
  onProcessClick,
}) => {
  return (
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Due: {workOrder.end?.toDate().toLocaleDateString() || "N/A"}
            </Typography>
            <Chip
              label={workOrder.priority || "Medium"}
              size="small"
              color={getPriorityColor(workOrder.priority || "Medium")}
            />
            <Chip
              label={workOrder.status}
              size="small"
              color={getStatusColor(workOrder.status)}
            />
          </Box>
        </Box>
        <Box>
          <Button startIcon={<EditIcon />} sx={{ mr: 1 }} size="small">
            Edit
          </Button>
          <Button startIcon={<InfoIcon />} variant="outlined" size="small">
            Details
          </Button>
        </Box>
      </Box>

      {/* Process Bars */}
      {workOrder.processes && workOrder.processes.length > 0 ? (
        <ProcessBar
          processes={workOrder.processes}
          workOrderId={workOrder.id}
          onProcessClick={onProcessClick}
        />
      ) : (
        <Box sx={{ px: 2, py: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            No processes defined for this work order
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onGenerateProcesses(workOrder)}>
              Generate Standard Processes
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => onCustomizeProcesses(workOrder)}>
              Customize Processes
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default WorkOrderCard;
