import React from "react";
import { Edit, Print } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import EditNewOrders from "./EditNewOrders";
import dayjs from "dayjs";
import PrintOrder from "./PrintOrder";
import { useReactToPrint } from "react-to-print";

export const columns = [
  {
    field: "orderNumber",
    headerName: "Order Number",
    width: 150,
    flex: 0.75,
  },
  { field: "description", headerName: "Description", width: 150, flex: 2 },
  { field: "partNo", headerName: "Part No", width: 150, flex: 0.75 },
  { field: "quantity", headerName: "Quantity", width: 150, flex: 0.5 },
  {
    field: "start",
    headerName: "Start",
    width: 150,
    flex: 1,
    renderCell: (params) =>
      dayjs(params.row.start.toDate()).format("DD-MM-YYYY"),
  },
  {
    field: "end",
    headerName: "End",
    width: 150,
    flex: 1,
    renderCell: (params) => dayjs(params.row.end.toDate()).format("DD-MM-YYYY"),
  },
  { field: "status", headerName: "Status", width: 150, flex: 1 },
  {
    field: "editOrder",
    headerName: "Edit",
    width: 50,
    flex: 0.3,
    align: "center",
    renderCell: (params) => {
      const [openEdit, setOpenEdit] = React.useState(false);

      const handleOpenEdit = () => {
        setOpenEdit(!openEdit);
      };

      return (
        <>
          <IconButton onClick={handleOpenEdit}>
            <Edit />
          </IconButton>
          <EditNewOrders
            open={openEdit}
            toggleClose={handleOpenEdit}
            order={params.row}
          />
        </>
      );
    },
  },
  {
    field: "printOrder",
    headerName: "Print",
    width: 50,
    flex: 0.3,
    align: "center",

    renderCell: (params) => {
      const contentRef = React.useRef();
      const handlePrint = useReactToPrint({ contentRef });
      return (
        <>
          <IconButton onClick={() => handlePrint()}>
            <Print />
          </IconButton>
          <PrintOrder ref={contentRef} order={params.row} />
        </>
      );
    },
  },
];
