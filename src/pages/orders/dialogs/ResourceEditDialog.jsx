// components/dialogs/ResourceEditDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  InputAdornment,
} from "@mui/material";
import { BlockPicker } from "react-color";

const ResourceEditDialog = ({ open, resource, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: 40,
    color: "#03A9F4",
    skills: [],
  });

  // Initialize form when resource changes
  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name || "",
        type: resource.type || "",
        capacity: resource.capacity || 40,
        color: resource.color || "#03A9F4",
        skills: resource.skills || [],
      });
    }
  }, [resource]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleColorChange = (color) => {
    setFormData({
      ...formData,
      color: color.hex,
    });
  };

  const handleCapacityChange = (_, newValue) => {
    setFormData({
      ...formData,
      capacity: newValue,
    });
  };

  const handleSkillsChange = (event) => {
    setFormData({
      ...formData,
      skills: event.target.value,
    });
  };

  const handleSubmit = () => {
    onSave({
      ...resource,
      ...formData,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {resource ? `Edit Resource: ${resource.name}` : "Add New Resource"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Resource Name"
            value={formData.name}
            onChange={handleChange("name")}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>Resource Type</InputLabel>
            <Select
              value={formData.type}
              onChange={handleChange("type")}
              label="Resource Type">
              <MenuItem value="Technician">Technician</MenuItem>
              <MenuItem value="Engineer">Engineer</MenuItem>
              <MenuItem value="Specialist">Specialist</MenuItem>
              <MenuItem value="Equipment">Equipment</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography gutterBottom>Weekly Capacity (hours)</Typography>
            <Slider
              value={formData.capacity}
              onChange={handleCapacityChange}
              min={0}
              max={80}
              step={1}
              valueLabelDisplay="auto"
              marks={[
                { value: 0, label: "0h" },
                { value: 40, label: "40h" },
                { value: 80, label: "80h" },
              ]}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>Skills</InputLabel>
            <Select
              multiple
              value={formData.skills}
              onChange={handleSkillsChange}
              label="Skills"
              renderValue={(selected) => selected.join(", ")}>
              <MenuItem value="Assembly">Assembly</MenuItem>
              <MenuItem value="Electrical">Electrical</MenuItem>
              <MenuItem value="Mechanical">Mechanical</MenuItem>
              <MenuItem value="Testing">Testing</MenuItem>
              <MenuItem value="Inspection">Inspection</MenuItem>
              <MenuItem value="Programming">Programming</MenuItem>
              <MenuItem value="Documentation">Documentation</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography gutterBottom>Resource Color</Typography>
            <BlockPicker
              color={formData.color}
              onChange={handleColorChange}
              colors={[
                "#03A9F4",
                "#009688",
                "#8BC34A",
                "#FFEB3B",
                "#FF9800",
                "#E91E63",
                "#9C27B0",
                "#673AB7",
                "#3F51B5",
                "#2196F3",
                "#00BCD4",
                "#4CAF50",
              ]}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!formData.name || !formData.type}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceEditDialog;
