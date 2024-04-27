import React from "react";
import { Link } from "@mui/material";
import OrderActions from "./OrderActions";

export default function OrderLink(props) {
  const [open, setOpen] = React.useState(false);
  const [currentOrder, setCurrentOrder] = React.useState([]);

  const handleOpen = () => {
    setOpen(true);
    setCurrentOrder(props.order);
  };

  const toggleClose = () => {
    setOpen(!open);
  };
  return (
    <div>
      <Link onClick={handleOpen}>{props.order.orderNumber}</Link>
      <OrderActions open={open} toggle={toggleClose} order={currentOrder} />
    </div>
  );
}
