// components/WorkOrderPlanning/ResourceView.jsx
import React, { useState } from "react";
import { Grid, Button, Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import ResourceCard from "./ResourceCard";
import ResourceEditDialog from "./dialogs/ResourceEditDialog";

const ResourceView = ({
  resources,
  workOrders,
  calculateUtilization,
  onResourceUpdate,
}) => {
  const [editDialog, setEditDialog] = useState({ open: false, resource: null });

  const handleOpenEdit = (resource) => {
    setEditDialog({ open: true, resource });
  };

  const handleCloseEdit = () => {
    setEditDialog({ open: false, resource: null });
  };

  const handleSaveResource = (updatedResource) => {
    onResourceUpdate(updatedResource);
    handleCloseEdit();
  };

  const handleAddResource = () => {
    // Create a new empty resource
    const newResource = {
      id: `r${Date.now()}`, // Temporary ID
      name: "",
      type: "",
      color: "#03A9F4",
      capacity: 40,
      skills: [],
    };
    setEditDialog({ open: true, resource: newResource });
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddResource}>
          Add Resource
        </Button>
      </Box>

      <Grid container spacing={3}>
        {resources.map((resource) => (
          <Grid item xs={12} key={resource.id}>
            <ResourceCard
              resource={resource}
              utilization={calculateUtilization(resource.name)}
              workOrders={workOrders}
              onEdit={handleOpenEdit}
            />
          </Grid>
        ))}
      </Grid>

      <ResourceEditDialog
        open={editDialog.open}
        resource={editDialog.resource}
        onSave={handleSaveResource}
        onClose={handleCloseEdit}
      />
    </>
  );
};

export default ResourceView;
