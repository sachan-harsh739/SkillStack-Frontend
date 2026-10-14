// Backend API URL
// - Local dev (npm run dev): http://localhost:5001
// - Production build: set VITE_API_BASE in your hosting provider's env vars
//   e.g. VITE_API_BASE=https://your-backend.onrender.com
export const API_BASE = (
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "http://localhost:5001" : "")
).replace(/\/+$/, "");

if (!API_BASE) {
  console.error("VITE_API_BASE is not set — API requests will fail in production.");
}
