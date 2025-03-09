// hooks/useWorkOrders.js
import { useState, useEffect } from "react";
import { collection, query, getDocs, where, orderBy } from "firebase/firestore";
import { db } from "../firebase-config";

export function useWorkOrders(statusFilter = null) {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
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

      setWorkOrders(workOrdersData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching work orders:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, [statusFilter]);

  return {
    workOrders,
    setWorkOrders,
    loading,
    error,
    refreshWorkOrders: fetchWorkOrders,
  };
}
