import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
// import { MaterialUIControllerProvider } from "./context/index.js";
import { MaterialUIControllerProvider } from "@/context";
import { AuthProvider } from "@/authContext/AuthContext";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
// Material Dashboard 2 React Context Provider

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <MaterialUIControllerProvider>
            <App />
          </MaterialUIControllerProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
