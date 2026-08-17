import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    university: "",
    graduationYear: "",
    track: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
     body: JSON.stringify({
    name: formData.fullName,
    university: formData.university,
    graduationYear: formData.graduationYear,
    track: formData.track,
    email: formData.email,
    password: formData.password,
}),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Registration failed.");
      return;
    }

    alert("Account created successfully! 🎉");

    navigate("/login");
  } catch (error) {
    console.error("Registration error:", error);
    alert("Unable to connect to the backend.");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-8 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8 text-center">

          <Link
            to="/"
            className="text-3xl font-bold tracking-tight"
          >
            <span className="text-slate-900">Skill</span>
            <span className="text-blue-600">Stack</span>
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            Create Your Unique Developer Profile
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Create your SkillStack account and start building your
            professional developer profile.
          </p>

        </div>


        {/* ================= PROGRESS ================= */}

        <div className="mx-auto mb-8 max-w-2xl">

          <div className="flex items-center justify-between text-xs font-medium">

            <span className="text-blue-600">
              Account
            </span>

            <span className="text-slate-400">
              Profile
            </span>

            <span className="text-slate-400">
              Skills
            </span>

            <span className="text-slate-400">
              Complete
            </span>

          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">

            <div className="h-full w-1/4 rounded-full bg-blue-600" />

          </div>

        </div>


        {/* ================= MAIN ================= */}

        <div className="grid items-center gap-10 lg:grid-cols-2">


          {/* ================= LEFT FORM ================= */}

          <div className="mx-auto w-full max-w-xl">

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

              {/* FORM HEADER */}

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 sm:px-8">

                <h2 className="text-xl font-bold text-slate-900">
                  Create Your SkillStack Account
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter your basic information to get started.
                </p>

              </div>


              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6 sm:p-8"
              >

                {/* FULL NAME */}

                <div>

                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                </div>


                {/* UNIVERSITY */}

                <div>

                  <label
                    htmlFor="university"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    University / College
                  </label>

                  <input
                    id="university"
                    name="university"
                    type="text"
                    value={formData.university}
                    onChange={handleChange}
                    placeholder="Enter your university or college"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                </div>


                {/* GRADUATION + TRACK */}

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="graduationYear"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Graduation Year
                    </label>

                    <select
                      id="graduationYear"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >

                      <option value="">
                        Select year
                      </option>

                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                      <option value="2030">2030</option>

                    </select>

                  </div>


                  <div>

                    <label
                      htmlFor="track"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Select Your Track
                    </label>

                    <select
                      id="track"
                      name="track"
                      value={formData.track}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >

                      <option value="">
                        Select track
                      </option>

                      <option value="frontend">
                        Frontend Development
                      </option>

                      <option value="backend">
                        Backend Development
                      </option>

                      <option value="fullstack">
                        Full Stack Development
                      </option>

                      <option value="software">
                        Software Development
                      </option>

                      <option value="data">
                        Data Science
                      </option>

                    </select>

                  </div>

                </div>


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
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                </div>


                {/* PASSWORD */}

                <div>

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
                      placeholder="Create a password"
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>

                  </div>

                </div>


                {/* CONFIRM PASSWORD */}

                <div>

                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                </div>


                {/* TERMS */}

                <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-500">

                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  <span>
                    I agree to the{" "}
                    <button
                      type="button"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Terms & Conditions
                    </button>{" "}
                    and Privacy Policy.
                  </span>

                </label>


                {/* CREATE ACCOUNT */}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-xl"
                >
                  <span>🚀</span>
                  Create SkillStack Account
                </button>


                {/* LOGIN */}

                <p className="text-center text-sm text-slate-500">

                  Already have an account?{" "}

                  <Link
                    to="/login"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Sign In
                  </Link>

                </p>

              </form>

            </div>

          </div>


          {/* ================= RIGHT SIDE ================= */}

          <div className="hidden lg:block">

            <div className="relative mx-auto max-w-lg">

              {/* Main illustration */}

              <div className="rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 shadow-xl">

                {/* ICON */}

                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-5xl shadow-xl shadow-blue-200">
                  💻
                </div>


                <h2 className="mt-7 text-center text-3xl font-bold text-slate-900">
                  Build Your Developer Identity
                </h2>

                <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-slate-500">
                  Create one professional profile where you can showcase
                  everything you've achieved throughout your developer journey.
                </p>


                {/* FEATURE CARDS */}

                <div className="mt-8 grid grid-cols-3 gap-3">

                  <div className="rounded-2xl border border-blue-100 bg-white p-4 text-center shadow-sm">

                    <div className="text-2xl">
                      🎓
                    </div>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      Education
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Academic journey
                    </p>

                  </div>


                  <div className="rounded-2xl border border-blue-100 bg-white p-4 text-center shadow-sm">

                    <div className="text-2xl">
                      🚀
                    </div>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      Projects
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Your work
                    </p>

                  </div>


                  <div className="rounded-2xl border border-blue-100 bg-white p-4 text-center shadow-sm">

                    <div className="text-2xl">
                      🏆
                    </div>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      Achievements
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Your milestones
                    </p>

                  </div>

                </div>


                {/* PLATFORM FEATURES */}

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-white/80 p-4">

                    <p className="text-xs font-semibold text-blue-600">
                      LEETCODE
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      450+
                    </p>

                    <p className="text-xs text-slate-400">
                      Problems solved
                    </p>

                  </div>


                  <div className="rounded-xl bg-white/80 p-4">

                    <p className="text-xs font-semibold text-purple-600">
                      CERTIFICATIONS
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      8+
                    </p>

                    <p className="text-xs text-slate-400">
                      Certificates earned
                    </p>

                  </div>

                </div>

              </div>


              {/* FLOATING CARD */}

              <div className="absolute -bottom-5 -right-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    ✓
                  </div>

                  <div>

                    <p className="text-sm font-bold text-slate-900">
                      You're ready!
                    </p>

                    <p className="text-xs text-slate-500">
                      Start your journey
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

export default Register;