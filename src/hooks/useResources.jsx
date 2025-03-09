// hooks/useResources.js
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

export function useResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resourcesSnapshot = await getDocs(collection(db, "resources"));
        const resourcesData = resourcesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResources(resourcesData);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return { resources, loading, error };
}
