import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

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
  // LOAD PROJECTS
  // ==========================================

  const fetchProjects = async () => {
    const token = getToken();

    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/projects`,
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
          data.message || "Failed to load projects"
        );
      }

      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Projects error:", error);
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
        ? `${API_BASE}/api/projects/${editingId}`
        : `${API_BASE}/api/projects`;

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
          data.message || "Failed to save project"
        );
      }

      setSuccess(
        editingId
          ? "Project updated successfully! ✅"
          : "Project added successfully! ✅"
      );

      resetForm();

      await fetchProjects();
    } catch (error) {
      console.error("Project save error:", error);
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
      "Are you sure you want to delete this project?"
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
        `${API_BASE}/api/projects/${id}`,
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
          data.message || "Failed to delete project"
        );
      }

      setSuccess(
        "Project deleted successfully! ✅"
      );

      if (editingId === id) {
        resetForm();
      }

      await fetchProjects();
    } catch (error) {
      console.error("Project delete error:", error);
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
            Loading projects...
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
              Manage Projects
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

        {/* MESSAGES */}

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

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8"
        >

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
            {editingId ? "Edit Project" : "Add Project"}
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {editingId
              ? "Update project"
              : "Add new project"}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            {/* TITLE */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-white/70">
                Project Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="My Awesome Project"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-white/70">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe your project..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />

            </div>

            {/* TECHNOLOGIES */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-white/70">
                Technologies
              </label>

              <input
                type="text"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MySQL, Express"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />

              <p className="mt-2 text-xs text-white/25">
                Separate technologies with commas.
              </p>

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

            {/* LIVE URL */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-white/70">
                Live Demo URL
              </label>

              <input
                type="url"
                name="liveUrl"
                value={form.liveUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-400/50"
              />

            </div>

          </div>

          {/* BUTTONS */}

          <div className="mt-8 flex justify-end gap-3 border-t border-white/[0.08] pt-6">

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
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Project"
                : "Add Project"}
            </button>

          </div>

        </form>

        {/* PROJECT LIST */}

        <section className="mt-10">

          <div className="flex items-end justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
                Current Projects
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Your Projects
              </h2>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/40">
              {projects.length} project
              {projects.length !== 1 ? "s" : ""}
            </span>

          </div>

          {projects.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">

              <div className="text-3xl">
                💻
              </div>

              <p className="mt-4 text-sm text-white/40">
                No projects added yet.
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
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h3 className="text-xl font-bold">
                          {project.title}
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-white/40">
                          {project.description ||
                            "No description added."}
                        </p>

                      </div>

                      <span className="shrink-0 text-xs text-white/20">
                        PROJECT
                      </span>

                    </div>

                    {technologies.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">

                        {technologies.map(
                          (technology, index) => (
                            <span
                              key={`${technology}-${index}`}
                              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/50"
                            >
                              {technology}
                            </span>
                          )
                        )}

                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5">

                      <div className="flex gap-4">

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-white/50 hover:text-white"
                          >
                            GitHub ↗
                          </a>
                        )}

                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-blue-400 hover:text-blue-300"
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
                          className="rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-500/20"
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
                          className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-50"
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
