// src/utils/statusHelpers.js
/**
 * Get the appropriate MUI color for a status value
 */
export const getStatusColor = (status) => {
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

/**
 * Get the appropriate MUI color for a priority value
 */
export const getPriorityColor = (priority) => {
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
