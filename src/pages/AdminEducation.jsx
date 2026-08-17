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
  // LOAD EDUCATION
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
          data.message || "Failed to load education"
        );
      }

      setEducation(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error(
        "Education fetch error:",
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
            "Failed to save education"
        );
      }

      setSuccess(
        editingId
          ? "Education updated successfully! ✅"
          : "Education added successfully! ✅"
      );

      resetForm();

      await fetchEducation();

    } catch (error) {
      console.error(
        "Education save error:",
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
      "Are you sure you want to delete this education record?"
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
            "Failed to delete education"
        );
      }

      setSuccess(
        "Education deleted successfully! ✅"
      );

      if (editingId === id) {
        resetForm();
      }

      await fetchEducation();

    } catch (error) {
      console.error(
        "Education delete error:",
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
      <main className="min-h-screen bg-[#080808] text-white">

        <div className="flex min-h-screen items-center justify-center">

          <p className="text-white/40">
            Loading education...
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

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
              SkillStack Admin
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Manage Education
            </h1>

          </div>

          <button
            onClick={() => navigate("/admin")}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
          >
            ← Dashboard
          </button>

        </div>

      </header>

      {/* CONTENT */}

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

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

        {/* ==========================================
            FORM
            ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8"
        >

          <div className="mb-8">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
              {editingId
                ? "Edit Education"
                : "Add Education"}
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {editingId
                ? "Update education"
                : "Add new education"}
            </h2>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* TYPE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/70">
                Education Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-blue-400/50"
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
              <label className="mb-2 block text-sm font-semibold text-white/70">
                Institution
              </label>

              <input
                type="text"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                required
                placeholder="Institution name"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />
            </div>

            {/* DEGREE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/70">
                Degree
              </label>

              <input
                type="text"
                name="degree"
                value={form.degree}
                onChange={handleChange}
                placeholder="B.Tech, BCA, etc."
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />
            </div>

            {/* SPECIALIZATION */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/70">
                Specialization
              </label>

              <input
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                placeholder="Computer Science & Engineering"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />
            </div>

            {/* START YEAR */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/70">
                Start Year
              </label>

              <input
                type="number"
                name="startYear"
                value={form.startYear}
                onChange={handleChange}
                placeholder="2023"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />
            </div>

            {/* END YEAR */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/70">
                End Year
              </label>

              <input
                type="number"
                name="endYear"
                value={form.endYear}
                onChange={handleChange}
                placeholder="2027"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />
            </div>

            {/* SCORE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/70">
                Score / CGPA / Percentage
              </label>

              <input
                type="text"
                name="score"
                value={form.score}
                onChange={handleChange}
                placeholder="7.79 CGPA"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />
            </div>

            {/* YEAR */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/70">
                Year
              </label>

              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="2023"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />
            </div>

          </div>

          {/* BUTTONS */}

          <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-white/[0.08] pt-6">

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Education"
                : "Add Education"}
            </button>

          </div>

        </form>

        {/* ==========================================
            EDUCATION LIST
            ========================================== */}

        <section className="mt-10">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
                Current Records
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Your Education
              </h2>

            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/40">
              {education.length} record
              {education.length !== 1 ? "s" : ""}
            </span>

          </div>

          {education.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">

              <div className="text-3xl">
                🎓
              </div>

              <p className="mt-4 text-sm text-white/40">
                No education records added yet.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-4">

              {education.map((item) => (

                <article
                  key={item.id}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-300">
                          {item.type?.replace(
                            "_",
                            " "
                          )}
                        </span>

                      </div>

                      <h3 className="mt-3 text-xl font-bold">
                        {item.degree ||
                          item.type ||
                          "Education"}
                      </h3>

                      <p className="mt-1 text-sm text-white/50">
                        {item.institution ||
                          "Institution"}
                      </p>

                      {item.specialization && (
                        <p className="mt-2 text-sm text-white/35">
                          {item.specialization}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/35">

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
                        className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
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
                        className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
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
