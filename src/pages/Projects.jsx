import { useEffect, useState } from "react";

import { API_BASE } from "../config";

function Expertise() {
  const [projects, setExpertise] = useState([]);

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
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // ==========================================
  // FETCH EXPERTISE
  // ==========================================

  const fetchExpertise = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/expertise`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch expertise"
        );
      }

      setExpertise(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error(
        "Fetch expertise error:",
        error
      );

      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpertise();
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
  // ADD / UPDATE EXPERTISE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      setError(
        "Owner login is required to manage expertise."
      );
      return;
    }

    if (!form.title.trim()) {
      setError("Expertise title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError(
        "Expertise description is required."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editingProject
        ? `${API_BASE}/api/expertise/${editingProject.id}`
        : `${API_BASE}/api/expertise`;

      const method = editingProject
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
            "Failed to save expertise"
        );
      }

      setSuccess(
        editingProject
          ? "Expertise updated successfully!"
          : "Expertise added successfully!"
      );

      closeForm();

      await fetchExpertise();

    } catch (error) {
      console.error(
        "Expertise save error:",
        error
      );

      setError(error.message);

    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // DELETE EXPERTISE
  // ==========================================

  const deleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expertise?"
    );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Owner login is required to manage expertise."
      );
      return;
    }

    try {
      setError("");
      setSuccess("");

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

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete expertise"
        );
      }

      setSuccess(
        "Expertise deleted successfully!"
      );

      await fetchExpertise();

    } catch (error) {
      console.error(
        "Delete expertise error:",
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
      <main className="min-h-screen bg-white px-5 py-20 text-slate-950">

        <div className="mx-auto max-w-7xl text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />

          <p className="mt-5 text-sm tracking-wide text-slate-500">
            Loading expertise...
          </p>

        </div>

      </main>
    );
  }


  // ==========================================
  // EXPERTISE CARD
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
          bg-white
          border border-slate-200
          text-slate-900
          shadow-sm
          transition duration-500
          hover:-translate-y-2
          hover:shadow-md
        "
      >

        {/* EXPERTISE VISUAL */}

        <div className="relative flex h-48 items-center justify-center overflow-hidden bg-slate-100 border-b border-slate-200">

          <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white text-3xl font-bold text-slate-700">

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
            Featured Expertise
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {project.title}
          </h2>

          <p className="mt-4 flex-1 text-sm leading-7 text-slate-500">
            {project.description ||
              "No expertise description available."}
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
    <main className="min-h-screen bg-white text-slate-950">

      {/* ======================================
          HEADER
      ====================================== */}

      <section className="border-b border-slate-200 px-5 py-16 sm:px-8 lg:px-12">

        <div className="mx-auto max-w-7xl">

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-500">
            Developer Portfolio
          </p>

          <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>

              <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Expertise
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                A collection of expertise, technologies,
                source code and live demonstrations.
              </p>

            </div>


            {/* ADD EXPERTISE */}

            <button
              onClick={
                showForm
                  ? closeForm
                  : openAddForm
              }
              className="w-fit rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              {showForm
                ? "Close Form"
                : "+ Add Expertise"}
            </button>

          </div>

        </div>

      </section>


      {/* ======================================
          MESSAGES
      ====================================== */}

      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8 lg:px-12">

        {success && (

          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {success}
          </div>

        )}

        {error && (

          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
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
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >

            <div className="mb-8">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Expertise Manager
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">

                {editingProject
                  ? "Edit Expertise"
                  : "Add New Expertise"}

              </h2>

            </div>


            <div className="grid gap-5 md:grid-cols-2">

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Expertise Name
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Expertise Name"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />

              </div>


              {/* TECHNOLOGIES */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Technologies
                </label>

                <input
                  type="text"
                  name="tech"
                  value={form.tech}
                  onChange={handleChange}
                  placeholder="React, Node.js, MySQL"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />

              </div>


              {/* DESCRIPTION */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe your expertise..."
                  required
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />

              </div>


              {/* GITHUB */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  GitHub URL
                </label>

                <input
                  type="url"
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />

              </div>


              {/* LIVE DEMO */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Live Demo URL
                </label>

                <input
                  type="url"
                  name="demo"
                  value={form.demo}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />

              </div>

            </div>


            {/* BUTTONS */}

            <div className="mt-7 flex justify-end gap-3 border-t border-slate-200 pt-6">

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving
                  ? "Saving..."
                  : editingProject
                  ? "Save Changes"
                  : "Add Expertise"}

              </button>

            </div>

          </form>

        </section>

      )}


      {/* ======================================
          EXPERTISE
      ====================================== */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">

        <div className="mb-10 text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            My Work
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-950">
            Featured Expertise
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Explore the expertise, technologies and
            solutions built throughout my developer journey.
          </p>

        </div>


        {projects.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-14 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-700">
              &lt;/&gt;
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-950">
              No expertise yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Expertise will appear here once it is added.
            </p>

            <button
              onClick={openAddForm}
              className="mt-6 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              + Add First Expertise
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

      <section className="border-t border-slate-200 px-5 py-10 text-center">

        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          SkillStack • Expertise
        </p>

      </section>

    </main>
  );
}

export default Expertise;
