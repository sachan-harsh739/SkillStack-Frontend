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
    <main className="min-h-screen bg-white text-slate-950">

      {/* ==========================================
          HEADER
          ========================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              SkillStack
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Admin Dashboard
            </h1>
          </div>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
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

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Authorized Admin
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Welcome, {adminUser?.name || "Admin"} 👋
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {adminUser?.email || ""}
          </p>

          <div className="mt-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            🔐 Admin Access
          </div>

        </div>


        {/* ==========================================
            MANAGEMENT TITLE
            ========================================== */}

        <div className="mt-8">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            Portfolio Management
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Manage Everything
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your public portfolio content from this private
            admin dashboard.
          </p>

        </div>


        {/* ==========================================
            MANAGEMENT CARDS
            ========================================== */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">


          {/* ==========================================
              EXPERTISE
              ========================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="text-2xl">
              💻
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Expertise
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add, edit and delete your portfolio expertise.
            </p>

            <button
              onClick={() => navigate("/admin/expertise")}
              className="mt-6 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Manage Expertise →
            </button>

          </div>


          {/* ==========================================
              HISTORY
              ========================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="text-2xl">
              🎓
            </div>

            <h3 className="mt-5 text-xl font-bold">
              History
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add, edit and delete your academic history.
            </p>

            <button
              onClick={() => navigate("/admin/history")}
              className="mt-6 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Manage History →
            </button>

          </div>


          {/* ==========================================
              CERTIFICATIONS
              ========================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="text-2xl">
              🏆
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Certifications
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add, edit and delete your certifications.
            </p>

            <button
              onClick={() => navigate("/admin/certifications")}
              className="mt-6 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Manage Certifications →
            </button>

          </div>


          {/* ==========================================
              LEETCODE
              ========================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="text-2xl">
              🧩
            </div>

            <h3 className="mt-5 text-xl font-bold">
              LeetCode
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Update your LeetCode username and profile URL.
            </p>

            <button
              onClick={() => navigate("/admin/leetcode")}
              className="mt-6 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
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
