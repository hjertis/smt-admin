import React from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogTitle,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCSVReader } from "react-papaparse";
import { setDoc, doc, Timestamp, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import PropTypes from "prop-types";

const ImportOrdersDialog = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [progress, setProgress] = React.useState(0);

  dayjs.extend(customParseFormat);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const promises = results.map(async (result) => {
        const docRef = doc(db, "newOrders", result.No);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            orderNumber: result.No,
            description: result.Description,
            partNo: result.SourceNo,
            quantity: result.Quantity,
            start: Timestamp.fromDate(
              dayjs(result.StartingDateTime, "DD-MM-YYYY").toDate()
            ),
            end: Timestamp.fromDate(
              dayjs(result.EndingDateTime, "DD-MM-YYYY").toDate()
            ),
            status: result.Status,
            notes: result.Notes || "", // Only update notes if it's a new document
            state: result.State || "",
            updated: Timestamp.fromDate(new Date()),
          });
        } else {
          const updates = {};
          if (docSnap.data().status !== result.Status) {
            updates.status = result.Status;
          }
          if (
            docSnap.data().start !==
            Timestamp.fromDate(
              dayjs(result.StartingDateTime, "DD-MM-YYYY").toDate()
            )
          ) {
            updates.start = Timestamp.fromDate(
              dayjs(result.StartingDateTime, "DD-MM-YYYY").toDate()
            );
          }
          if (
            docSnap.data().end !==
            Timestamp.fromDate(
              dayjs(result.EndingDateTime, "DD-MM-YYYY").toDate()
            )
          ) {
            updates.end = Timestamp.fromDate(
              dayjs(result.EndingDateTime, "DD-MM-YYYY").toDate()
            );
          }
          if (Object.keys(updates).length > 0) {
            await updateDoc(docRef, {
              ...updates,
              updated: Timestamp.fromDate(new Date()),
            });
          }
        }
      });
      await Promise.all(promises);
      toast.success("Orders submitted successfully");
    } catch (error) {
      console.error("Error submitting orders:", error);
      toast.error("Error submitting orders", error);
    } finally {
      setLoading(false);
    }
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

    return () => clearInterval(intervalId);
  }, [loading]);

  // When loading is false, set progress to 100
  React.useEffect(() => {
    if (!loading) {
      setProgress(100);
    }
  }, [loading]);

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={props.addOrder}
      onClose={props.toggleImportOrders}>
      <ToastContainer />
      <DialogTitle>Import Orders</DialogTitle>
      <Stack
        spacing={2}
        useFlexGap
        flexWrap="wrap"
        direction="row"
        sx={{ p: 2 }}>
        <CSVReader
          config={{
            header: true,
          }}
          onUploadAccepted={(results) => {
            setResults(results.data);
            console.log(results.data);
          }}>
          {({ getRootProps, acceptedFile }) => (
            <>
              <TextField
                variant="outlined"
                fullWidth
                value={acceptedFile?.name}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        disabled={loading}
                        {...getRootProps()}>
                        Browse
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
        </CSVReader>
      </Stack>
      {loading && <LinearProgress value={progress} sx={{ mx: 2 }} />}
      <DialogActions>
        <ButtonGroup variant="contained">
          <Button
            color="success"
            disabled={loading}
            onClick={handleOrderSubmit}>
            Import
          </Button>
          <Button
            color="error"
            disabled={loading}
            onClick={props.toggleImportOrders}>
            Cancel
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default ImportOrdersDialog;

ImportOrdersDialog.propTypes = {
  addOrder: PropTypes.bool,
  toggleImportOrders: PropTypes.func,
  orders: PropTypes.array,
};
