import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_BASE } from "../config";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/auth/admin-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Admin login failed"
        );
        return;
      }

      // Save admin JWT
      localStorage.setItem(
        "adminToken",
        data.token
      );

      // Save admin information
      localStorage.setItem(
        "adminUser",
        JSON.stringify(data.user)
      );

      navigate("/admin");
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 text-slate-950">

      <div className="w-full max-w-md">

        {/* Header */}

        <div className="mb-8 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl shadow-sm">
            🔐
          </div>

          <h1 className="mt-5 text-3xl font-bold">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your SkillStack portfolio.
          </p>

        </div>

        {/* Card */}

        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
        >

          {/* Email */}

          <div>

            <label className="text-sm font-medium text-slate-600">
              Admin Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter admin email"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
            />

          </div>

          {/* Password */}

          <div className="mt-5">

            <label className="text-sm font-medium text-slate-600">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter admin password"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
            />

          </div>

          {/* Error */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Signing in..."
              : "Login to Admin →"}
          </button>

        </form>

        {/* Security message */}

        <p className="mt-5 text-center text-xs text-slate-400">
          🔒 Private admin area • Authorized access only
        </p>

      </div>

    </main>
  );
}

export default AdminLogin;
