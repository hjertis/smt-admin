import React from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
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

export default function ImportProducts(props) {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [progress, setProgress] = React.useState(0);

  dayjs.extend(customParseFormat);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const promises = results.map(async (result) => {
        const docRef = doc(
          db,
          "products",
          result.SourceNo || result.RoutingNo || result.No
        );
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            partNo: result.RoutingNo || result.SourceNo || result.No,
            description: result.Description,
            status: result.ProductLifeCycleCode,
            updated: Timestamp.fromDate(new Date()),
          });
        }
      });
      await Promise.all(promises);
      toast.success("Products successfully updated");
    } catch (err) {
      toast.error("Error creating order" + err.message);
      console.log(err.message);
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
      </DialogContent>
      <DialogActions>
        <ButtonGroup variant="contained">
          <Button
            color="success"
            disabled={loading}
            onClick={handleProductSubmit}>
            Import
          </Button>
          <Button
            color="error"
            disabled={loading}
            onClick={props.toggleImportProducts}>
            Cancel
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
