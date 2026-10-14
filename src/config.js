// Backend API URL
// - Local dev (npm run dev): http://localhost:5001
// - Production build: the deployed Netlify backend
// Set VITE_API_BASE (env var / .env) to override either one.
const LOCAL_API = "http://localhost:5001";
const PRODUCTION_API = "https://precious-manatee-fa568b.netlify.app";

export const API_BASE = (
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? LOCAL_API : PRODUCTION_API)
).replace(/\/+$/, "");
