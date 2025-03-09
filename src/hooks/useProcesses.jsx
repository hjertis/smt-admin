// hooks/useProcesses.js
import { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  where,
  writeBatch,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { generateProcessesFromTemplate } from "../utils/processTemplate";

export function useProcesses(workOrders) {
  const [workOrdersWithProcesses, setWorkOrdersWithProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch processes for work orders
  useEffect(() => {
    const fetchProcesses = async () => {
      if (!workOrders || workOrders.length === 0) {
        setWorkOrdersWithProcesses([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const workOrdersWithProcesses = await Promise.all(
          workOrders.map(async (wo) => {
            const processesQuery = query(
              collection(db, "processes"),
              where("workOrderId", "==", wo.id)
            );
            const processesSnapshot = await getDocs(processesQuery);
            const processes = processesSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            return { ...wo, processes: processes.length > 0 ? processes : [] };
          })
        );

        setWorkOrdersWithProcesses(workOrdersWithProcesses);
      } catch (err) {
        console.error("Error fetching processes:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProcesses();
  }, [workOrders]);

  // Handle resource assignment
  const assignResource = async (workOrderId, processId, resourceName) => {
    try {
      const processRef = doc(db, "processes", processId);
      await updateDoc(processRef, {
        resource: resourceName,
      });

      // Update local state
      setWorkOrdersWithProcesses((prev) =>
        prev.map((wo) => {
          if (wo.id === workOrderId) {
            return {
              ...wo,
              processes: wo.processes.map((process) => {
                if (process.id === processId) {
                  return { ...process, resource: resourceName };
                }
                return process;
              }),
            };
          }
          return wo;
        })
      );

      return true;
    } catch (error) {
      console.error("Error updating resource assignment:", error);
      return false;
    }
  };

  // Generate processes for a work order
  const generateProcesses = async (workOrder) => {
    try {
      // Generate processes based on work order type
      const processes = generateProcessesFromTemplate(
        workOrder.id,
        workOrder.state || "DEFAULT",
        workOrder.start?.toDate() || new Date()
      );

      // Add processes to Firestore
      const batch = writeBatch(db);
      const newProcesses = [];

      processes.forEach((process) => {
        const processRef = doc(collection(db, "processes"));
        const newProcess = {
          ...process,
          id: processRef.id,
        };
        batch.set(processRef, newProcess);
        newProcesses.push(newProcess);
      });

      await batch.commit();

      // Update local state
      setWorkOrdersWithProcesses((prev) =>
        prev.map((wo) => {
          if (wo.id === workOrder.id) {
            return {
              ...wo,
              processes: newProcesses,
            };
          }
          return wo;
        })
      );

      return true;
    } catch (error) {
      console.error("Error generating processes:", error);
      return false;
    }
  };

  return {
    workOrdersWithProcesses,
    loading,
    error,
    assignResource,
    generateProcesses,
  };
}
