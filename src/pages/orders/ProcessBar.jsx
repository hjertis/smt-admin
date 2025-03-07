// components/WorkOrderPlanning/ProcessBar.jsx
import React from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

const ProcessBar = ({
  processes,
  workOrderId,
  resources = [],
  onProcessClick,
}) => {
  // Process steps bar
  return (
    <>
      <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #f5f5f5" }}>
        <Box
          sx={{
            height: 32,
            bgcolor: "#f5f5f5",
            borderRadius: 1,
            display: "flex",
            overflow: "hidden",
          }}>
          {processes.map((process) => {
            const totalDuration = processes.reduce(
              (sum, p) => sum + (p.duration || 0),
              0
            );
            const width =
              totalDuration > 0
                ? `${((process.duration || 0) / totalDuration) * 100}%`
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
          {processes.map((process) => {
            const totalDuration = processes.reduce(
              (sum, p) => sum + (p.duration || 0),
              0
            );
            const width =
              totalDuration > 0
                ? `${((process.duration || 0) / totalDuration) * 100}%`
                : "0%";
            const resourceColor =
              resources.find((r) => r.name === process.resource)?.color ||
              "#9E9E9E";

            return (
              <Box
                key={process.id}
                sx={{
                  width: width,
                  bgcolor: process.resource ? resourceColor : "#e0e0e0",
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
                title={`${process.name} - ${process.resource || "Unassigned"}`}
                onClick={() =>
                  onProcessClick({
                    workOrderId,
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
    </>
  );
};

export default ProcessBar;

ProcessBar.propTypes = {
  processes: PropTypes.array.isRequired,
  workOrderId: PropTypes.string.isRequired,
  resources: PropTypes.array,
  onProcessClick: PropTypes.func.isRequired,
};
