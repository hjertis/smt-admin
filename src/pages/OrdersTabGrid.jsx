import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Example orders – in a real app, you might have many more orders
const initialOrders = [
  {
    id: 1,
    title: "Order A",
    status: "Planned",
    start: "2025-03-01",
    end: "2025-03-03",
  },
  {
    id: 2,
    title: "Order B",
    status: "In Progress",
    start: "2025-03-04",
    end: "2025-03-06",
  },
  {
    id: 3,
    title: "Order C",
    status: "Completed",
    start: "2025-03-07",
    end: "2025-03-10",
  },
  // … more orders
];

const statuses = ["Planned", "In Progress", "Completed"];

function OrdersTabGrid() {
  const [orders, setOrders] = useState(initialOrders);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "title",
      headerName: "Order",
      width: 150,
      renderCell: (params) => {
        // Use the row index within the current filtered data
        // (For simplicity, we use the id as the draggableId)
        return (
          <Draggable
            draggableId={params.row.id.toString()}
            index={params.row.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{ ...provided.draggableProps.style }}>
                {params.value}
              </div>
            )}
          </Draggable>
        );
      },
    },
    { field: "status", headerName: "Status", width: 130 },
    { field: "start", headerName: "Start Date", width: 130 },
    { field: "end", headerName: "End Date", width: 130 },
  ];

  // When a drag ends, update the order's status if it's dropped into a different droppable area (tab)
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    // If dropped in a different tab, update the status accordingly.
    if (destination.droppableId !== source.droppableId) {
      const updatedOrders = orders.map((order) => {
        if (order.id.toString() === draggableId) {
          return { ...order, status: destination.droppableId };
        }
        return order;
      });
      setOrders(updatedOrders);
    }
  };

  return (
    <Box>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="Orders by Status">
        {statuses.map((status, index) => (
          <Tab label={status} key={status} />
        ))}
      </Tabs>
      <DragDropContext onDragEnd={onDragEnd}>
        {statuses.map((status, index) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                role="tabpanel"
                hidden={tabValue !== index}
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ height: 400, width: "100%", marginTop: 16 }}>
                {tabValue === index && (
                  <DataGrid
                    autoHeight
                    rows={orders.filter((order) => order.status === status)}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    disableSelectionOnClick
                  />
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </Box>
  );
}

export default OrdersTabGrid;
