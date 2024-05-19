import { Add } from "@mui/icons-material";
import { Box, Fab, Grid } from "@mui/material";
import React from "react";
import EmployeeList from "./employees/EmployeeList";
import AddEmployeeDialog from "./employees/AddEmployeeDialog";

export default function Employees() {
  const [openAddEmployee, setOpenAddEmployee] = React.useState(false);

  const toggleAddEmployee = () => {
    setOpenAddEmployee(!openAddEmployee);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <EmployeeList />
        </Grid>
      </Grid>
      <Fab
        color="primary"
        aria-label="add-employee"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        onClick={toggleAddEmployee}>
        <Add />
      </Fab>
      <AddEmployeeDialog
        addEmployee={openAddEmployee}
        toggleAddEmployee={toggleAddEmployee}
      />
    </Box>
  );
}
