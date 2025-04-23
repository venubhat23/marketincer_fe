import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
// Material Dashboard 2 React example components
import DashboardLayout from "@/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "@/examples/Navbars/DashboardNavbar";
import MDBox from "@/components/MDBox";
import Grid from "@mui/material/Grid";
import MDTypography from "@/components/MDTypography";
import Card from "@mui/material/Card";
import CalendarComponent from "../../components/CalendarComponent/CalendarComponent";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  IconButton
} from "@mui/material";
import MDButton from "@/components/MDButton";
import AddIcon from "@mui/icons-material/Add";

const index = () => {
 
  const [selectedPages, setSelectedPages] = useState([]);

 

  return (
    <>
      <Box>
        <DashboardLayout>
        
          <MDBox  pb={3}>
            <Box sx={{ display: "flex", marginBottom: "10px", }}>
              <CalendarComponent></CalendarComponent>
            </Box>

          </MDBox>
        </DashboardLayout>
      </Box>
    </>
  );
};

export default index;
