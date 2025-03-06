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
import {
  setDoc,
  doc,
  Timestamp,
  getDoc,
  getDocs,
  writeBatch,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import PropTypes from "prop-types";
import { resources } from "../../data/data";
import {
  processTemplatesByType,
  generateProcessesFromTemplate,
} from "../../data/data";

const ImportOrdersDialog = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [progress, setProgress] = React.useState(0);

  dayjs.extend(customParseFormat);

  /* const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const createNewDocument = async (result) => {
      const docRef = doc(db, "newOrders", result.No);
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
        notes: result.Notes || "",
        state: result.State || "",
        updated: Timestamp.fromDate(new Date()),
      });
    };

    const updateExistingDocument = async (result, docSnap) => {
      const updates = {};
      if (docSnap.data().status !== result.Status) {
        updates.status = result.Status;
      }
      if (
        docSnap.data().start.toDate().getTime() !==
        dayjs(result.StartingDateTime, "DD-MM-YYYY").toDate().getTime()
      ) {
        updates.start = Timestamp.fromDate(
          dayjs(result.StartingDateTime, "DD-MM-YYYY").toDate()
        );
      }
      if (
        docSnap.data().end.toDate().getTime() !==
        dayjs(result.EndingDateTime, "DD-MM-YYYY").toDate().getTime()
      ) {
        updates.end = Timestamp.fromDate(
          dayjs(result.EndingDateTime, "DD-MM-YYYY").toDate()
        );
      }
      if (
        docSnap.data().quantity !== result.Quantity &&
        result.Quantity !== null
      ) {
        updates.quantity = result.Quantity;
      }
      if (Object.keys(updates).length > 0) {
        // console.log(`Updating document ${docSnap.id} with updated:`, updates);
        await updateDoc(docSnap.ref, updates);
      }
    };

    try {
      results.forEach(async (result) => {
        const docRef = doc(db, "newOrders", result.No);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await createNewDocument(result);
        } else {
          await updateExistingDocument(result, docSnap);
        }
      });
      await Promise.all(results.map(() => Promise.resolve()));
      toast.success("Orders submitted successfully");
    } catch (error) {
      console.error("Error submitting orders:", error);
      toast.error("Error submitting orders", error);
    } finally {
      setLoading(false);
    }
  }; */

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const createNewDocument = async (result) => {
      // Create the work order document
      const workOrderId = result.No;
      const docRef = doc(db, "newOrders", workOrderId);

      // Format the dates
      const startDate = dayjs(result.StartingDateTime, "DD-MM-YYYY").toDate();
      const endDate = dayjs(result.EndingDateTime, "DD-MM-YYYY").toDate();

      // Create the work order object
      const workOrder = {
        orderNumber: result.No,
        id: `WO-${result.No}`, // Standardize ID format if needed
        description: result.Description,
        partNo: result.SourceNo,
        quantity: result.Quantity,
        start: Timestamp.fromDate(startDate),
        end: Timestamp.fromDate(endDate),
        dueDate: Timestamp.fromDate(endDate), // Use end date as due date by default
        status: result.Status,
        priority: determinePriority(result), // Add a helper function for this
        notes: result.Notes || "",
        state: result.State || "",
        updated: Timestamp.fromDate(new Date()),
      };

      // Save the work order
      await setDoc(docRef, workOrder);

      // Generate processes for this work order
      const processes = generateProcessesFromTemplate(
        workOrderId,
        result.State || "DEFAULT",
        startDate
      );

      // Save each process
      const batch = writeBatch(db);
      processes.forEach((process) => {
        const processRef = doc(collection(db, "processes"));
        batch.set(processRef, process);
      });

      // Commit the processes batch
      await batch.commit();
    };

    const updateExistingDocument = async (result, docSnap) => {
      const updates = {};
      if (docSnap.data().status !== result.Status) {
        updates.status = result.Status;
      }
      if (
        docSnap.data().start.toDate().getTime() !==
        dayjs(result.StartingDateTime, "DD-MM-YYYY").toDate().getTime()
      ) {
        updates.start = Timestamp.fromDate(
          dayjs(result.StartingDateTime, "DD-MM-YYYY").toDate()
        );
      }
      if (
        docSnap.data().end.toDate().getTime() !==
        dayjs(result.EndingDateTime, "DD-MM-YYYY").toDate().getTime()
      ) {
        updates.end = Timestamp.fromDate(
          dayjs(result.EndingDateTime, "DD-MM-YYYY").toDate()
        );
      }
      if (
        docSnap.data().quantity !== result.Quantity &&
        result.Quantity !== null
      ) {
        updates.quantity = result.Quantity;
      }

      if (Object.keys(updates).length > 0) {
        // Update the work order
        await updateDoc(docSnap.ref, updates);

        // If dates changed, update process timing
        if (updates.start || updates.end) {
          await updateProcessDates(result.No, updates);
        }
      }
    };

    // Helper function to update process dates if work order dates change
    const updateProcessDates = async (workOrderId, updates) => {
      const processesQuery = query(
        collection(db, "processes"),
        where("workOrderId", "==", workOrderId)
      );

      const processesSnapshot = await getDocs(processesQuery);

      if (!processesSnapshot.empty) {
        // If start date changed, recalculate process start/end days
        if (updates.start) {
          const batch = writeBatch(db);
          processesSnapshot.docs.forEach((doc) => {
            const process = doc.data();
            // Only update dates for processes that haven't started yet
            if (process.status === "Pending") {
              batch.update(doc.ref, {
                // Update any date-related fields as needed
              });
            }
          });
          await batch.commit();
        }
      }
    };

    // Helper to determine priority based on order information
    const determinePriority = (order) => {
      // Implement your logic to determine priority
      // For example, based on deadline, customer, or order type
      if (order.State === "URGENT") return "High";
      // Add more logic as needed
      return "Medium"; // Default priority
    };

    try {
      // First, ensure all resources are in the database (only need to do this once)
      const resourcesSnapshot = await getDocs(collection(db, "resources"));
      if (resourcesSnapshot.empty) {
        const batch = writeBatch(db);
        resources.forEach((resource) => {
          batch.set(doc(db, "resources", resource.id), resource);
        });
        await batch.commit();
      }

      // Process each result
      for (const result of results) {
        const docRef = doc(db, "newOrders", result.No);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await createNewDocument(result);
        } else {
          await updateExistingDocument(result, docSnap);
        }
      }

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
