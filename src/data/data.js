export const allTasks = [
  "Setup",
  "Production",
  "Repair",
  "Rework",
  "Manual Assembly",
  "Washing",
  "Testing",
  "Cutting",
]; // tasks available to choose from

export const allStates = [
  "SMT",
  "THT",
  "HMT",
  "CUT",
  "TEST",
  "WASH",
  "PACK",
  "DONE",
  "REP",
  "PROT",
]; // states for jobs

export const punchclockLimit = -10; // limits how many punchclock entries are shown in EmployeeInfo.jsx

export const resources = [
  {
    id: "r1",
    name: "Worker 1",
    type: "Technician",
    color: "#03A9F4",
    capacity: 40,
    skills: ["SMT", "Assembly", "Testing"],
  },
  {
    id: "r2",
    name: "Worker 2",
    type: "Technician",
    color: "#03A9F4",
    capacity: 40,
    skills: ["SMT", "Inspection"],
  },
  {
    id: "r3",
    name: "Eng 1",
    type: "Engineer",
    color: "#009688",
    capacity: 40,
    skills: ["Design", "Testing"],
  },
  {
    id: "r4",
    name: "Eng 2",
    type: "Engineer",
    color: "#009688",
    capacity: 40,
    skills: ["Development", "Testing"],
  },
  {
    id: "r5",
    name: "HVAC Spec",
    type: "Specialist",
    color: "#8BC34A",
    capacity: 30,
    skills: ["HVAC", "Installation"],
  },
  {
    id: "r6",
    name: "Elec 1",
    type: "Electrician",
    color: "#E91E63",
    capacity: 40,
    skills: ["Electrical", "Installation"],
  },
  {
    id: "r7",
    name: "Elec 2",
    type: "Electrician",
    color: "#9C27B0",
    capacity: 40,
    skills: ["Electrical", "Maintenance"],
  },
];

export const processTemplatesByType = {
  HMT: [
    {
      name: "Setup",
      duration: 2,
      color: "#4285F4",
      resourceType: "Technician",
    },
    {
      name: "Inspection",
      duration: 4,
      color: "#34A853",
      resourceType: "Technician",
    },
    {
      name: "Assembly",
      duration: 6,
      color: "#FBBC05",
      resourceType: "Technician",
    },
    {
      name: "Testing",
      duration: 3,
      color: "#EA4335",
      resourceType: "Engineer",
    },
    {
      name: "Documentation",
      duration: 3,
      color: "#673AB7",
      resourceType: "Technician",
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
      name: "Preparation",
      duration: 2,
      color: "#4285F4",
      resourceType: "Technician",
    },
    {
      name: "Programming",
      duration: 3,
      color: "#34A853",
      resourceType: "Engineer",
    },
    {
      name: "Production",
      duration: 8,
      color: "#FBBC05",
      resourceType: "Technician",
    },
    {
      name: "Quality Check",
      duration: 2,
      color: "#EA4335",
      resourceType: "Technician",
    },
    {
      name: "Packaging",
      duration: 1,
      color: "#673AB7",
      resourceType: "Technician",
    },
  ],

  // Add more templates for other work order types
  DEFAULT: [
    {
      name: "Setup",
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
    { name: "Review", duration: 2, color: "#EA4335", resourceType: "Engineer" },
    {
      name: "Finalize",
      duration: 2,
      color: "#673AB7",
      resourceType: "Technician",
    },
  ],
};

// Helper function to generate process objects from templates
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
