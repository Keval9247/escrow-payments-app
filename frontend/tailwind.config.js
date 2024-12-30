import { optimizeDeps } from "vite";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure all components are scanned
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  optimizeDeps: {
    include: ['@stripe/stripe-js'],
  }
};
