import React from "react";
import { Box, Typography } from "@mui/material";
import useFirebase from "../../hooks/useFirebase";

export default function EmployeeList(props) {
  const employees = [];
  const { data, loading, error } = useFirebase("employees");

  return (
    <Box textAlign="center">
      <Typography variant="h5">Employees</Typography>
      <Box>
        {data.length !== 0 && (
          <Box>
            {data.map((document) => {
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
        {data.length === 0 && <Typography>Loading...</Typography>}
      </Box>
    </Box>
  );
}
