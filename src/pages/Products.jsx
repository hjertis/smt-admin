import { Box, Button, ButtonGroup, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React from "react";
import AddProduct from "./products/AddProduct";
import ImportProducts from "./products/ImportProducts";
import useFirebase from "../hooks/useFirebase";
import { columns } from "./products/columns";
import EditProductDialog from "./products/EditProductDialog";

const Products = () => {
  const [openAddProduct, setOpenAddProduct] = React.useState(false);
  const [openImportProducts, setOpenImportProducts] = React.useState(false);
  const { data, error, loading } = useFirebase("products");

  const toggleAddProduct = () => {
    setOpenAddProduct(!openAddProduct);
  };

  const toggleImportProducts = () => {
    setOpenImportProducts(!openImportProducts);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <ButtonGroup variant="contained" sx={{ mb: 2 }}>
            <Button onClick={toggleAddProduct}>Add Product</Button>
            <Button onClick={toggleImportProducts}>Import Products</Button>
          </ButtonGroup>
        </Grid>
        <Grid item>
          <DataGrid
            rows={data || []}
            columns={columns}
            sx={{ width: "75vw", minHeight: "300px" }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            initialState={{
              filter: {
                filterModel: {
                  items: [
                    {
                      field: "status",
                      operator: "isAnyOf",
                      value: ["Released Sales", "R&D", "Prototype"],
                    },
                  ],
                },
              },
            }}
          />
        </Grid>
      </Grid>
      <AddProduct
        openAddProduct={openAddProduct}
        toggleAddProduct={toggleAddProduct}
      />
      <ImportProducts
        openImportProducts={openImportProducts}
        toggleImportProducts={toggleImportProducts}
      />
    </Box>
  );
};

export default Products;
