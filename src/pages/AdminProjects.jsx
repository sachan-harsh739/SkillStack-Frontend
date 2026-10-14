import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_BASE } from "../config";

const emptyForm = {
  title: "",
  description: "",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
};

function AdminProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // ==========================================
  // LOAD EXPERTISE
  // ==========================================

  const fetchProjects = async () => {
    const token = getToken();

    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/expertise`,
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

        navigate("/admin-login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load expertise"
        );
      }

      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Expertise error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ==========================================
  // INPUT
  // ==========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // RESET
  // ==========================================

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (project) => {
    setEditingId(project.id);

    setForm({
      title: project.title || "",
      description: project.description || "",
      technologies: project.technologies || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // ADD / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editingId
        ? `${API_BASE}/api/expertise/${editingId}`
        : `${API_BASE}/api/expertise`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title: form.title,
          description: form.description,
          technologies: form.technologies,
          githubUrl: form.githubUrl,
          liveUrl: form.liveUrl,
        }),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        navigate("/admin-login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save expertise"
        );
      }

      setSuccess(
        editingId
          ? "Expertise updated successfully! ✅"
          : "Expertise added successfully! ✅"
      );

      resetForm();

      await fetchProjects();
    } catch (error) {
      console.error("Expertise save error:", error);
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
      "Are you sure you want to delete this expertise?"
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE}/api/expertise/${id}`,
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

        navigate("/admin-login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete expertise"
        );
      }

      setSuccess(
        "Expertise deleted successfully! ✅"
      );

      if (editingId === id) {
        resetForm();
      }

      await fetchProjects();
    } catch (error) {
      console.error("Expertise delete error:", error);
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
            Loading expertise...
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
              Manage Expertise
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

        {/* MESSAGES */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-600">
            {success}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            {editingId ? "Edit Expertise" : "Add Expertise"}
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {editingId
              ? "Update expertise"
              : "Add new expertise"}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            {/* TITLE */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Expertise Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="My Expertise Area"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe your expertise..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
              />

            </div>

            {/* TECHNOLOGIES */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Technologies
              </label>

              <input
                type="text"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MySQL, Express"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
              />

              <p className="mt-2 text-xs text-slate-400">
                Separate technologies with commas.
              </p>

            </div>

            {/* GITHUB */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-600">
                GitHub URL
              </label>

              <input
                type="url"
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
              />

            </div>

            {/* LIVE URL */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Live Demo URL
              </label>

              <input
                type="url"
                name="liveUrl"
                value={form.liveUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
              />

            </div>

          </div>

          {/* BUTTONS */}

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">

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
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Expertise"
                : "Add Expertise"}
            </button>

          </div>

        </form>

        {/* EXPERTISE LIST */}

        <section className="mt-10">

          <div className="flex items-end justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-600">
                Current Expertise
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Your Expertise
              </h2>
            </div>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
              {projects.length} expertise record
              {projects.length !== 1 ? "s" : ""}
            </span>

          </div>

          {projects.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">

              <div className="text-3xl">
                💻
              </div>

              <p className="mt-4 text-sm text-slate-500">
                No expertise added yet.
              </p>

            </div>

          ) : (

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {projects.map((project) => {

                const technologies =
                  project.technologies
                    ? project.technologies
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                    : [];

                return (
                  <article
                    key={project.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h3 className="text-xl font-bold">
                          {project.title}
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                          {project.description ||
                            "No description added."}
                        </p>

                      </div>

                      <span className="shrink-0 text-xs text-slate-400">
                        EXPERTISE
                      </span>

                    </div>

                    {technologies.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">

                        {technologies.map(
                          (technology, index) => (
                            <span
                              key={`${technology}-${index}`}
                              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600"
                            >
                              {technology}
                            </span>
                          )
                        )}

                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">

                      <div className="flex gap-4">

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-slate-500 hover:text-slate-950"
                          >
                            GitHub ↗
                          </a>
                        )}

                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-slate-500 hover:text-slate-950"
                          >
                            Live Demo ↗
                          </a>
                        )}

                      </div>

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(project)
                          }
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(project.id)
                          }
                          disabled={
                            deletingId === project.id
                          }
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingId === project.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </section>

      </section>

    </main>
  );
}

export default AdminProjects;
