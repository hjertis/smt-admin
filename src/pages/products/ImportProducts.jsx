import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCSVReader } from "react-papaparse";
import { setDoc, doc, Timestamp, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

export default function ImportProducts(props) {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [progress, setProgress] = React.useState(0);

  dayjs.extend(customParseFormat);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
  };

  const { CSVReader } = useCSVReader();

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (loading) {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            return 0;
          }
          return Math.min(prevProgress + 10, 100);
        });
      }
    }, 500);
  }, [loading]);

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={props.openImportProducts}
      onClose={props.toggleImportProducts}>
      <DialogTitle>Import Products</DialogTitle>
      <DialogContent>
        <Stack
          spacing={2}
          useFlexGap
          flexWrap="wrap"
          direction="row"
          sx={{ p: 2 }}></Stack>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
}
