import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    tech: "",
    github: "",
    demo: "",
  });

  // ==========================================
  // FETCH PROJECTS
  // ==========================================

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/projects`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch projects"
        );
      }

      setProjects(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error(
        "Fetch projects error:",
        error
      );

      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);


  // ==========================================
  // FORM CHANGE
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
    setForm({
      title: "",
      description: "",
      tech: "",
      github: "",
      demo: "",
    });
  };


  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setEditingProject(null);

    resetForm();

    setShowForm(true);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (project) => {
    setEditingProject(project);

    setForm({
      title: project.title || "",
      description: project.description || "",
      tech: project.technologies || "",
      github: project.githubUrl || "",
      demo: project.liveUrl || "",
    });

    setShowForm(true);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    setShowForm(false);
    setEditingProject(null);
    resetForm();
  };


  // ==========================================
  // ADD / UPDATE PROJECT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError(
        "Project description is required."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editingProject
        ? `${API_BASE}/api/projects/${editingProject.id}`
        : `${API_BASE}/api/projects`;

      const method = editingProject
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          technologies: form.tech.trim(),
          githubUrl: form.github.trim(),
          liveUrl: form.demo.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save project"
        );
      }

      setSuccess(
        editingProject
          ? "Project updated successfully!"
          : "Project added successfully!"
      );

      closeForm();

      await fetchProjects();

    } catch (error) {
      console.error(
        "Project save error:",
        error
      );

      setError(error.message);

    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // DELETE PROJECT
  // ==========================================

  const deleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE}/api/projects/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete project"
        );
      }

      setSuccess(
        "Project deleted successfully!"
      );

      await fetchProjects();

    } catch (error) {
      console.error(
        "Delete project error:",
        error
      );

      setError(error.message);
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] px-5 py-20 text-white">

        <div className="mx-auto max-w-7xl text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />

          <p className="mt-5 text-sm tracking-wide text-white/50">
            Loading projects...
          </p>

        </div>

      </main>
    );
  }


  // ==========================================
  // PROJECT CARD
  // ==========================================

  const ProjectCard = ({ project }) => {

    const technologies = project.technologies
      ? project.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    return (
      <article
        className="
          group relative flex min-h-[500px]
          flex-col overflow-hidden rounded-sm
          bg-[#f7f7f5]
          text-slate-900
          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
          transition duration-500
          hover:-translate-y-2
          hover:shadow-[0_30px_80px_rgba(0,0,0,0.4)]
        "
      >

        {/* PROJECT VISUAL */}

        <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">

          <div className="absolute inset-0 opacity-20">

            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-500 blur-3xl" />

            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-purple-500 blur-3xl" />

          </div>

          <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-3xl font-bold text-white backdrop-blur">

            &lt;/&gt;

          </div>


          {/* OWNER ACTIONS */}

          <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition group-hover:opacity-100">

            <button
              onClick={() =>
                openEditForm(project)
              }
              className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow"
            >
              Edit
            </button>

            <button
              onClick={() =>
                deleteProject(project.id)
              }
              className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow"
            >
              Delete
            </button>

          </div>

        </div>


        {/* CONTENT */}

        <div className="flex flex-1 flex-col p-7">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Featured Project
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {project.title}
          </h2>

          <p className="mt-4 flex-1 text-sm leading-7 text-slate-500">
            {project.description ||
              "No project description available."}
          </p>


          {/* TECHNOLOGIES */}

          {technologies.length > 0 && (

            <div className="mt-6 flex flex-wrap gap-2">

              {technologies.map(
                (technology, index) => (

                  <span
                    key={`${technology}-${index}`}
                    className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    {technology}
                  </span>

                )
              )}

            </div>

          )}


          {/* LINKS */}

          <div className="mt-7 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5">

            {project.githubUrl ? (

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                GitHub →
              </a>

            ) : (

              <span className="rounded-lg border border-slate-200 px-4 py-3 text-center text-sm text-slate-300">
                GitHub
              </span>

            )}


            {project.liveUrl ? (

              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Live Demo →
              </a>

            ) : (

              <span className="rounded-lg bg-slate-100 px-4 py-3 text-center text-sm text-slate-300">
                Live Demo
              </span>

            )}

          </div>

        </div>

      </article>
    );
  };


  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">

      {/* ======================================
          HEADER
      ====================================== */}

      <section className="border-b border-white/10 px-5 py-16 sm:px-8 lg:px-12">

        <div className="mx-auto max-w-7xl">

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/50">
            Developer Portfolio
          </p>

          <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Projects
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
                A collection of projects, technologies,
                source code and live demonstrations.
              </p>

            </div>


            {/* ADD PROJECT */}

            <button
              onClick={
                showForm
                  ? closeForm
                  : openAddForm
              }
              className="w-fit rounded-lg bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-white/90"
            >
              {showForm
                ? "Close Form"
                : "+ Add Project"}
            </button>

          </div>

        </div>

      </section>


      {/* ======================================
          MESSAGES
      ====================================== */}

      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8 lg:px-12">

        {success && (

          <div className="mb-6 rounded-lg border border-green-400/20 bg-green-400/10 px-5 py-4 text-sm font-medium text-green-300">
            {success}
          </div>

        )}

        {error && (

          <div className="mb-6 rounded-lg border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm font-medium text-red-300">
            {error}
          </div>

        )}

      </section>


      {/* ======================================
          ADD / EDIT FORM
      ====================================== */}

      {showForm && (

        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-2xl sm:p-8"
          >

            <div className="mb-8">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                Project Manager
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">

                {editingProject
                  ? "Edit Project"
                  : "Add New Project"}

              </h2>

            </div>


            <div className="grid gap-5 md:grid-cols-2">

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-white/70">
                  Project Name
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Project Name"
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                />

              </div>


              {/* TECHNOLOGIES */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-white/70">
                  Technologies
                </label>

                <input
                  type="text"
                  name="tech"
                  value={form.tech}
                  onChange={handleChange}
                  placeholder="React, Node.js, MySQL"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-blue-500"
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
                  required
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                />

              </div>


              {/* GITHUB */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-white/70">
                  GitHub URL
                </label>

                <input
                  type="url"
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                />

              </div>


              {/* LIVE DEMO */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-white/70">
                  Live Demo URL
                </label>

                <input
                  type="url"
                  name="demo"
                  value={form.demo}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                />

              </div>

            </div>


            {/* BUTTONS */}

            <div className="mt-7 flex justify-end gap-3 border-t border-white/10 pt-6">

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving
                  ? "Saving..."
                  : editingProject
                  ? "Save Changes"
                  : "Add Project"}

              </button>

            </div>

          </form>

        </section>

      )}


      {/* ======================================
          PROJECTS
      ====================================== */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">

        <div className="mb-10 text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/40">
            My Work
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            Featured Projects
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/40">
            Explore the projects, technologies and
            solutions built throughout my developer journey.
          </p>

        </div>


        {projects.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-14 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-2xl">
              &lt;/&gt;
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">
              No projects yet
            </h3>

            <p className="mt-2 text-sm text-white/40">
              Projects will appear here once they are added.
            </p>

            <button
              onClick={openAddForm}
              className="mt-6 rounded-lg bg-white px-5 py-3 text-sm font-bold text-black"
            >
              + Add First Project
            </button>

          </div>

        ) : (

          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">

            {projects.map((project) => (

              <ProjectCard
                key={project.id}
                project={project}
              />

            ))}

          </div>

        )}

      </section>


      {/* ======================================
          FOOTER
      ====================================== */}

      <section className="border-t border-white/10 px-5 py-10 text-center">

        <p className="text-xs uppercase tracking-[0.3em] text-white/30">
          SkillStack • Projects
        </p>

      </section>

    </main>
  );
}

export default Projects;