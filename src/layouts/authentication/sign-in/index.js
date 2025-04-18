/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useEffect } from "react";
import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import MDInput from "@/components/MDInput";
import MDButton from "@/components/MDButton";

// Authentication layout components
import BasicLayout from "@/layouts/authentication/components/BasicLayout";

// Images
import bgImage from "./bg-sign-in-basic.jpeg";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/authContext/AuthContext";
import { toast } from "react-toastify";


function Basic() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  // const handleSetRememberMe = () => setRememberMe(!rememberMe);
   // const handleSetRememberMe = () => setRememberMe(!rememberMe);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true }); // Redirect authenticated users
    }
  }, [isAuthenticated, navigate]);

  const mutation = useMutation({
    mutationFn: (userData) =>
      axios.post(
        "https://api.marketincer.com/api/v1/login",
        userData
      ),
    onSuccess: (response) => {
      console.log(response);
      login(response.data); // Ensure `login` function is defined
      toast.success("User Loggedin Successfully", {
        position: "top-right",
        autoClose: 5000,
      });
      navigate("/dashboard"); // Ensure `navigate` is available
    },
    onError: (error) => {
      console.error("Login failed", error);
      toast.error("Invalid email or password", {
        position: "top-right",
        autoClose: 5000,
      });
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    mutation.mutate(data);
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ mt: 1, mb: 2 }}
          >
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
            <MDBox mb={2}>
              {/* <MDInput type="email" label="Email" fullWidth /> */}
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <>
                    <MDInput
                      {...field}
                      type="email"
                      label="Email"
                      fullWidth
                      error={!!errors.email}
                    />
                    {errors.email && (
                      <MDTypography
                        variant="caption"
                        sx={{ color: "red", mt: 0.5 }}
                      >
                        {errors.email.message}
                      </MDTypography>
                    )}
                  </>
                )}
              />
            </MDBox>
            <MDBox mb={2}>
              {/* <MDInput type="password" label="Password" fullWidth /> */}
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/,
                    message:
                      "Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 number",
                  },
                }}
                render={({ field }) => (
                  <>
                    <MDInput
                      {...field}
                      type="password"
                      label="Password"
                      fullWidth
                      error={!!errors.password}
                    />
                    {errors.password && (
                      <MDTypography
                        variant="caption"
                        sx={{ color: "red", mt: 0.5 }}
                      >
                        {errors.password.message}
                      </MDTypography>
                    )}
                  </>
                )}
              />
            </MDBox>
            {/* <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox> */}
            <MDBox mt={4} mb={1}>
              <MDButton
                type="submit"
                variant="gradient"
                color="info"
                fullWidth
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Signing In..." : "Sign In"}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
