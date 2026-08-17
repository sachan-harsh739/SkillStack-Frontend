import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5001";

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
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 text-white">

      <div className="w-full max-w-md">

        {/* Header */}

        <div className="mb-8 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-xl">
            🔐
          </div>

          <h1 className="mt-5 text-3xl font-bold">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Sign in to manage your SkillStack portfolio.
          </p>

        </div>

        {/* Card */}

        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl"
        >

          {/* Email */}

          <div>

            <label className="text-sm font-medium text-white/70">
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
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-400/50"
            />

          </div>

          {/* Password */}

          <div className="mt-5">

            <label className="text-sm font-medium text-white/70">
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
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-400/50"
            />

          </div>

          {/* Error */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Signing in..."
              : "Login to Admin →"}
          </button>

        </form>

        {/* Security message */}

        <p className="mt-5 text-center text-xs text-white/25">
          🔒 Private admin area • Authorized access only
        </p>

      </div>

    </main>
  );
}

export default AdminLogin;
