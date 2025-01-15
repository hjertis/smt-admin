import { Box, Grid } from "@mui/material";
import React from "react";
import Cards from "./components/Cards";
import PieCard from "./components/PieCard";
import GaugeCard from "./components/GaugeCard";

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
        <Grid item>
          <PieCard
            size={300}
            title="Defects"
            description="Manage your defects easily from anywhere on the planet with out simple yet powerful platform"
            pie={[
              {
                data: [
                  { value: 10, name: "Defect 1" },
                  { value: 20, name: "Defect 2" },
                  { value: 30, name: "Defect 3" },
                  { value: 40, name: "Defect 4" },
                ],
              },
            ]}
          />
        </Grid>
        <Grid item>
          <PieCard
            size={500}
            title="Defects"
            description="Manage your defects easily from anywhere on the planet with out simple yet powerful platform"
            pie={[
              {
                data: [
                  { value: 10, name: "Defect 1" },
                  { value: 20, name: "Defect 2" },
                  { value: 30, name: "Defect 3" },
                  { value: 40, name: "Defect 4" },
                ],
              },
            ]}
          />
        </Grid>
        <Grid item>
          <PieCard
            size={400}
            title="Defects"
            description="Manage your defects easily from anywhere on the planet with out simple yet powerful platform"
            pie={[
              {
                data: [
                  { value: 10, name: "Defect 1" },
                  { value: 20, name: "Defect 2" },
                  { value: 30, name: "Defect 3" },
                  { value: 40, name: "Defect 4" },
                ],
              },
            ]}
          />
        </Grid>
        <Grid item>
          <GaugeCard
            size={400}
            title="Uptime"
            description="Manage your defects easily from anywhere on the planet with out simple yet powerful platform"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
