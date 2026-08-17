import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  // ==========================================
  // CHECK ADMIN LOGIN
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin-login", { replace: true });
  };

  // ==========================================
  // ADMIN USER
  // ==========================================

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "null"
  );

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* ==========================================
          HEADER
          ========================================== */}

      <header className="border-b border-white/[0.08] bg-white/[0.02]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
              SkillStack
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Admin Dashboard
            </h1>
          </div>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
          >
            Logout
          </button>

        </div>

      </header>


      {/* ==========================================
          CONTENT
          ========================================== */}

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">

        {/* ==========================================
            ADMIN INFO
            ========================================== */}

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Authorized Admin
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Welcome, {adminUser?.name || "Admin"} 👋
          </h2>

          <p className="mt-2 text-sm text-white/40">
            {adminUser?.email || ""}
          </p>

          <div className="mt-4 inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            🔐 Admin Access
          </div>

        </div>


        {/* ==========================================
            MANAGEMENT TITLE
            ========================================== */}

        <div className="mt-8">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
            Portfolio Management
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Manage Everything
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            Manage your public portfolio content from this private
            admin dashboard.
          </p>

        </div>


        {/* ==========================================
            MANAGEMENT CARDS
            ========================================== */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">


          {/* ==========================================
              PROFILE
              ========================================== */}

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">

            <div className="text-2xl">
              👤
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Profile
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Update your name, university, graduation year,
              GitHub and LinkedIn.
            </p>

            <button
              onClick={() => navigate("/admin/profile")}
              className="mt-6 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Manage Profile →
            </button>

          </div>


          {/* ==========================================
              PROJECTS
              ========================================== */}

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">

            <div className="text-2xl">
              💻
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Projects
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Add, edit and delete your portfolio projects.
            </p>

            <button
              onClick={() => navigate("/admin/projects")}
              className="mt-6 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Manage Projects →
            </button>

          </div>


          {/* ==========================================
              EDUCATION
              ========================================== */}

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">

            <div className="text-2xl">
              🎓
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Education
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Add, edit and delete your academic information.
            </p>

            <button
              onClick={() => navigate("/admin/education")}
              className="mt-6 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Manage Education →
            </button>

          </div>


          {/* ==========================================
              CERTIFICATIONS
              ========================================== */}

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">

            <div className="text-2xl">
              🏆
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Certifications
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Add, edit and delete your certifications.
            </p>

            <button
              onClick={() => navigate("/admin/certifications")}
              className="mt-6 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Manage Certifications →
            </button>

          </div>


          {/* ==========================================
              LEETCODE
              ========================================== */}

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">

            <div className="text-2xl">
              🧩
            </div>

            <h3 className="mt-5 text-xl font-bold">
              LeetCode
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Update your LeetCode username and profile URL.
            </p>

            <button
              onClick={() => navigate("/admin/leetcode")}
              className="mt-6 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Manage LeetCode →
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}

export default AdminDashboard;
