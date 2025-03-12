import React from "react";
import { Box, Container, Typography, Link, Grid } from "@mui/material";
import BasicLayout2 from "@/layouts/authentication/components/BasicLayout/index2";
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";

const TermsAndConditions = () => {
  return (
    <BasicLayout2>
      <MDBox pt={6} pb={3}>
        <Container maxWidth="md">
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <MDTypography variant="h4" fontWeight="bold">
              Terms and Conditions
            </MDTypography>
          </Box>

          {/* Introduction */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              1. Introduction
            </MDTypography>
            <Typography variant="body1" mt={2}>
              Marketincer ("the Service" or "the Website") is operated by <strong>SRI SUPARNA MARKETING SOLUTIONS PRIVATE LIMITED</strong>. By accessing or using the Website, you agree to comply with these terms. If you do not agree, you may not use the Website or its services.
            </Typography>
          </Box>

          {/* Account Access */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              2. Account Access
            </MDTypography>
            <Typography variant="body1" mt={2}>
              Users must be at least 13 years old and are responsible for maintaining their login credentials.
            </Typography>
          </Box>

          {/* Usage Restrictions */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              3. Usage Restrictions
            </MDTypography>
            <Typography variant="body1" mt={2}>
              Users are prohibited from:
            </Typography>
            <ul>
              <li>Reverse engineering or modifying the Service.</li>
              <li>Using bots or scraping tools.</li>
              <li>Engaging in unlawful activities.</li>
            </ul>
          </Box>

          {/* Fees & Payments */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              4. Fees & Payments
            </MDTypography>
            <Typography variant="body1" mt={2}>
              Payments are processed through third-party providers such as <strong>Razorpay, Stripe, and Trilo</strong>.
            </Typography>
          </Box>

          {/* Registration & Security */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              5. Registration & Security
            </MDTypography>
            <Typography variant="body1" mt={2}>
              Some services require registration. Users are responsible for maintaining account security.
            </Typography>
          </Box>

          {/* Third-Party Services */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              6. Third-Party Services
            </MDTypography>
            <Typography variant="body1" mt={2}>
              Integrations with third-party platforms are subject to their respective terms.
            </Typography>
          </Box>

          {/* Termination */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              7. Termination
            </MDTypography>
            <Typography variant="body1" mt={2}>
              We may suspend or terminate access to the Service at any time.
            </Typography>
          </Box>

          {/* Content Ownership */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              8. Content Ownership
            </MDTypography>
            <Typography variant="body1" mt={2}>
              Users may not copy, modify, or distribute content without explicit permission.
            </Typography>
          </Box>

          {/* Changes to Terms */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              9. Changes to Terms
            </MDTypography>
            <Typography variant="body1" mt={2}>
              We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance.
            </Typography>
          </Box>

          {/* Service Warranties */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              10. Service Warranties
            </MDTypography>
            <Typography variant="body1" mt={2}>
              We commit to maintaining a professional standard of service.
            </Typography>
          </Box>

          {/* Disclaimer */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              11. Disclaimer of Warranties
            </MDTypography>
            <Typography variant="body1" mt={2}>
              The Website and Service are provided "as is" without any warranties, express or implied.
            </Typography>
          </Box>

          {/* Last Updated */}
          <Box mb={4}>
            <Typography variant="body2" fontWeight="bold">
              Last Updated: March 12, 2025
            </Typography>
          </Box>

          {/* Footer */}
          <Box textAlign="center" py={3} bgcolor="#c3c3c3" color="white">
            <Typography variant="body2">
              &copy; 2025 Marketincer. All rights reserved.
            </Typography>
            <Typography variant="body2">
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

export default TermsAndConditions;
