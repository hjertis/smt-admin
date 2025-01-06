import React from "react";
import { Edit, Print } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import dayjs from "dayjs";
import EditProductDialog from "./EditProductDialog";

export const columns = [
  {
    field: "partNo",
    headerName: "Part No",
    width: 150,
    flex: 0.75,
  },
  {
    field: "description",
    headerName: "Description",
    width: 150,
    flex: 2,
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    flex: 1,
  },
  {
    field: "updated",
    headerName: "Updated",
    width: 150,
    flex: 1,
    renderCell: (params) => {
      return dayjs(params.row.updated.toDate()).format("DD-MM-YYYY");
    },
  },
  {
    field: "editProduct",
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
          <EditProductDialog
            open={openEdit}
            toggleClose={handleOpenEdit}
            product={params.row}
          />
        </>
      );
    },
  },
];
