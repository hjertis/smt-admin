import React from "react";
import { Link } from "@mui/material";
import OrderActions from "./OrderActions";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";

export default function OrderLink(props) {
  const [open, setOpen] = React.useState(false);
  const [currentOrder, setCurrentOrder] = React.useState(props.order);
  const [employees, setEmployees] = React.useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const toggleClose = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    const getEmployees = async () => {
      const querySnapshot = await getDocs(collection(db, "employees"));
      setEmployees(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    };
    getEmployees();
  }, []);

  return (
    <div>
      <Link onClick={handleOpen}>{props.order.orderNumber}</Link>
      <OrderActions
        open={open}
        order={currentOrder}
        employees={employees}
        toggle={toggleClose}
      />
    </div>
  );
}
