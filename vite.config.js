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
  //       target: "https://marketincer-apis.onrender.com",
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.js$/, // Apply JSX parsing to all `.js` files in src/
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
