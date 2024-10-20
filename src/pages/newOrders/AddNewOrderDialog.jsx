import React from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCSVReader } from "react-papaparse";

const AddNewOrderDialog = (props) => {
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
      onClose={props.toggleAddNewOrder}>
      <ToastContainer />
      <DialogTitle>Import Orders</DialogTitle>
      <Stack spacing={2} useFlexGap flexWrap="wrap" direction="row">
        <CSVReader
          config={{
            header: true,
          }}
          onUploadAccepted={(results) => {
            console.log(results);
          }}>
          {({
            getRootProps,
            acceptedFile,
            ProgressBar,
            getRemoveFileProps,
          }) => (
            <>
              <div style={styles.csvReader}>
                <button
                  type="button"
                  {...getRootProps()}
                  style={styles.browseFile}>
                  Browse files
                </button>
                <div style={styles.acceptedFile}>
                  {acceptedFile && acceptedFile.name}
                </div>
                <button {...getRemoveFileProps()} style={styles.remove}>
                  Remove
                </button>
              </div>
              <ProgressBar style={styles.progressBarBackgroundColor} />
            </>
          )}
        </CSVReader>
      </Stack>
      <DialogActions>
        <ButtonGroup variant="contained">
          <Button color="success">Import</Button>
          <Button color="warning">Reset</Button>
          <Button color="error">Cancel</Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewOrderDialog;
