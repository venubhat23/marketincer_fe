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
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);

  const handleAvatarClick = (pageId) => {
    setSelectedPages((prevSelected) =>
      prevSelected.includes(pageId)
        ? prevSelected.filter((id) => id !== pageId) // Deselect if already selected
        : [...prevSelected, pageId] // Select if not selected
    );
  };
  const fetchAccountsFromAPI = async () => {

    setLoading(true);
    const token = localStorage.getItem("userToken");
    try {
      // Fetch the accounts from the dummy API
      const response = await fetch(
        `https://marketincer-2.onrender.com/api/v1/social_pages/connected_pages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

      }
      );

      const data = await response.json();
      setPages(data.data.accounts); // Store the fetched accounts in the state

    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchAccountsFromAPI();

  }, []);
  return (
    <>
      <Box>
        <DashboardLayout>
        
          <MDBox  pb={3}>
            <Box sx={{ display: "flex", marginBottom: "10px", }}>
              <Box
                sx={{
                  width: "15%",
                  backgroundColor: "rgba(255, 255, 255)",
                  borderRadius: "12px",
                  marginTop: "91px"
                }}
                role="presentation"
                className="customClassname"
              >
                {/* Search Field */}
                <TextField
                  id="outlined-search"
                  sx={{ margin: "15px", width: "-webkit-fill-available" }}
                  label="Search field"
                  type="search"
                />

                <Box sx={{ mt: 2, margin: "15px" }}>
                  {pages.map((page) => (
                    <Box
                      key={page.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        mb: 1,
                        fontSize: "12px",
                        cursor: "pointer", // Makes avatars clickable
                      }}
                      onClick={() => handleAvatarClick(page.social_id)}
                      >
                      <Box sx={{ position: "relative" }}>
                        {/* Avatar */}
                        <Avatar
                          src={page.page_info.picture.data.url}
                          alt={page.name}
                          sx={{ width: 40, height: 40, border: "none" }}
                        />
                        {/* Check Icon Overlay */}
                        {selectedPages.includes(page.social_id) && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: "-2px",
                              right: "-7px",
                              background: "white",
                              borderRadius: "50%",
                              width: 20,
                              height: 20,
                              alignItems: "center",
                            }}
                          >
                            <CheckCircleOutlineIcon
                              sx={{
                                color: "#5ebfa6",
                                fontSize: 20,
                                width: 20,
                                height: 20
                              }}
                            />
                          </Box>


                        )}
                      </Box>

                      {/* Page Name */}
                      <Typography
                        variant="body1"
                        className="hover-effect"
                        sx={{
                          fontSize: "14px",
                          color: selectedPages.includes(page.social_id) ? "#5ebfa6" : "inherit",
                          fontWeight: selectedPages.includes(page.social_id) ? "bold" : "normal",
                          transition: "color 0.3s ease-in-out",
                          whiteSpace: "nowrap", // ✅ Ensures text does not wrap
                          overflow: "hidden", // ✅ Hides overflow text
                          textOverflow: "ellipsis", // ✅ Shows '...' when text overflows
                          maxWidth: "150px", // ✅ Adjust as per layout requirements
                          "&:hover": {
                            color: "#5ebfa6",
                            overflow: "hidden", // ✅ Show full text on hover (Optional)
                            whiteSpace: "nowrap", // ✅ Allow text wrapping on hover (Optional)
                          },
                        }}
                      >
                        {page.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                {/* Bottom Section with Add Button */}
                <Box sx={{ bottom: "15px", width: "100%" }}>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <MDButton
                      variant="outlined"
                      color="info"
                      sx={{ margin: "0.09375rem 1rem", mb: 2, mr: 0, ml: 0 }}
                      onClick={() => {
                        window.location.href = "/social";
                      }}
                      to="/social" // Define the destination URL
                    >
                      <AddIcon /> Add Account
                    </MDButton>
                  </Box>
                </Box>
              </Box>
              <CalendarComponent selectedPages={selectedPages}></CalendarComponent>
            </Box>

          </MDBox>
        </DashboardLayout>
      </Box>
    </>
  );
};

export default index;
