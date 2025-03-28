import React, { useEffect, useState } from "react";
import { Box, IconButton, Modal, Typography, CircularProgress, Grid, Button } from "@mui/material";
import DashboardLayout from "@/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "@/examples/Navbars/DashboardNavbar";
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import { Twitter } from "@mui/icons-material";
import MDButton from "@/components/MDButton";
import CloseIcon from '@mui/icons-material/Close';
import onBoardImage from "/on-board-social-accounts.jpeg";
import YouTubeIcon from '@mui/icons-material/YouTube';
import GoogleIcon from '@mui/icons-material/Google';
import TelegramIcon from '@mui/icons-material/Telegram';
import Divider from "@mui/material/Divider";
// Material Dashboard 2 React components
import MDInput from "@/components/MDInput";

const FACEBOOK_APP_ID = "499798672825129";
const FACEBOOK_APP_SECRET = "0972b471f1d251f8db7762be1db4613c";
// const REDIRECT_URI = "http://localhost:5173/social";
// const FACEBOOK_APP_ID = "658464799854317";
// const FACEBOOK_APP_SECRET = "b9d95073b6749e1aabc63d5bbad45529";
// const REDIRECT_URI = "https://marketincerfe.kukus.in/social";

const REDIRECT_URI = "https://www.marketincer.com/social";

const Index = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openInstaNoticeModal, setOpenInstaNoticeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [instagramAccounts, setInstagramAccounts] = useState([]);
  const [gettingPage, setGettingPage] = useState(false);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
      fetchAccessToken(authCode);
    }
  }, []);

  const fetchAccessToken = async (code) => {
    setLoading(true);

    try {
      if (code) {
        // Step 1: Exchange the code for a short-lived access token
        const tokenResponse = await fetch(
          `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}`
        );
        const tokenData = await tokenResponse.json();

        const shortLivedToken = tokenData.access_token;
        if (shortLivedToken) {
          // Step 2: Exchange the short-lived token for a long-lived token
          const longTokenResponse = await fetch(
            `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&grant_type=fb_exchange_token&fb_exchange_token=${shortLivedToken}`
          );
          const longTokenData = await longTokenResponse.json();

          const longLivedToken = longTokenData.access_token;

          if (longLivedToken) {
            // Store the long-lived access token in localStorage
            localStorage.setItem("fb_access_token", longLivedToken);

            // Proceed with fetching the Facebook pages and Instagram accounts
            fetchAccountsFromAPI(longLivedToken);

            // Clear the code from the query params
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl); // Remove the code from the URL
          }
        }
      }
    } catch (error) {
      console.error("Error fetching access token:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchAccountsFromAPI = async (authCode) => {

    setGettingPage(true);
    const token = localStorage.getItem("userToken");
    try {
      // Fetch the accounts from the dummy API
      const response = await fetch(
        `https://marketincer-2.onrender.com/api/v1/social_accounts/get_pages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          auth_token: authCode
        })
      }
      );

      const data = await response.json();
      setPages(data.data.accounts); // Store the fetched accounts in the state
      setOpenModal(true); // Open the modal once data is fetched
     
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setGettingPage(false);
    }
  };

  const handleAuthRedirect = (platform) => {
    let authURL = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=pages_show_list,instagram_basic,instagram_content_publish&response_type=code`;

    if (platform === "facebook" || platform === "instagram") {
      window.location.href = authURL;
    }
  };

  const handleConnect = async (account) => {
    console.log(account);
    const token = localStorage.getItem("userToken");
    try {
      // Call the connect API with the selected account's data
      const response = await fetch("https://marketincer-2.onrender.com/api/v1/social_pages/connect", {
        method: "POST",
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
        const updatedPages = pages.map((pg) =>
          pg.page_id === account.page_id ? { ...pg, connected: true } : pg
        );
  
        setPages(updatedPages);
        alert(`${account.name} connected successfully!`);
      } else {
        alert(`Failed to connect ${account.name}`);
      }
    } catch (error) {
      console.error("Error connecting account:", error);
      alert("Failed to connect account.");
    }
  };
  const socialMediaPlatforms = [
    { name: "Facebook", icon: <FacebookIcon fontSize="large" />, color: "#1877F2", onClick: () => setOpenInstaNoticeModal(true) },
    { name: "Instagram", icon: <InstagramIcon fontSize="large" />, color: "#E1306C", onClick: () => setOpenInstaNoticeModal(true) },
    { name: "Twitter / X", icon: <Twitter fontSize="large" />, color: "#1DA1F2", onClick: () => { } },
    { name: "Pinterest", icon: <PinterestIcon fontSize="large" />, color: "#cb2935", onClick: () => { } },
    { name: "YouTube", icon: <YouTubeIcon fontSize="large" />, color: "red", onClick: () => { } },
    { name: "Google", icon: <GoogleIcon fontSize="large" />, color: "#4285F4", onClick: () => { } },
    { name: "Telegram", icon: <TelegramIcon fontSize="large" />, color: "#0088cc", onClick: () => { } }
  ];
  return (
    <Box>
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} textAlign="center">
          <img src={onBoardImage} alt="Social Header" width={100} />
          <MDTypography variant="h5" fontWeight="bold" textAlign="center" mt={2}>
            Add your social accounts
          </MDTypography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Connect your Facebook, Instagram, Twitter, LinkedIn, and more
          </Typography>

          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "20px",
              width: "50%",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
            }}
          >

            {socialMediaPlatforms.map((platform, index) => (
              <IconButton
                key={index}
                onClick={platform.onClick}
                sx={{
                  color: platform.color,
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "16px",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#f8f8f8",
                    boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                {platform.icon}
                <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                  {platform.name}
                </Typography>
              </IconButton>
            ))}
          </Box>

          <Button
            variant="contained"
            sx={{
              fontWeight: "bold",
              marginTop: "20px",
              padding: "10px 20px",
              borderRadius: "25px",
              backgroundColor: "#01cbc6 !important", // Ensures background color applies
              color: "white !important", // ✅ Forces white text
              "&:hover": {
                backgroundColor: "#00b3ad !important", // Slightly darker on hover
              },
            }}
          >
            Continue
          </Button>
        </MDBox>
      </DashboardLayout>
      {/* Modal for Showing Pages & Instagram Accounts */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
            maxHeight: '80vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingTop: "15px",
            paddingBottom: "3px"
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={() => setOpenModal(false)}  // Close the modal on click
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "#888",  // Light gray color for the close button
            }}
          >
            <CloseIcon />
          </IconButton>


          <Box
            sx={{
              display: "flex",
            }}
          >
            <FacebookIcon fontSize="large" sx={{ color: "#1778f4" }} />
            <Typography variant="h6" fontWeight="bold" mb={2} sx={{ textAlign: 'center', marginTop: "5px" }}>
              Facebook
            </Typography>
          </Box>

          <Divider sx={{ margin: 0, width: "100%", backgroundColor: "#bbbbbb" }} />

          {loading ? (
            <CircularProgress />
          ) : (
            <>

              <Box sx={{ margin: 0, width: "100%", }} >
                <Typography sx={{
                  fontSize: "14px",
                  color: "#373737",
                  paddingTop: "20px",
                }}>
                  Select the accounts that you want to add.
                </Typography>
                {pages.length > 1 && (
                    <MDInput label="Search here" sx={{ margin: 0, width: "100%", }} />
                )}
            
              </Box>
              <Box
                sx={{
                  maxHeight: "60vh",
                  overflowY: "auto",
                  listStyleType: "none",
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginTop: "20px",
                  width: "100%"
                }}
              >
                {pages.map((account) => (
                  <Box
                    key={account.page_id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f9f9f9",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#f1f1f1",
                      },
                    }}
                  >
                    <img
                      src={account.user.picture.data.url}
                      alt={account.name}
                      style={{
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        marginRight: "15px",
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" fontWeight="bold" sx={{
                        fontSize: "14px",
                        color: "#373737",
                      }}>
                        {account.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{
                        fontSize: "12px",
                      }}>
                        {account.username}
                      </Typography>
                    </Box>

                    {/* Show "Connected" label for connected accounts */}
                    {account.connected ? (
                      <Typography
                        sx={{
                          color: "green",
                          fontSize: "14px",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Connected
                      </Typography>
                    ) : (
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleConnect(account)}
                        sx={{
                          textDecoration: "underline",
                          padding: 0,
                          minWidth: "auto",
                          "&:hover": {
                            backgroundColor: "transparent",
                          },

                        }}
                      >
                        Connect
                      </Button>
                    )}
                  </Box>
                ))}
              </Box>
              <Box sx={{ margin: 0, width: "100%", }} >
                <Typography sx={{
                  fontSize: "14px",
                  color: "#373737",
                  paddingTop: "20px",
                }}>
                  You can only add Facebook Profiles, Facebook Groups, and Facebook Pages, including Locations, managed by you. Don't see a Page you do manage? Click here.
                </Typography>
                <Typography sx={{
                  fontSize: "14px",
                  color: "#373737",
                  paddingTop: "20px",
                }}>
                  If you need to add another Facebook account, simply log out of or switch Facebook accounts first.
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end", // ✅ Aligns buttons to the right
                  alignItems: "center",
                  gap: "1rem",
                  width: "100%", // Prevents overflow
                }}
              >

                <MDButton
                  variant="gradient"
                  sx={{
                    margin: "0.09375rem 1px",
                    mb: 2,
                    backgroundColor: "#01cbc6 !important", // Ensures background color applies
                    color: "white !important", // ✅ Forces white text
                    "&:hover": {
                      backgroundColor: "#00b3ad !important", // Slightly darker on hover
                    },
                  }}
                  onClick={() => {
                    window.location.href = "/dashboard";
                  }}
                >
                  Continue
                </MDButton>
              </Box>

            </>
          )}
        </Box>
      </Modal>



      {/* Modal for Showing Pages & Instagram Accounts */}
      <Modal open={openInstaNoticeModal} onClose={() => setOpenInstaNoticeModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Typography variant="body1" sx={{ color: "#373737", mb: 2 }}>
            <div>
              {/* Title Text */}
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#373737",
                }}
              >
                At the moment, we can only support Instagram Business &amp; Creator accounts that are connected to a Facebook Page.
              </Typography>

              {/* Instagram Personal to Business Text */}
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#373737",
                  paddingTop: "20px",
                }}
              >
                To convert your Instagram Personal account to a Business or Creator account,
                <a
                  href="https://help.instagram.com/502981923235522"
                  target="_blank"
                  style={{ color: "#1e88e5" }}
                >
                  click here
                </a>.
              </Typography>

              {/* Facebook Page to Instagram Text */}
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#373737",
                  paddingTop: "20px",
                }}
              >
                To connect your Facebook Page to your Instagram Business or Creator account,
                <a
                  href="https://help.instagram.com/570895513091465"
                  target="_blank"
                  style={{ color: "#1e88e5" }}
                >
                  click here
                </a>.
              </Typography>
            </div>
          </Typography>


          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <MDButton
              variant="outlined"
              color="info"
              sx={{ margin: "0.09375rem 1rem", mb: 2, mr: 0, ml: 0 }}
              onClick={() => setOpenInstaNoticeModal(false)}
            >
              Cancel
            </MDButton>
            <MDButton
              variant="gradient"
              color="info"
              sx={{ margin: "0.09375rem 1rem", mb: 2, mr: 0, ml: 0 }}
              onClick={() => {
                // Add your logic for the "Continue" action here
                setOpenInstaNoticeModal(false);
                handleAuthRedirect("instagram")
              }}
            >
              Continue
            </MDButton>

          </Box>
        </Box>
      </Modal>
      {gettingPage && (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <CircularProgress size={60} />
  </Box>
)}
    </Box>
  );
};

export default Index;
