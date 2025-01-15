import { createContext } from "react";
import { db } from "../firebase-config";
import PropTypes from "prop-types";

const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ db }}>
      {children}
    </FirebaseContext.Provider>
  );
};

FirebaseProvider.propTypes = {
  children: PropTypes.any,
};

export { FirebaseProvider, FirebaseContext };
