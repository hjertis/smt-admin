// eslint-disable-next-line no-unused-vars
import React from "react";
import { Box, Typography } from "@mui/material";
import useFirebase from "../../hooks/useFirebase";
import Punchclock from "./Punchclock";

export default function EmployeeList() {
  const employees = [];
  const { data } = useFirebase("employees");

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
              {employees.map((employee, index) => (
                <Box key={index}>
                  {employee.firstName} {employee.lastName} -{" "}
                  {employee.timeResource} minutes
                  <Punchclock employeeId={employee.id} />
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
