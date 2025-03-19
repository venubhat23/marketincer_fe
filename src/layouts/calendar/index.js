import { Box, Typography } from "@mui/material";
import React from "react";
// Material Dashboard 2 React example components
import DashboardLayout from "@/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "@/examples/Navbars/DashboardNavbar";
import MDBox from "@/components/MDBox";
import Grid from "@mui/material/Grid";
import MDTypography from "@/components/MDTypography";
import Card from "@mui/material/Card";
import CalendarComponent from "../../components/CalendarComponent/CalendarComponent";

const index = () => {
  return (
    <>
      <Box>
        <DashboardLayout>
          <DashboardNavbar />
          <MDBox pt={6} pb={3}>
            <CalendarComponent></CalendarComponent>
          </MDBox>
        </DashboardLayout>
      </Box>
    </>
  );
};

export default index;
