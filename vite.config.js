import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  // plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ Alias for the entire `src/` folder
    },
  },
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://marketincer-6.onrender.com",
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
  esbuild: {
    loader: 'jsx', // Ensures JSX is enabled for .js files
    include: /src\/.*\.js$/, // Apply only to specific files
  },
  plugins: [
    react({
      jsxImportSource: "react",
      babel: {
        plugins: ["@babel/plugin-transform-react-jsx"],
      },
    }),
  ],
  server: {
    historyApiFallback: true, // Add this line
  },
})
