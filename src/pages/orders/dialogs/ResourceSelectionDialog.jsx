// src/pages/orders/dialogs/ResourceSelectionDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from "@mui/material";
import { FiberManualRecord as DotIcon } from "@mui/icons-material";

const ResourceSelectionDialog = ({
  open,
  process,
  resources,
  calculateUtilization,
  onResourceSelect,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select Resource</DialogTitle>
      <DialogContent>
        <List sx={{ maxHeight: 300, overflow: "auto" }}>
          {resources.map((resource) => (
            <ListItem
              key={resource.id}
              button
              onClick={() =>
                onResourceSelect(
                  process?.workOrderId,
                  process?.processId,
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
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceSelectionDialog;
