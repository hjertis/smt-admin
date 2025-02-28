import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, Typography, Divider } from "@mui/material";

const OrdersDraggableList = () => {
  // Sample data for orders
  const initialOrders = [
    {
      id: "1",
      title: "Order A",
      status: "Planned",
      start: "2025-03-01",
      end: "2025-03-03",
    },
    {
      id: "2",
      title: "Order B",
      status: "In Progress",
      start: "2025-03-04",
      end: "2025-03-06",
    },
    {
      id: "3",
      title: "Order C",
      status: "Completed",
      start: "2025-03-07",
      end: "2025-03-10",
    },
    {
      id: "4",
      title: "Order D",
      status: "Planned",
      start: "2025-03-05",
      end: "2025-03-07",
    },
    {
      id: "5",
      title: "Order E",
      status: "In Progress",
      start: "2025-03-08",
      end: "2025-03-10",
    },
  ];

  const statuses = ["Planned", "In Progress", "Completed"];

  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState(0);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverTab, setDragOverTab] = useState(null);

  const handleTabChange = (event, newValue) => {
    if (!draggingId) {
      setActiveTab(newValue);
    }
  };

  const handleDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleTabDragOver = (e, index, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverTab(status);
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain") || draggingId;

    if (!draggedId) return;

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === draggedId ? { ...order, status: targetStatus } : order
      )
    );

    setDraggingId(null);
    setDragOverTab(null);
  };

  const handleTabDrop = (e, status) => {
    handleDrop(e, status);
    // Optionally switch to the tab where the item was dropped
    const tabIndex = statuses.findIndex((s) => s === status);
    if (tabIndex !== -1) {
      setActiveTab(tabIndex);
    }
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverTab(null);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto" }}>
      {/* Tabs - now droppable */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Orders by Status">
          {statuses.map((status, index) => (
            <Tab
              key={status}
              label={status}
              onDragOver={(e) => handleTabDragOver(e, index, status)}
              onDrop={(e) => handleTabDrop(e, status)}
              sx={{
                backgroundColor:
                  dragOverTab === status
                    ? "rgba(25, 118, 210, 0.08)"
                    : "transparent",
                transition: "background-color 0.2s",
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {statuses.map((status, index) => (
        <Box
          key={status}
          role="tabpanel"
          hidden={activeTab !== index}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          sx={{ p: 2 }}
          onDragOver={(e) => handleDragOver(e, status)}
          onDrop={(e) => handleDrop(e, status)}>
          <Paper elevation={2} sx={{ p: 2 }}>
            {/* Header row */}
            <Box display="flex" fontWeight="bold" mb={2}>
              <Box width="10%">ID</Box>
              <Box width="30%">Order</Box>
              <Box width="30%">Start Date</Box>
              <Box width="30%">End Date</Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Data rows */}
            {orders
              .filter((order) => order.status === status)
              .map((order, idx) => (
                <Box
                  key={order.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, order.id)}
                  onDragEnd={handleDragEnd}
                  sx={{
                    display: "flex",
                    p: 1.5,
                    mb: 1,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                    cursor: "move",
                  }}>
                  <Box width="10%">{order.id}</Box>
                  <Box width="30%">{order.title}</Box>
                  <Box width="30%">{order.start}</Box>
                  <Box width="30%">{order.end}</Box>
                </Box>
              ))}

            {/* Empty state */}
            {orders.filter((order) => order.status === status).length === 0 && (
              <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                <Typography variant="body2">
                  No orders in this status. Drag items here.
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default OrdersDraggableList;
