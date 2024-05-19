import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import { Box, Typography } from "@mui/material";

export default function EmployeeList(props) {
  const [documents, setDocuments] = React.useState([]);
  const database = collection(db, "employees");
  const employees = [];

  React.useEffect(() => {
    const getEmployees = async () => {
      const querySnapshot = await getDocs(database);
      setDocuments(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    };
    getEmployees();
  }, []);

  console.log(employees);

  return (
    <Box textAlign="center">
      <Typography variant="h5">Employees</Typography>
      <Box>
        {documents.length !== 0 && (
          <Box>
            {documents.map((document) => {
              employees.push(document);
            })}
            <Box>
              {employees.map((employee) => (
                <Box>
                  {employee.firstName} {employee.lastName} -{" "}
                  {employee.timeResource} minutes
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {documents.length === 0 && <Typography>Loading...</Typography>}
      </Box>
    </Box>
  );
}
