// src/services/orderService.js
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase-config";

// Update an existing work order
export const updateWorkOrder = async (workOrder) => {
  try {
    // Prepare data for Firestore
    const updateData = {
      orderNumber: workOrder.orderNumber,
      description: workOrder.description,
      partNo: workOrder.partNo,
      quantity: workOrder.quantity,
      status: workOrder.status,
      state: workOrder.state,
      notes: workOrder.notes,
      priority: workOrder.priority,
      updated: Timestamp.now(),
    };

    // Convert dates to Firestore Timestamps
    if (workOrder.start) {
      updateData.start = Timestamp.fromDate(workOrder.start);
    }
    if (workOrder.end) {
      updateData.end = Timestamp.fromDate(workOrder.end);
    }

    // Update document in Firestore
    const docId = workOrder.id.startsWith("WO-")
      ? workOrder.id.substring(3)
      : workOrder.id;
    await updateDoc(doc(db, "newOrders", docId), updateData);
    return true;
  } catch (error) {
    console.error("Error updating work order:", error);
    return false;
  }
};
