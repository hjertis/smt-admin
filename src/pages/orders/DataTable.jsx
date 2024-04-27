import React from "react";
import { Box, Typography } from "@mui/material";
import { columns } from "./columns.jsx";
import { DataGrid } from "@mui/x-data-grid";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

export default function DataTable() {
  const [documents, setDocuments] = React.useState([]);
  const database = collection(db, "orders");
  const data = [];

  const padTo2Digits = (num) => {
    return num.toString().padStart(2, "0");
  };

  const convertMsToHM = (ms) => {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = seconds >= 30 ? minutes + 1 : minutes;
    minutes = minutes % 60;
    //hours = hours % 24; //only for when it's below 24 hours, 26:30 will show as 02:30!

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
  };

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
      oldOrderEndDate: a.orderEndDate,
      oldOrderStartDate: a.orderStartDate,
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
    />
  );
}
