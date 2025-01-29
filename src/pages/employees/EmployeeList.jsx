// eslint-disable-next-line no-unused-vars
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import useFirebase from "../../hooks/useFirebase";
import EmployeeInfo from "./EmployeeInfo";

export default function EmployeeList() {
  const [openInfo, setOpenInfo] = React.useState(false);
  const [currentEmployee, setCurrentEmployee] = React.useState({});
  const employees = [];
  const { data } = useFirebase("employees");

  const toggleInfo = () => {
    setOpenInfo(!openInfo);
  };

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
                  <Button
                    onClick={() => {
                      setCurrentEmployee(employee);
                      toggleInfo();
                    }}>
                    Info
                  </Button>
                  <EmployeeInfo
                    open={openInfo}
                    toggleClose={toggleInfo}
                    data={currentEmployee}
                  />
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
