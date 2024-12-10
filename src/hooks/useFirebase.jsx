import { useContext, useState, useEffect } from "react";
import { FirebaseContext } from "../context/FirebaseContext";
import { collection, getDocs } from "firebase/firestore";

const useFirebase = (collectionName) => {
  const { db } = useContext(FirebaseContext);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, db]);

  return { data, error, loading };
};

export default useFirebase;
