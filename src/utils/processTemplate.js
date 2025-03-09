// src/utils/processTemplates.js
export const processTemplatesByType = {
  HMT: [
    {
      name: "Setup",
      duration: 2,
      color: "#4285F4",
      resourceType: "Technician",
    },
    {
      name: "Assembly",
      duration: 6,
      color: "#FBBC05",
      resourceType: "Technician",
    },
    {
      name: "Inspection",
      duration: 4,
      color: "#34A853",
      resourceType: "Technician",
    },
    {
      name: "Testing",
      duration: 3,
      color: "#EA4335",
      resourceType: "Engineer",
    },
    {
      name: "Close",
      duration: 2,
      color: "#9E9E9E",
      resourceType: "Technician",
    },
  ],

  THT: [
    {
      name: "Setup",
      duration: 2,
      color: "#4285F4",
      resourceType: "Technician",
    },
    {
      name: "Assembly",
      duration: 6,
      color: "#FBBC05",
      resourceType: "Technician",
    },
    {
      name: "Inspection",
      duration: 4,
      color: "#34A853",
      resourceType: "Technician",
    },
    {
      name: "Testing",
      duration: 3,
      color: "#EA4335",
      resourceType: "Engineer",
    },
    {
      name: "Close",
      duration: 2,
      color: "#9E9E9E",
      resourceType: "Technician",
    },
  ],

  SMT: [
    {
      name: "Setup",
      duration: 2,
      color: "#4285F4",
      resourceType: "Technician",
    },
    {
      name: "Assembly",
      duration: 6,
      color: "#FBBC05",
      resourceType: "Technician",
    },
    {
      name: "Inspection",
      duration: 4,
      color: "#34A853",
      resourceType: "Technician",
    },
    {
      name: "Close",
      duration: 2,
      color: "#9E9E9E",
      resourceType: "Technician",
    },
  ],

  // Add templates for other work order types
  DEFAULT: [
    {
      name: "Preparation",
      duration: 2,
      color: "#4285F4",
      resourceType: "Technician",
    },
    {
      name: "Processing",
      duration: 6,
      color: "#FBBC05",
      resourceType: "Technician",
    },
    {
      name: "Testing",
      duration: 2,
      color: "#EA4335",
      resourceType: "Engineer",
    },
    {
      name: "Finalize",
      duration: 2,
      color: "#673AB7",
      resourceType: "Technician",
    },
  ],
};

/**
 * Generate process objects based on a template for a specific work order type
 * @param {string} workOrderId - The ID of the work order
 * @param {string} workOrderType - The type/state of the work order
 * @param {Date} startDate - The start date of the work order
 * @returns {Array} - Array of process objects
 */
export const generateProcessesFromTemplate = (
  workOrderId,
  workOrderType,
  startDate
) => {
  const templates =
    processTemplatesByType[workOrderType] || processTemplatesByType["DEFAULT"];

  let startDay = 0;
  return templates.map((template, index) => {
    const process = {
      id: `${workOrderId}-p${index + 1}`,
      workOrderId,
      name: template.name,
      duration: template.duration,
      color: template.color,
      resource: null, // To be assigned later
      resourceType: template.resourceType,
      startDay,
      endDay: startDay + template.duration,
      status: "Pending",
      timeLogged: 0,
      notes: "",
    };

    startDay += template.duration;
    return process;
  });
};
