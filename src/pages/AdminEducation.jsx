import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

const emptyForm = {
  type: "graduation",
  degree: "",
  institution: "",
  specialization: "",
  startYear: "",
  endYear: "",
  score: "",
  year: "",
};

function AdminEducation() {
  const navigate = useNavigate();

  const [education, setEducation] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // ADMIN TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // ==========================================
  // LOAD HISTORY
  // ==========================================

  const fetchEducation = async () => {
    const token = getToken();

    if (!token) {
      navigate("/admin-login", {
        replace: true,
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/education`,
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
          data.message || "Failed to load history"
        );
      }

      setEducation(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error(
        "History fetch error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

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
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      type: item.type || "graduation",
      degree: item.degree || "",
      institution: item.institution || "",
      specialization:
        item.specialization || "",
      startYear: item.startYear || "",
      endYear: item.endYear || "",
      score: item.score || "",
      year: item.year || "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // SAVE / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

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
      const url = editingId
        ? `${API_BASE}/api/education/${editingId}`
        : `${API_BASE}/api/education`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          type: form.type,
          degree: form.degree,
          institution: form.institution,
          specialization:
            form.specialization,
          startYear: form.startYear
            ? Number(form.startYear)
            : null,
          endYear: form.endYear
            ? Number(form.endYear)
            : null,
          score: form.score,
          year: form.year
            ? Number(form.year)
            : null,
        }),
      });

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
            "Failed to save history"
        );
      }

      setSuccess(
        editingId
          ? "History updated successfully! ✅"
          : "History added successfully! ✅"
      );

      resetForm();

      await fetchEducation();

    } catch (error) {
      console.error(
        "History save error:",
        error
      );

      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this history record?"
    );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/admin-login", {
        replace: true,
      });
      return;
    }

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE}/api/education/${id}`,
        {
          method: "DELETE",

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
          data.message ||
            "Failed to delete history"
        );
      }

      setSuccess(
        "History deleted successfully! ✅"
      );

      if (editingId === id) {
        resetForm();
      }

      await fetchEducation();

    } catch (error) {
      console.error(
        "History delete error:",
        error
      );

      setError(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-slate-950">

        <div className="flex min-h-screen items-center justify-center">

          <p className="text-slate-500">
            Loading history...
          </p>

        </div>

      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-white text-slate-950">

      {/* HEADER */}

      <header className="border-b border-slate-200">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              SkillStack Admin
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Manage History
            </h1>

          </div>

          <button
            onClick={() => navigate("/admin")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
          >
            ← Dashboard
          </button>

        </div>

      </header>

      {/* CONTENT */}

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* ==========================================
            FORM
            ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >

          <div className="mb-8">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
              {editingId
                ? "Edit History"
                : "Add History"}
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {editingId
                ? "Update history"
                : "Add new history"}
            </h2>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* TYPE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                History Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-slate-950 focus:ring-slate-950/10"
              >
                <option value="graduation">
                  Graduation
                </option>

                <option value="higher_secondary">
                  Higher Secondary
                </option>

                <option value="secondary">
                  Secondary
                </option>
              </select>
            </div>

            {/* INSTITUTION */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Institution
              </label>

              <input
                type="text"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                required
                placeholder="Institution name"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-slate-950/10"
              />
            </div>

            {/* DEGREE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Degree
              </label>

              <input
                type="text"
                name="degree"
                value={form.degree}
                onChange={handleChange}
                placeholder="B.Tech, BCA, etc."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-slate-950/10"
              />
            </div>

            {/* SPECIALIZATION */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Specialization
              </label>

              <input
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                placeholder="Computer Science & Engineering"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-slate-950/10"
              />
            </div>

            {/* START YEAR */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Start Year
              </label>

              <input
                type="number"
                name="startYear"
                value={form.startYear}
                onChange={handleChange}
                placeholder="2023"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-slate-950/10"
              />
            </div>

            {/* END YEAR */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                End Year
              </label>

              <input
                type="number"
                name="endYear"
                value={form.endYear}
                onChange={handleChange}
                placeholder="2027"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-slate-950/10"
              />
            </div>

            {/* SCORE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Score / CGPA / Percentage
              </label>

              <input
                type="text"
                name="score"
                value={form.score}
                onChange={handleChange}
                placeholder="7.79 CGPA"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-slate-950/10"
              />
            </div>

            {/* YEAR */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Year
              </label>

              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="2023"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-slate-950/10"
              />
            </div>

          </div>

          {/* BUTTONS */}

          <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update History"
                : "Add History"}
            </button>

          </div>

        </form>

        {/* ==========================================
            HISTORY LIST
            ========================================== */}

        <section className="mt-10">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                Current Records
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Your History
              </h2>

            </div>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
              {education.length} record
              {education.length !== 1 ? "s" : ""}
            </span>

          </div>

          {education.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">

              <div className="text-3xl">
                🎓
              </div>

              <p className="mt-4 text-sm text-slate-500">
                No history records added yet.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-4">

              {education.map((item) => (

                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                          {item.type?.replace(
                            "_",
                            " "
                          )}
                        </span>

                      </div>

                      <h3 className="mt-3 text-xl font-bold">
                        {item.degree ||
                          item.type ||
                          "History"}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.institution ||
                          "Institution"}
                      </p>

                      {item.specialization && (
                        <p className="mt-2 text-sm text-slate-400">
                          {item.specialization}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">

                        {(item.startYear ||
                          item.endYear) && (
                          <span>
                            {item.startYear || ""}
                            {item.endYear
                              ? ` - ${item.endYear}`
                              : ""}
                          </span>
                        )}

                        {item.year && (
                          <span>
                            Year: {item.year}
                          </span>
                        )}

                        {item.score && (
                          <span>
                            Score: {item.score}
                          </span>
                        )}

                      </div>

                    </div>

                    <div className="flex shrink-0 gap-3">

                      <button
                        onClick={() =>
                          handleEdit(item)
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(item.id)
                        }
                        disabled={
                          deletingId === item.id
                        }
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === item.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </section>

    </main>
  );
}

export default AdminEducation;
