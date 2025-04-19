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
import React, { useEffect, useState } from "react";
// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import MDInput from "@/components/MDInput";
import MDButton from "@/components/MDButton";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Authentication layout components
import CoverLayout from "@/layouts/authentication/components/CoverLayout";
import MuiLink from "@mui/material/Link";

// Images
import bgImage from "@/assets/images/bg-sign-in-basic.jpeg";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/authContext/AuthContext";
import { toast } from "react-toastify";

import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";

function Cover() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  // S3 background image URL - corrected "inage" to "image"
  const bgImageUrl = "https://marketincer-inage.s3.us-east-2.amazonaws.com/bg-sign-in-basic.jpeg";
  
  // Pre-load the background image
  useEffect(() => {
    const img = new Image();
    img.src = bgImageUrl;
    img.onload = () => setIsImageLoading(false);
    img.onerror = () => {
      console.error("Failed to load background image from S3");
      setIsImageLoading(false);
    };
  }, []);
  
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true }); // Redirect authenticated users
    }
  }, [isAuthenticated, navigate]);

  const mutation = useMutation({
    mutationFn: (userData) =>
      axios.post(
        "https://api.marketincer.com/api/v1/signup",
        userData
      ),
    onSuccess: (response) => {
      console.log(response);
      toast.success(response?.data?.message || "Registration successful!", {
        position: "top-right",
        autoClose: 5000,
      });
      navigate("/sign-in"); // Ensure navigate is available
    },
    onError: (error) => {
      const errorMessage = 
        error?.response?.data?.errors?.[0] || 
        error?.response?.data?.message || 
        "Registration failed. Please try again.";
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Registration failed", error);
    },
  });

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    let payloadData = {
      user: {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        role: data.role,
      },
    };
    mutation.mutate(payloadData);
  };

  return (
    // Pass the S3 URL directly to the CoverLayout component
    <CoverLayout image={bgImageUrl}>
      {isImageLoading && (
        <MDBox display="flex" justifyContent="center" my={2}>
          <CircularProgress color="info" />
        </MDBox>
      )}
      
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
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
                aria-label="Sign up with Facebook"
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
                aria-label="Sign up with GitHub"
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
                aria-label="Sign up with Google"
              >
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
            <MDBox mb={2}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters long",
                  },
                }}
                render={({ field }) => (
                  <>
                    <MDInput
                      {...field}
                      type="text"
                      label="Name"
                      variant="standard"
                      fullWidth
                      error={!!errors.name}
                    />
                    {errors.name && (
                      <MDTypography
                        variant="caption"
                        sx={{ color: "red", mt: 0.5, display: "block" }}
                      >
                        {errors.name.message}
                      </MDTypography>
                    )}
                  </>
                )}
              />
            </MDBox>
            <MDBox mb={2}>
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
                      variant="standard"
                      fullWidth
                      error={!!errors.email}
                    />
                    {errors.email && (
                      <MDTypography
                        variant="caption"
                        sx={{ color: "red", mt: 0.5, display: "block" }}
                      >
                        {errors.email.message}
                      </MDTypography>
                    )}
                  </>
                )}
              />
            </MDBox>
            <MDBox mb={2}>
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
                    value: /^(?=.[a-z])(?=.[A-Z])(?=.\d)[A-Za-z\d@$!%?&]+$/,
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
                      variant="standard"
                      fullWidth
                      error={!!errors.password}
                    />
                    {errors.password && (
                      <MDTypography
                        variant="caption"
                        sx={{ color: "red", mt: 0.5, display: "block" }}
                      >
                        {errors.password.message}
                      </MDTypography>
                    )}
                  </>
                )}
              />
            </MDBox>

            <MDBox mb={2}>
              <Controller
                name="confirmPassword"
                control={control}
                defaultValue=""
                rules={{
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                }}
                render={({ field }) => (
                  <>
                    <MDInput
                      {...field}
                      type="password"
                      label="Confirm Password"
                      variant="standard"
                      fullWidth
                      error={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && (
                      <MDTypography
                        variant="caption"
                        sx={{ color: "red", mt: 0.5, display: "block" }}
                      >
                        {errors.confirmPassword.message}
                      </MDTypography>
                    )}
                  </>
                )}
              />
            </MDBox>

            <MDBox mb={2}>
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Controller
                  name="role"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="role-select-label"
                      id="role-select"
                      label="Role"
                      sx={{ width: "100%", height: "50px" }}
                    >
                      <MenuItem value={"admin"}>Admin</MenuItem>
                      <MenuItem value={"brand"}>Brand</MenuItem>
                      <MenuItem value={"agency"}>Agency</MenuItem>
                    </Select>
                  )}
                />
                {errors.role && (
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.role.message}
                  </FormHelperText>
                )}
              </FormControl>
            </MDBox>

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Controller
                name="terms"
                control={control}
                defaultValue={false}
                rules={{
                  required: "You must agree to the Terms and Conditions",
                }}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value} />
                )}
              />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree to the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="/terms-and-conditions"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>

            {/* Error Message */}
            {errors.terms && (
              <MDTypography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                {errors.terms.message}
              </MDTypography>
            )}

            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                type="submit"
                fullWidth
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;