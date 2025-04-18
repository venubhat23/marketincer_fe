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
import bgImage from "./bg-sign-up-cover.jpeg";
import { Controller, useForm } from "react-hook-form";
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
} from "@mui/material";

function Cover() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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
      toast.success(response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
      });
      navigate("/sign-in"); // Ensure `navigate` is available
    },
    onError: (error) => {
      toast.error(error?.response?.data?.errors?.[0], {
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
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        role: data.role,
      },
    };
    mutation.mutate(payloadData);
  };
  console.log(mutation);
  return (
    <CoverLayout image={bgImage}>
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
              {/* <MDInput type="text" label="Name" variant="standard" fullWidth /> */}
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: "Name is required",
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
                        sx={{ color: "red", mt: 0.5 }}
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
                      variant="standard"
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
                        sx={{ color: "red", mt: 0.5 }}
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
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Controller
                  name="role"
                  control={control}
                  defaultValue=""
                  rules={{ required: "role is required" }} // Validation Rule
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
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
                  <FormHelperText>{errors.role.message}</FormHelperText>
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
                href="#"
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
              <MDTypography variant="caption" color="error">
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
                {mutation.isPending ? "Registering..." : "Register"}
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
