import React from "react";
import { columns } from "./columns.jsx";
import { DataGrid } from "@mui/x-data-grid";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

export default function DataTable() {
  const [documents, setDocuments] = React.useState([]);
  const [subCollections, setSubCollections] = React.useState([]);
  const database = collection(db, "orders");
  const data = [];

  documents.forEach((a) => {
    data.push({
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

  React.useEffect(() => {
    const getAllDocs = async () => {
      const docs = await getDocs(database);
      setDocuments(
        docs.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    };
    getAllDocs();
  }, []);

  return (
    <DataGrid
      columns={columns}
      rows={data}
      autoHeight
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
