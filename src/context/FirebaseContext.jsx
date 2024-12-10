import { createContext } from "react";
import { db } from "../firebase-config";

const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ db }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseProvider, FirebaseContext };
