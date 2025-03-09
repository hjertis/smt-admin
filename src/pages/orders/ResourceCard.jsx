// components/WorkOrderPlanning/ResourceCard.jsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

const ResourceCard = ({ resource, utilization, workOrders, onEdit }) => {
  const utilizationColor =
    utilization > 90 ? "error" : utilization > 70 ? "warning" : "success";

  const assignedProcesses = workOrders.flatMap((wo) =>
    (wo.processes || []).filter((p) => p.resource === resource.name)
  );

  return (
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
          <Typography variant="subtitle1">{resource.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({resource.type})
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
          <IconButton onClick={() => onEdit(resource)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 2, minHeight: 64 }}>
        {resource.skills && resource.skills.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Skills:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {resource.skills.map((skill) => (
                <Chip key={skill} label={skill} size="small" />
              ))}
            </Box>
          </Box>
        )}

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Assignments:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {assignedProcesses.length > 0 ? (
            assignedProcesses.map((process) => {
              const workOrder = workOrders.find((wo) =>
                wo.processes?.some((p) => p.id === process.id)
              );
              return (
                <Chip
                  key={process.id}
                  label={
                    <Box
                      sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                      <Typography variant="caption" fontWeight="bold">
                        {workOrder?.orderNumber}
                      </Typography>
                      <Typography variant="caption">{process.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
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
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              No processes assigned to this resource
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ResourceCard;
