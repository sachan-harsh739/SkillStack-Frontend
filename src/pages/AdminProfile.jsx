import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5001";

function AdminProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    university: "",
    graduationYear: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // CHECK ADMIN + LOAD PROFILE
  // ==========================================

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin-login", { replace: true });
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");

          navigate("/admin-login", {
            replace: true,
          });

          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile"
          );
        }

        setForm({
          name: data.name || "",
          email: data.email || "",
          university: data.university || "",
          graduationYear:
            data.graduationYear || "",
          linkedinUrl:
            data.linkedinUrl || "",
          githubUrl:
            data.githubUrl || "",
          portfolioUrl:
            data.portfolioUrl || "",
        });
      } catch (error) {
        console.error(
          "Admin profile error:",
          error
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin-login", {
        replace: true,
      });

      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE}/api/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: form.name,
            email: form.email,
            university: form.university,

            graduationYear: form.graduationYear
              ? Number(form.graduationYear)
              : null,

            linkedinUrl: form.linkedinUrl,
            githubUrl: form.githubUrl,
            portfolioUrl: form.portfolioUrl,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        navigate("/admin-login", {
          replace: true,
        });

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update profile"
        );
      }

      setForm({
        name: data.user.name || "",
        email: data.user.email || "",
        university:
          data.user.university || "",
        graduationYear:
          data.user.graduationYear || "",
        linkedinUrl:
          data.user.linkedinUrl || "",
        githubUrl:
          data.user.githubUrl || "",
        portfolioUrl:
          data.user.portfolioUrl || "",
      });

      setSuccess(
        "Profile updated successfully! ✅"
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080808] text-white">

        <div className="flex min-h-screen items-center justify-center">

          <p className="text-white/40">
            Loading admin profile...
          </p>

        </div>

      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* HEADER */}

      <header className="border-b border-white/[0.08]">

        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 sm:px-8">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
              SkillStack Admin
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Manage Profile
            </h1>

          </div>

          <button
            onClick={() =>
              navigate("/admin")
            }
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
          >
            ← Dashboard
          </button>

        </div>

      </header>

      {/* CONTENT */}

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8">

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8"
        >

          <div className="mb-8">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
              Profile Information
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Update your portfolio
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Changes made here will appear on your
              public profile.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* NAME */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-white/70">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />

            </div>

            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-white/70">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />

            </div>

            {/* UNIVERSITY */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-white/70">
                University
              </label>

              <input
                type="text"
                name="university"
                value={form.university}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />

            </div>

            {/* GRADUATION YEAR */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-white/70">
                Graduation Year
              </label>

              <input
                type="number"
                name="graduationYear"
                value={form.graduationYear}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />

            </div>

            {/* LINKEDIN */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-white/70">
                LinkedIn URL
              </label>

              <input
                type="url"
                name="linkedinUrl"
                value={form.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />

            </div>

            {/* GITHUB */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-white/70">
                GitHub URL
              </label>

              <input
                type="url"
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />

            </div>

            {/* PORTFOLIO */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-white/70">
                Portfolio URL
              </label>

              <input
                type="url"
                name="portfolioUrl"
                value={form.portfolioUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />

            </div>

          </div>

          {/* BUTTON */}

          <div className="mt-8 flex justify-end border-t border-white/[0.08] pt-6">

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}

export default AdminProfile;
