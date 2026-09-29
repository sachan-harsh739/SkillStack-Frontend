import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/auth/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Login failed.");
      return;
    }

    // Store JWT token
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("token", data.token);
    storage.setItem("user", JSON.stringify(data.user));

    alert("Login successful! 🎉");

    navigate("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    alert("Unable to connect to the backend.");
  }
};

  return (
    <div className="min-h-screen bg-slate-50">

      {/* MAIN CONTAINER */}

      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-5 py-10 sm:px-8 lg:px-12">

        <div className="grid w-full items-center gap-12 lg:grid-cols-2">

          {/* ================= LEFT SIDE ================= */}

          <div className="w-full">

            {/* BRAND */}

            <div className="mb-8">

              <Link
                to="/"
                className="inline-flex items-center text-3xl font-bold tracking-tight"
              >
                <span className="text-slate-900">
                  Skill
                </span>

                <span className="text-slate-950">
                  Stack
                </span>
              </Link>

              <p className="mt-2 text-sm text-slate-500">
                Build. Learn. Showcase.
              </p>

            </div>


            {/* HEADING */}

            <div className="mb-7">

              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-950">
                Welcome Back
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Access Your SkillStack
              </h1>

              <p className="mt-3 max-w-md text-slate-500">
                Sign in to manage your expertise, history, certifications,
                LeetCode progress and achievements.
              </p>

            </div>


            {/* LOGIN CARD */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <form onSubmit={handleSubmit}>

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
                  />

                </div>


                {/* PASSWORD */}

                <div className="mt-5">

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>

                  </div>

                </div>


                {/* OPTIONS */}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">

                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) =>
                        setRememberMe(e.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950/10"
                    />

                    Keep me logged in

                  </label>


                  <button
                    type="button"
                    className="text-left text-sm font-medium text-slate-950 hover:text-slate-700 sm:text-right"
                  >
                    Forgot Password?
                  </button>

                </div>


                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-slate-200 transition hover:bg-slate-800 hover:shadow-lg"
                >
                  <span>→</span>
                  Sign In to SkillStack
                </button>

              </form>


              {/* REGISTER */}

              <div className="mt-6 border-t border-slate-100 pt-6 text-center">

                <p className="text-sm text-slate-500">
                  Don't have an account?{" "}

                  <Link
                    to="/register"
                    className="font-semibold text-slate-950 hover:text-slate-700"
                  >
                    Create Account
                  </Link>
                </p>

              </div>

            </div>

          </div>


          {/* ================= RIGHT SIDE ================= */}

          <div className="hidden lg:block">

            <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 shadow-2xl">

              {/* Decorative circles */}

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />


              {/* CONTENT */}

              <div className="relative">

                <div className="mb-8">

                  <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-white/70">
                    Developer Platform
                  </span>

                  <h2 className="mt-5 text-3xl font-bold leading-tight text-white">
                    Everything you build,
                    <br />
                    <span className="text-white">
                      in one place.
                    </span>
                  </h2>

                  <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                    SkillStack helps developers organize their complete
                    professional journey — from history and expertise to
                    coding progress and achievements.
                  </p>

                </div>


                {/* DASHBOARD PREVIEW */}

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">

                  {/* TOP */}

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-950">
                        S
                      </div>

                      <span className="text-sm font-semibold text-white">
                        SkillStack
                      </span>

                    </div>

                    <div className="h-7 w-7 rounded-full bg-slate-600" />

                  </div>


                  {/* STAT CARDS */}

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-white/10 p-4">

                      <p className="text-xs text-slate-400">
                        Expertise
                      </p>

                      <p className="mt-1 text-2xl font-bold text-white">
                        12
                      </p>

                    </div>


                    <div className="rounded-xl bg-white/10 p-4">

                      <p className="text-xs text-slate-400">
                        LeetCode
                      </p>

                      <p className="mt-1 text-2xl font-bold text-white">
                        450+
                      </p>

                    </div>


                    <div className="rounded-xl bg-white/10 p-4">

                      <p className="text-xs text-slate-400">
                        Certifications
                      </p>

                      <p className="mt-1 text-2xl font-bold text-white">
                        8
                      </p>

                    </div>


                    <div className="rounded-xl bg-white/10 p-4">

                      <p className="text-xs text-slate-400">
                        Achievements
                      </p>

                      <p className="mt-1 text-2xl font-bold text-white">
                        15
                      </p>

                    </div>

                  </div>


                  {/* PROGRESS */}

                  <div className="mt-4 rounded-xl bg-white/10 p-4">

                    <div className="flex items-center justify-between">

                      <p className="text-xs font-medium text-slate-300">
                        LeetCode Progress
                      </p>

                      <span className="text-xs font-semibold text-white">
                        450+
                      </span>

                    </div>


                    <div className="mt-4 flex h-20 items-end gap-2">

                      <div
                        className="w-full rounded-t-md bg-white/30"
                        style={{ height: "35%" }}
                      />

                      <div
                        className="w-full rounded-t-md bg-white/45"
                        style={{ height: "55%" }}
                      />

                      <div
                        className="w-full rounded-t-md bg-white/60"
                        style={{ height: "45%" }}
                      />

                      <div
                        className="w-full rounded-t-md bg-white/80"
                        style={{ height: "75%" }}
                      />

                      <div
                        className="w-full rounded-t-md bg-white"
                        style={{ height: "90%" }}
                      />

                    </div>

                  </div>

                </div>


                {/* BOTTOM TEXT */}

                <div className="mt-6 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg">
                    🚀
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-white">
                      Keep building.
                    </p>

                    <p className="text-xs text-slate-400">
                      Your developer journey starts here.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
