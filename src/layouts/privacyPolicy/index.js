import React from "react";
import { Box, Container, Typography, Link, Grid } from "@mui/material";
import BasicLayout2 from "@/layouts/authentication/components/BasicLayout/index2";
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";

const PrivacyPolicy = () => {
  return (
    <BasicLayout2>
      <MDBox pt={6} pb={3}>
        <Container maxWidth="md">
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <MDTypography variant="h4" fontWeight="bold">
              Privacy Policy
            </MDTypography>
            <Typography variant="body1" mt={2}>
              This Privacy Policy explains how <strong>SRI SUPARNA MARKETING SOLUTIONS PRIVATE LIMITED</strong> ("Marketincer," "we," "our," or "us") collects, uses, and discloses personally identifiable information from users of our website, <Link href="https://marketincer.com" target="_blank">https://marketincer.com</Link>, and all related services.
            </Typography>
          </Box>

          {/* Introduction */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              1. Introduction
            </MDTypography>
            <Typography variant="body1" mt={2}>
              Since Marketincer integrates with various social networks, the information you provide or we collect may be shared with these platforms and is subject to their respective privacy policies. We do not control their data practices. To understand how your information is used by them, please review their privacy policies.
            </Typography>
          </Box>

          {/* Information Collection */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              2. Information Collection and Use
            </MDTypography>
            <Typography variant="body1" mt={2}>
              We collect personally identifiable information primarily to provide our services, communicate with you, and manage your registered account if you have one. If you choose not to provide the requested information, certain features may not be available to you.
            </Typography>
            <MDTypography variant="h6" color="primary" mt={3}>
              Information Collected During Registration
            </MDTypography>
            <Typography variant="body1">
              To access restricted sections of our Site, you may need to register and provide certain personal details, including your full name, email address, and time zone.
            </Typography>
            <MDTypography variant="h6" color="primary" mt={3}>
              Use of Contact Information
            </MDTypography>
            <Typography variant="body1">
              We may use your contact details to send marketing communications regarding our services. If you wish to opt out, you can unsubscribe via email instructions.
            </Typography>
          </Box>

          {/* Cookies */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              3. Cookies
            </MDTypography>
            <Typography variant="body1" mt={2}>
              We use cookies to enhance website functionality. Cookies do not collect personally identifiable information. Marketincer may use session cookies (temporary) and persistent cookies (remain after closing the browser).
            </Typography>
          </Box>

          {/* Information Sharing */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              4. Information Sharing
            </MDTypography>
            <Typography variant="body1" mt={2}>
              Our primary use of your data is to publish your content on the social networks you have authenticated with. If you link your Marketincer account to a third-party social platform, your information may be shared with that service.
            </Typography>
          </Box>

          {/* Access to Information */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              5. Access to Information
            </MDTypography>
            <Typography variant="body1" mt={2}>
              You can access and update your personal information via your account settings. To delete your data, contact us at <strong>info@marketincer.com</strong>.
            </Typography>
          </Box>

          {/* Data Security */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              6. Data Security
            </MDTypography>
            <Typography variant="body1" mt={2}>
              We use <strong>AWS</strong> servers and security measures to protect your data from unauthorized access. In case of a data breach, affected users will be notified as per legal requirements.
            </Typography>
          </Box>

          {/* External Links */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              7. External Links
            </MDTypography>
            <Typography variant="body1" mt={2}>
              Our website may contain links to third-party sites. We are not responsible for their privacy practices and encourage you to review their policies before providing personal information.
            </Typography>
          </Box>

          {/* Data Transfer */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              8. Data Transfer
            </MDTypography>
            <Typography variant="body1" mt={2}>
              By using Marketincer, you consent to your data being processed on <strong>AWS servers</strong>, which may be located outside your country.
            </Typography>
          </Box>

          {/* Children's Privacy */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              9. Children's Privacy
            </MDTypography>
            <Typography variant="body1" mt={2}>
              We do not knowingly collect information from individuals under 13. If we discover that a child under 13 has provided us with personal data, we will delete it immediately.
            </Typography>
          </Box>

          {/* Policy Updates */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              10. Changes to This Policy
            </MDTypography>
            <Typography variant="body1" mt={2}>
              We may update this Privacy Policy periodically. Any significant changes will be announced on our Site.
            </Typography>
          </Box>

          {/* Contact Information */}
          <Box mb={4}>
            <MDTypography variant="h5" color="primary" fontWeight="bold">
              11. Contact Information
            </MDTypography>
            <Typography variant="body1" mt={2}>
              If you have any questions, contact us at:
            </Typography>
            <Typography variant="body2" mt={2}>
              <strong>SRI SUPARNA MARKETING SOLUTIONS PRIVATE LIMITED</strong><br />
              #47 Sri Garuda 2nd Cross, 4th Main, Vittal Nagar,<br />
              Kumaraswamy Layout, Bangalore South, Bangalore- 560078, Karnataka<br />
              Email: <Link href="mailto:info@marketincer.com">info@marketincer.com</Link>
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

export default PrivacyPolicy;
