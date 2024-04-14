import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import Cards from "./components/Cards";

const Home = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <Cards
            title="Tasks"
            description="Manage your tasks easily from anywhere on the planet with out simple yet powerful platform"
            sparkline={[1, 3, 4, 6, 2, 3, 1, 7, 9]}
            plotType="bar"
            size={300}
          />
        </Grid>
        <Grid item>
          <Cards
            title="Tasks"
            description="Manage your tasks easily from anywhere on the planet with out simple yet powerful platform"
            sparkline={[1, 3, 4, 6, 2, 3, 1, 7, 9]}
            size={400}
          />
        </Grid>
        <Grid item>
          <Cards
            title="Tasks"
            description="Manage your tasks easily from anywhere on the planet with out simple yet powerful platform"
            sparkline={[1, 3, 4, 6, 2, 3, 1, 7, 9]}
            plotType="bar"
            size={200}
          />
        </Grid>
        <Grid item>
          <Cards
            title="Tasks"
            description="Manage your tasks easily from anywhere on the planet with out simple yet powerful platform"
            sparkline={[1, 3, 4, 6, 2, 3, 1, 7, 9]}
            size={800}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
