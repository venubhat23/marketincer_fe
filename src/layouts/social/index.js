import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Avatar, Divider } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import { Twitter } from "@mui/icons-material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import GoogleIcon from '@mui/icons-material/Google';
import TelegramIcon from '@mui/icons-material/Telegram';
import DashboardLayout from "@/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "@/examples/Navbars/DashboardNavbar";
import MDButton from "@/components/MDButton";
import AddIcon from "@mui/icons-material/Add";
import Skeleton from "@mui/material/Skeleton";

const Index = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram");
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchAccountsFromAPI = async () => {

    setLoading(true);
    const token = localStorage.getItem("userToken");
    try {
      // Fetch the accounts from the dummy API
      const response = await fetch(
        `https://marketincer-7.onrender.com/api/v1/social_pages/connected_pages`, {
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

  const handleDisConnect = async (account) => {

    const token = localStorage.getItem("userToken");
    try {
      // Call the connect API with the selected account's data
      const response = await fetch("https://marketincer-7.onrender.com/api/v1/social_pages/dis_connect  ", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          page: account
        }),
      });

      const data = await response.json();
      console.log("Connect API Response:", data);

      if (data.status) {
        alert(`${account.name} disconnected successfully!`);
        setPages(prevPages => prevPages.filter(page => page.page_id !== account.page_id));
      } else {
        alert(`Failed to connect ${account.name}`);
      }
    } catch (error) {
      console.error("Error connecting account:", error);
      alert("Failed to connect account.");
    }
  };

  const accounts = {
    Instagram: [
      {
        name: "Codar Mavala",
        status: "Active",
        icon: <InstagramIcon />,
        username: "@codar_mavala",
      },
      {
        name: "Kukus Kingdom of Sports",
        status: "Active",
        icon: <InstagramIcon />,
        username: "@kukus_kingdom_of_sports",
      },
    ],
    Facebook: [
      {
        name: "Kukus Kingdom of Sports",
        status: "Active",
        icon: <FacebookIcon />,
        username: "@kukus_kingdom_of_sports",
      },
    ],
    LinkedIn: [
      {
        name: "LinkedIn Account",
        status: "Inactive",
        icon: <LinkedInIcon />,
        username: "@linkedin_account",
      },
    ],
    Twitter: [
      {
        name: "Twitter Account",
        status: "Active",
        icon: <Twitter />,
        username: "@twitter_account",
      },
    ],
  };

  return (
    <Box>
      <DashboardLayout>
        <DashboardNavbar />
        <Grid container spacing={4} justifyContent="center">
          {/* Section for Instagram */}
          <Grid item xs={12} >
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                  Instagram
                </Typography>
                <MDButton
                  variant="gradient"
                  color="info"
                  sx={{ marginLeft: "auto" }}
                  onClick={() => {

                    window.location.href = "/social";
                  }}
                  to="/social" // Define the destination URL
                >
                  <AddIcon /> Add Account
                </MDButton>
              </Box>
              <Divider sx={{ marginBottom: "20px" }} />
              <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", marginBottom: "10px", gap: "10px" }}>

                {loading ? (<>

                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px", width: "calc(25% - 10px)", border: "1px solid #e5e6eb", padding: "10px", borderRadius: "6px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                      <Skeleton animation="wave" variant="circular" width={40} height={40} />
                      <Box>
                        <Skeleton
                          animation={true}
                          height={10}
                          width="200px"
                          style={{ marginBottom: 6 }}
                        />
                        <Skeleton
                          animation={true}
                          height={10}
                          width="100px"
                          style={{ marginBottom: 6 }}
                        />

                      </Box>
                    </Box>
                  </Box>
                </>) : (
                  <>
                    {pages.map((page, index) => (
                      <Box key={index} sx={{ display: "flex", alignItems: "center", marginBottom: "10px", width: "calc(25% - 10px)", border: "1px solid #e5e6eb", padding: "10px", borderRadius: "6px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                          <Avatar sx={{ marginRight: "10px" }} src={page.page_info.picture.data.url}>{page.icon}</Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontSize: "12px", fontWeight: "700" }}>{page.name}</Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: "12px" }}>
                              {page.username}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: "12px", color: "#00be4e" }}>
                              Active
                            </Typography>
                          </Box>
                        </Box>

                        <MDButton
                          variant="outlined"
                          color="info"
                          size="small"
                          sx={{ padding: "5px", mb: 2, fontSize: "12px", marginLeft: "auto" }}
                          onClick={() => { handleDisConnect(page) }}
                        >
                          Disconnect
                        </MDButton>
                      </Box>

                    ))}
                  </>
                )}

              </Box>
            </Box>
          </Grid>

          {/* Section for Facebook */}
          <Grid item xs={12} >
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                  Facebook
                </Typography>
                <MDButton
                  variant="gradient"
                  color="info"
                  sx={{ marginLeft: "auto" }}
                  onClick={() => {

                    window.location.href = "/social";
                  }}
                  to="/social" // Define the destination URL
                >
                  <AddIcon /> Add Account
                </MDButton>
              </Box>
              <Divider sx={{ marginBottom: "20px" }} />
              <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", marginBottom: "10px", gap: "10px" }}>

                {loading ? (<>

                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px", width: "calc(25% - 10px)", border: "1px solid #e5e6eb", padding: "10px", borderRadius: "6px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                      <Skeleton animation="wave" variant="circular" width={40} height={40} />
                      <Box>
                        <Skeleton
                          animation={true}
                          height={10}
                          width="200px"
                          style={{ marginBottom: 6 }}
                        />
                        <Skeleton
                          animation={true}
                          height={10}
                          width="100px"
                          style={{ marginBottom: 6 }}
                        />

                      </Box>
                    </Box>
                  </Box>
                </>) : (
                  <>

                  </>
                )}

              </Box>
            </Box>
          </Grid>

          {/* Section for LinkedIn */}
          <Grid item xs={12} >
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                  LinkedIn
                </Typography>
                <MDButton
                  variant="gradient"
                  color="info"
                  sx={{ marginLeft: "auto" }}
                  onClick={() => {

                    window.location.href = "/social";
                  }}
                  to="/social" // Define the destination URL
                >
                  <AddIcon /> Add Account
                </MDButton>
              </Box>

              <Divider sx={{ marginBottom: "20px" }} />
              <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", marginBottom: "10px", gap: "10px" }}>

                {loading ? (<>

                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px", width: "calc(25% - 10px)", border: "1px solid #e5e6eb", padding: "10px", borderRadius: "6px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                      <Skeleton animation="wave" variant="circular" width={40} height={40} />
                      <Box>
                        <Skeleton
                          animation={true}
                          height={10}
                          width="200px"
                          style={{ marginBottom: 6 }}
                        />
                        <Skeleton
                          animation={true}
                          height={10}
                          width="100px"
                          style={{ marginBottom: 6 }}
                        />

                      </Box>
                    </Box>
                  </Box>
                </>) : (
                  <>

                  </>
                )}

              </Box>
            </Box>
          </Grid>

          {/* Section for Twitter */}
          <Grid item xs={12}>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                  Twitter/X
                </Typography>
                <MDButton
                  variant="gradient"
                  color="info"
                  sx={{ marginLeft: "auto" }}
                  onClick={() => {

                    window.location.href = "/social";
                  }}
                  to="/social" // Define the destination URL
                >
                  <AddIcon /> Add Account
                </MDButton>
              </Box>
              <Divider sx={{ marginBottom: "20px" }} />
              <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", marginBottom: "10px", gap: "10px" }}>

                {loading ? (<>

                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px", width: "calc(25% - 10px)", border: "1px solid #e5e6eb", padding: "10px", borderRadius: "6px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                      <Skeleton animation="wave" variant="circular" width={40} height={40} />
                      <Box>
                        <Skeleton
                          animation={true}
                          height={10}
                          width="200px"
                          style={{ marginBottom: 6 }}
                        />
                        <Skeleton
                          animation={true}
                          height={10}
                          width="100px"
                          style={{ marginBottom: 6 }}
                        />

                      </Box>
                    </Box>
                  </Box>
                </>) : (
                  <>

                  </>
                )}

              </Box>
            </Box>
          </Grid>
        </Grid>
      </DashboardLayout>
    </Box>
  );
};

export default Index;
