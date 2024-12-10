import React from "react";
import { columns } from "./columns.jsx";
import { DataGrid } from "@mui/x-data-grid";
import useFirebase from "../../hooks/useFirebase.jsx";

export default function DataTable() {
  const data2 = [];
  const { data, error, loading } = useFirebase("orders");

  data.forEach((a) => {
    data2.push({
      id: a.id,
      orderNumber: a.orderNumber,
      orderDescription: a.orderDescription,
      orderQuantity: a.orderQuantity,
      orderStartDate: a.orderStartDate.toDate().toLocaleString().split(",")[0],
      orderEndDate: a.orderEndDate.toDate().toLocaleString().split(",")[0],
      orderNotes: a.orderNotes,
      status: a.status,
      Setup: a.Setup,
      Production: a.Production,
      Repair: a.Repair,
      Washing: a.Washing,
      Cutting: a.Cutting,
    });
  });

  return (
    <DataGrid
      columns={columns}
      rows={data2}
      rowSelection={false}
      initialState={{
        columns: {
          columnVisibilityModel: {
            id: false,
            orderNotes: false,
            oldOrderEndDate: false,
            oldOrderStartDate: false,
          },
        },
      }}
      sx={{ width: "75vw", p: 2 }}
    />
  );
}
