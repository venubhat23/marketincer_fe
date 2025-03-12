import { Box, Typography } from "@mui/material";
import React from "react";
// Material Dashboard 2 React example components
import DashboardLayout from "@/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "@/examples/Navbars/DashboardNavbar";
import MDBox from "@/components/MDBox";
import Grid from "@mui/material/Grid";
import MDTypography from "@/components/MDTypography";
import Card from "@mui/material/Card";

const index = () => {
  return (
    <>
      <Box>
        <DashboardLayout>
          <DashboardNavbar />
          <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                  display="flex"
                  justifyContent="center"
                  alignitems="center"
                >
                  <MDTypography variant="h5" color="white">
                    Coming Soon !!!
                  </MDTypography>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </DashboardLayout>
      </Box>
    </>
  );
};

export default index;
