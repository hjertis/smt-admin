// src/pages/orders/dialogs/OrderEditDialog.jsx
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
  Grid,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const OrderEditDialog = ({ open, workOrder, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    orderNumber: "",
    description: "",
    partNo: "",
    quantity: "",
    status: "",
    state: "",
    start: null,
    end: null,
    notes: "",
    priority: "Medium",
  });

  // Initialize form when work order changes
  useEffect(() => {
    if (workOrder) {
      setFormData({
        orderNumber: workOrder.orderNumber || "",
        description: workOrder.description || "",
        partNo: workOrder.partNo || "",
        quantity: workOrder.quantity || "",
        status: workOrder.status || "",
        state: workOrder.state || "",
        start: workOrder.start ? dayjs(workOrder.start.toDate()) : null,
        end: workOrder.end ? dayjs(workOrder.end.toDate()) : null,
        notes: workOrder.notes || "",
        priority: workOrder.priority || "Medium",
      });
    }
  }, [workOrder]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (field) => (newDate) => {
    setFormData({
      ...formData,
      [field]: newDate,
    });
  };

  const handleSubmit = () => {
    // Convert dayjs objects back to native Date objects for Firestore
    const updatedWorkOrder = {
      ...workOrder,
      ...formData,
      start: formData.start ? formData.start.toDate() : null,
      end: formData.end ? formData.end.toDate() : null,
    };

    onSave(updatedWorkOrder);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {workOrder
          ? `Edit Work Order: ${workOrder.orderNumber}`
          : "Add New Work Order"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Order Number"
                value={formData.orderNumber}
                onChange={handleChange("orderNumber")}
                fullWidth
                margin="normal"
                disabled={!!workOrder} // Disable editing order number for existing orders
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Part Number"
                value={formData.partNo}
                onChange={handleChange("partNo")}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={formData.description}
                onChange={handleChange("description")}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Quantity"
                value={formData.quantity}
                onChange={handleChange("quantity")}
                type="number"
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={handleChange("priority")}
                  label="Priority">
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange("status")}
                  label="Status">
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="Released">Released</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Finished">Finished</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>State</InputLabel>
                <Select
                  value={formData.state}
                  onChange={handleChange("state")}
                  label="State">
                  <MenuItem value="HMT">HMT</MenuItem>
                  <MenuItem value="SMT">SMT</MenuItem>
                  <MenuItem value="PCBA">PCBA</MenuItem>
                  <MenuItem value="TEST">TEST</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={formData.start}
                  onChange={handleDateChange("start")}
                  slotProps={{
                    textField: { fullWidth: true, margin: "normal" },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={formData.end}
                  onChange={handleDateChange("end")}
                  slotProps={{
                    textField: { fullWidth: true, margin: "normal" },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={formData.notes}
                onChange={handleChange("notes")}
                fullWidth
                multiline
                rows={3}
                margin="normal"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!formData.orderNumber || !formData.description}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderEditDialog;
