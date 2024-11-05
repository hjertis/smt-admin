import React from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCSVReader } from "react-papaparse";
import { setDoc, doc, addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase-config";

const ImportOrdersDialog = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const promises = results.map((result) => {
        return setDoc(doc(db, "newOrders", result.No), {
          orderNumber: result.No,
          description: result.Description,
          partNo: result.SourceNo,
          quantity: result.Quantity,
          start: result.StartingDateTime,
          end: result.EndingDateTime,
          updated: Date.now().toString(),
        });
      });
      await Promise.all(promises);
      toast.success("Order added successfully");
    } catch (err) {
      toast.error("Error creating order" + err.message);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    csvReader: {
      display: "flex",
      flexDirection: "row",
      marginBottom: 10,
    },
    browseFile: {
      width: "20%",
    },
    acceptedFile: {
      border: "1px solid #ccc",
      height: 45,
      lineHeight: 2.5,
      paddingLeft: 10,
      width: "80%",
    },
    remove: {
      borderRadius: 0,
      padding: "0 20px",
    },
    progressBarBackgroundColor: {
      backgroundColor: "red",
    },
  };

  const { CSVReader } = useCSVReader();

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={props.addOrder}
      onClose={props.toggleImportOrders}
    >
      <ToastContainer />
      <DialogTitle>Import Orders</DialogTitle>
      <Stack
        spacing={2}
        useFlexGap
        flexWrap="wrap"
        direction="row"
        sx={{ p: 2 }}
      >
        <CSVReader
          config={{
            header: true,
          }}
          onUploadAccepted={(results) => {
            setResults(results.data);
          }}
        >
          {({
            getRootProps,
            acceptedFile,
            ProgressBar,
            getRemoveFileProps,
          }) => (
            <>
              <TextField
                variant="outlined"
                fullWidth
                value={acceptedFile?.name}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button variant="contained" {...getRootProps()}>
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
      <DialogActions>
        <ButtonGroup variant="contained">
          <Button color="success" onClick={handleOrderSubmit}>
            Import
          </Button>
          <Button color="error" onClick={props.toggleImportOrders}>
            Cancel
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default ImportOrdersDialog;
