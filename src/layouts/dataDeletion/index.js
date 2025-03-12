import React from "react";
import { Box, Container, Typography, Link, Grid } from "@mui/material";
import BasicLayout2 from "@/layouts/authentication/components/BasicLayout/index2";
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import Card from "@mui/material/Card";
const DataDeletion = () => {
  return (
    
         <BasicLayout2>
      <MDBox pt={6} pb={3}>
        <Container maxWidth="md">
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <MDTypography variant="h4" fontWeight="bold">
              Data Deletion Request
            </MDTypography>
            <Typography variant="body1" mt={2}>
              At <strong>Marketincer</strong>, we value your privacy and provide full control over your data. If you wish to delete your personal information, follow the steps below.
            </Typography>
          </Box>

          {/* Automatic Deletion */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              How to Request Data Deletion
            </MDTypography>

            <Typography variant="h6" color="primary" mt={3}>
              Option 1: Automatic Deletion (For Facebook Users)
            </Typography>
            <Typography variant="body1" mt={1}>
              If you logged in via Facebook and want to delete your data:
            </Typography>
            <ul>
              <li>
                Go to <Link href="https://www.facebook.com/settings?tab=applications" target="_blank">Facebook’s App Settings</Link>
              </li>
              <li>Find and select <strong>Marketincer</strong></li>
              <li>Click <strong>Remove</strong> and select <strong>Delete all data</strong></li>
              <li>Your data will be automatically removed from our system</li>
            </ul>
          </Box>

          {/* Manual Deletion */}
          <Box mb={4}>
            <Typography variant="h6" color="primary">
              Option 2: Manual Data Deletion Request
            </Typography>
            <Typography variant="body1" mt={1}>
              If you prefer to request data deletion manually, follow these steps:
            </Typography>
            <ul>
              <li>Email us at <strong>info@marketincer.com</strong> with the subject: <strong>“Request for Data Deletion”</strong></li>
              <li>Include your Full Name, Registered Email, and Facebook User ID (if applicable)</li>
              <li>We will verify your request and delete your data within <strong>7 working days</strong></li>
              <li>You will receive a confirmation email once the deletion is completed</li>
            </ul>
          </Box>

          {/* Data Removed */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              What Data is Removed?
            </MDTypography>
            <Typography variant="body1" mt={1}>
              The following information will be permanently erased upon request:
            </Typography>
            <ul>
              <li>Your profile details (name, email, and associated data)</li>
              <li>Stored activity related to your account</li>
              <li>Linked social login data</li>
            </ul>
            <Typography variant="body2">
              <strong>Note:</strong> Some data may be retained for legal or security reasons per our <Link href="privacy-policy.html">Privacy Policy</Link>.
            </Typography>
          </Box>

          {/* Help Section */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              📌 Need Help?
            </MDTypography>
            <Typography variant="body1">
              For any data deletion inquiries, contact us:
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> <Link href="mailto:info@marketincer.com">info@marketincer.com</Link>
            </Typography>
            <Typography variant="body2">
              For more details, visit our <Link href="privacy-policy.html">Privacy Policy</Link> page.
            </Typography>
          </Box>

          {/* Footer */}
          <Box textAlign="center" py={3} bgcolor="#c3c3c3" color="white">
            <Typography variant="body2">
              &copy; 2025 Marketincer. All rights reserved.
            </Typography>
            <Typography variant="body2">
              <Link href="/" color="inherit">Home</Link> | 
              <Link href="terms" color="inherit">Terms of Service</Link> | 
              <Link href="privacy-policy" color="inherit"> Privacy Policy</Link> | 
              <Link href="data-deletion" color="inherit"> Data Deletion</Link>
            </Typography>
          </Box>
        </Container>
      </MDBox>
      </BasicLayout2>
 
  );
};

export default DataDeletion;
