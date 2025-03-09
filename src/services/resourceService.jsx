// services/resourceService.js
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";

// Update an existing resource
export const updateResource = async (resource) => {
  try {
    await updateDoc(doc(db, "resources", resource.id), resource);
    return true;
  } catch (error) {
    console.error("Error updating resource:", error);
    return false;
  }
};

// Create a new resource
export const createResource = async (resource) => {
  try {
    // Remove the temporary ID if it exists
    const { id, ...resourceData } = resource;

    // Create a new document with auto-generated ID
    const newDocRef = doc(collection(db, "resources"));

    // Set the data with the new ID
    await setDoc(newDocRef, {
      ...resourceData,
      id: newDocRef.id,
    });

    return newDocRef.id;
  } catch (error) {
    console.error("Error creating resource:", error);
    return null;
  }
};

// Delete a resource
export const deleteResource = async (resourceId) => {
  try {
    await deleteDoc(doc(db, "resources", resourceId));
    return true;
  } catch (error) {
    console.error("Error deleting resource:", error);
    return false;
  }
};
