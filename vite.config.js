import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // exposes server to external requests
    port: process.env.PORT || 5173, // Render sets PORT dynamically
    allowedHosts: ["resume-system-frontend.onrender.com"], // ✅ your Render frontend domain
  },
});
