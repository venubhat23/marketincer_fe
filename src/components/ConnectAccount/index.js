import { Box } from "@mui/material";
import React from "react";
import MDBox from "@/components/MDBox";
import Grid from "@mui/material/Grid";
import MDTypography from "@/components/MDTypography";
import IconButton from "@mui/material/IconButton";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

const FACEBOOK_APP_ID = "YOUR_FACEBOOK_APP_ID"; // Replace with your actual App ID

const ConnectAccount = () => {
  const handleInstagramAuth = () => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          console.log("User authenticated:", response);
          getUserData(response.authResponse.accessToken);
        } else {
          console.error("User cancelled login or did not fully authorize.");
        }
      },
      {
        scope: "pages_show_list,instagram_basic,instagram_content_publish",
      }
    );
  };

  const getUserData = (accessToken) => {
    window.FB.api("/me/accounts", { access_token: accessToken }, (response) => {
      if (response.data && response.data.length > 0) {
        const page = response.data[0]; // Assuming first page has Instagram linked
        const pageId = page.id;

        window.FB.api(
          `/${pageId}?fields=instagram_business_account`,
          { access_token: accessToken },
          (instaResponse) => {
            if (instaResponse.instagram_business_account) {
              const instagramAccountId = instaResponse.instagram_business_account.id;

              // Send data to backend
              sendDataToBackend({
                accessToken,
                instagramAccountId,
                pageId,
              });
            }
          }
        );
      }
    });
  };

  const sendDataToBackend = async (data) => {
    try {
      const response = await fetch("https://yourbackend.com/api/auth/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Backend Response:", result);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };


  return (
    <>
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6} justifyContent="center">
            <Grid item xs={12} display="flex" flexDirection="column" alignItems="center">
              
              {/* Title */}
              <MDTypography variant="h5" textAlign="center" mb={2}>
                Connect Your Social Media
              </MDTypography>

              {/* Social Media Icons Container */}
              <Box
                display="flex"
                gap={3}
                p={3}
                borderRadius="20px"
                bgcolor="white"
                justifyContent="center"
                alignItems="center"
              >
                {/* Instagram */}
                <IconButton
                  onClick={handleInstagramAuth}
                  sx={{
                    color: "#E1306C",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    p: 1.5,
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)", 
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.4)", 
                      transform: "scale(1.1)", 
                    },
                  }}
                >
                  <InstagramIcon fontSize="large" />
                </IconButton>

                {/* Facebook */}
                <IconButton
                  sx={{
                    color: "#1877F2",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    p: 1.5,
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.4)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <FacebookIcon fontSize="large" />
                </IconButton>

                {/* LinkedIn */}
                <IconButton
                  sx={{
                    color: "#0077B5",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    p: 1.5,
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.4)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <LinkedInIcon fontSize="large" />
                </IconButton>

                {/* Twitter */}
                <IconButton
                  sx={{
                    color: "#1DA1F2",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    p: 1.5,
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.4)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <TwitterIcon fontSize="large" />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </MDBox>
   
    </>
  );
};

export default ConnectAccount;
