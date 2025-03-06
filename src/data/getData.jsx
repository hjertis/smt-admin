// hooks/useWorkOrdersData.js
import { useState, useEffect } from "react";
import { collection, query, getDocs, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export const useWorkOrdersData = (statusFilter = null) => {
  const [workOrders, setWorkOrders] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch resources first
        const resourcesSnapshot = await getDocs(collection(db, "resources"));
        const resourcesData = resourcesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResources(resourcesData);

        // Create work orders query
        let workOrdersQuery;
        if (statusFilter && statusFilter !== "All") {
          workOrdersQuery = query(
            collection(db, "newOrders"),
            where("status", "==", statusFilter),
            orderBy("start", "asc")
          );
        } else {
          workOrdersQuery = query(
            collection(db, "newOrders"),
            orderBy("start", "asc")
          );
        }

        // Fetch work orders
        const workOrdersSnapshot = await getDocs(workOrdersQuery);
        const workOrdersData = workOrdersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // For each work order, fetch its processes
        const workOrdersWithProcesses = await Promise.all(
          workOrdersData.map(async (wo) => {
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

        setWorkOrders(workOrdersWithProcesses);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statusFilter]);

  return { workOrders, resources, loading, error };
};
