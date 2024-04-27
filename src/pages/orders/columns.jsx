import React from "react";
import { Adjust, EditNote, Timer, TimerOff } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import EditOrderButton from "./EditOrderButton";
import { Link } from "react-router-dom";
import OrderLink from "./OrderLink";
import ChangeStatus from "./components/ChangeStatus";

export const columns = [
  {
    field: "orderNumber",
    headerName: "Order Number",
    minWidth: 100,
    flex: 0.3,
    renderCell: (params) => {
      return <OrderLink order={params.row} />;
    },
  },
  {
    field: "orderDescription",
    headerName: "Order Description",
    minWidth: 250,
    flex: 1,
  },
  {
    field: "orderQuantity",
    headerName: "Quantity",
    minWidth: 50,
    flex: 0.3,
  },
  {
    field: "orderStartDate",
    headerName: "Order Start Date",
    minWidth: 150,
    flex: 0.4,
  },
  {
    field: "orderEndDate",
    headerName: "Order End Date",
    minWidth: 150,
    flex: 0.4,
  },
  {
    field: "editOrder",
    headerName: "Edit",
    minWidth: 50,
    flex: 0.3,
    align: "center",
    renderCell: (params) => {
      return <EditOrderButton params={params} />;
    },
  },
  {
    field: "orderNotes",
    headerName: "Order Notes",
  },
  {
    field: "oldOrderStartDate",
    headerName: "Old Order Start Date",
  },
  {
    field: "oldOrderEndDate",
    headerName: "Old Order End Date",
  },
  {
    field: "status",
    headerName: "Status",
    minWidth: 150,
    flex: 0.5,
    renderCell: (params) => {
      return (
        <div>
          <ChangeStatus order={params.row} />
          {params.row.status}
        </div>
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    minWidth: 150,
    flex: 0.75,
    renderCell: (params) => {
      return (
        <div>
          <IconButton>
            <Timer />
          </IconButton>
          <IconButton>
            <TimerOff />
          </IconButton>
        </div>
      );
    },
  },
];
