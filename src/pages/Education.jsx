import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5001";

const emptyForms = {
  graduation: {
    degree: "",
    institution: "",
    specialization: "",
    startYear: "",
    endYear: "",
    score: "",
  },

  higher_secondary: {
    institution: "",
    year: "",
    score: "",
  },

  secondary: {
    institution: "",
    year: "",
    score: "",
  },
};

function Education() {
  const [education, setEducation] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState(null);

  const [forms, setForms] = useState(emptyForms);

  // ==========================================
  // TOKEN
  // ==========================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  // ==========================================
  // FETCH PUBLIC EDUCATION
  // ==========================================

  const fetchEducation = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/public/education`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch education"
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
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (!formType) return;

    setForms((previous) => ({
      ...previous,
      [formType]: {
        ...previous[formType],
        [name]: value,
      },
    }));
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = (type) => {
    setFormType(type);
    setEditingId(null);
    setEditingType(null);

    setForms((previous) => ({
      ...previous,
      [type]: {
        ...emptyForms[type],
      },
    }));

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (item) => {
    setEditingId(item.id);
    setEditingType(item.type);

    setFormType(item.type);

    if (item.type === "graduation") {
      setForms((previous) => ({
        ...previous,
        graduation: {
          degree: item.degree || "",
          institution: item.institution || "",
          specialization:
            item.specialization || "",
          startYear:
            item.startYear || "",
          endYear:
            item.endYear || "",
          score: item.score || "",
        },
      }));
    }

    if (item.type === "higher_secondary") {
      setForms((previous) => ({
        ...previous,
        higher_secondary: {
          institution:
            item.institution || "",
          year: item.year || "",
          score: item.score || "",
        },
      }));
    }

    if (item.type === "secondary") {
      setForms((previous) => ({
        ...previous,
        secondary: {
          institution:
            item.institution || "",
          year: item.year || "",
          score: item.score || "",
        },
      }));
    }

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    setShowForm(false);
    setFormType(null);
    setEditingId(null);
    setEditingType(null);
    setError("");
  };

  // ==========================================
  // ADD / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      setError(
        "Login required to add or edit education."
      );
      return;
    }

    if (!formType) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let body = {
        type: formType,
      };

      // --------------------------------------
      // GRADUATION
      // --------------------------------------

      if (formType === "graduation") {
        const data = forms.graduation;

        if (
          !data.degree.trim() ||
          !data.institution.trim()
        ) {
          throw new Error(
            "Degree and university name are required."
          );
        }

        body = {
          type: "graduation",
          degree: data.degree.trim(),
          institution:
            data.institution.trim(),
          specialization:
            data.specialization.trim() || null,
          startYear: data.startYear
            ? Number(data.startYear)
            : null,
          endYear: data.endYear
            ? Number(data.endYear)
            : null,
          score:
            data.score.trim() || null,
        };
      }

      // --------------------------------------
      // HIGHER SECONDARY
      // --------------------------------------

      if (formType === "higher_secondary") {
        const data =
          forms.higher_secondary;

        if (!data.institution.trim()) {
          throw new Error(
            "School name is required."
          );
        }

        body = {
          type: "higher_secondary",
          degree: null,
          institution:
            data.institution.trim(),
          specialization: null,
          startYear: null,
          endYear: null,
          score:
            data.score.trim() || null,
          year: data.year
            ? Number(data.year)
            : null,
        };
      }

      // --------------------------------------
      // SECONDARY
      // --------------------------------------

      if (formType === "secondary") {
        const data = forms.secondary;

        if (!data.institution.trim()) {
          throw new Error(
            "School name is required."
          );
        }

        body = {
          type: "secondary",
          degree: null,
          institution:
            data.institution.trim(),
          specialization: null,
          startYear: null,
          endYear: null,
          score:
            data.score.trim() || null,
          year: data.year
            ? Number(data.year)
            : null,
        };
      }

      // --------------------------------------
      // REQUEST
      // --------------------------------------

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

        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save education"
        );
      }

      setSuccess(
        editingId
          ? "Education updated successfully!"
          : "Education added successfully!"
      );

      closeForm();

      await fetchEducation();
    } catch (error) {
      console.error(
        "Save education error:",
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
    const token = getToken();

    if (!token) {
      setError(
        "Login required to delete education."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this education?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

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

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete education"
        );
      }

      setSuccess(
        "Education deleted successfully!"
      );

      await fetchEducation();
    } catch (error) {
      console.error(
        "Delete education error:",
        error
      );

      setError(error.message);
    }
  };

  // ==========================================
  // FIND EDUCATION BY TYPE
  // ==========================================

  const graduation = education.find(
    (item) => item.type === "graduation"
  );

  const higherSecondary = education.find(
    (item) =>
      item.type === "higher_secondary"
  );

  const secondary = education.find(
    (item) => item.type === "secondary"
  );

  // ==========================================
  // AUTH STATUS
  // ==========================================

  const isOwner = Boolean(getToken());

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] px-5 py-20 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />

          <p className="mt-5 text-sm tracking-wide text-white/50">
            Loading education...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // CARD COMPONENT
  // ==========================================

  const EducationCard = ({
    item,
    type,
    icon,
    label,
  }) => {
    const isGraduation =
      type === "graduation";

    const title =
      type === "graduation"
        ? item?.degree || "Graduation"
        : type === "higher_secondary"
        ? "Higher Secondary"
        : "Secondary School";

    const institution =
      item?.institution ||
      "Institution not added";

    return (
      <div
        className="
          group relative flex min-h-[470px] flex-col
          overflow-hidden rounded-sm
          bg-[#f7f7f5] px-7 py-9
          text-center text-slate-900
          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
          transition duration-500
          hover:-translate-y-2
          hover:shadow-[0_30px_80px_rgba(0,0,0,0.4)]
          sm:px-9
        "
      >
        {/* TOP ICON */}

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white text-3xl shadow-sm">
          {icon}
        </div>

        {/* YEAR */}

        <div className="mt-7">
          <p className="text-xs font-semibold tracking-[0.25em] text-slate-400">
            {isGraduation
              ? `${item?.startYear || ""} ${
                  item?.endYear
                    ? `— ${item.endYear}`
                    : ""
                }`
              : item?.year || "Year"}
          </p>
        </div>

        <div className="mx-auto mt-5 h-px w-28 bg-slate-300" />

        {/* TITLE */}

        <h3 className="mt-7 text-xl font-bold tracking-tight text-slate-900">
          {title}
        </h3>

        {/* SPECIALIZATION */}

        {isGraduation &&
          item?.specialization && (
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {item.specialization}
            </p>
          )}

        {!isGraduation && (
          <p className="mt-3 text-sm uppercase tracking-[0.15em] text-slate-400">
            {label}
          </p>
        )}

        {/* INSTITUTION */}

        <div className="mt-auto pt-8">
          <div className="mx-auto mb-5 h-px w-28 bg-slate-300" />

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Institution
          </p>

          <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
            {institution}
          </p>

          {/* SCORE */}

          {item?.score && (
            <div className="mt-6">
              <span className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-bold tracking-wide text-white">
                {isGraduation
                  ? `CGPA ${item.score}`
                  : `${item.score}%`}
              </span>
            </div>
          )}
        </div>

        {/* OWNER ACTIONS */}

        {isOwner && item && (
          <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition group-hover:opacity-100">
            <button
              onClick={() =>
                openEditForm(item)
              }
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Edit
            </button>

            <button
              onClick={() =>
                handleDelete(item.id)
              }
              className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}

        {/* ADD */}

        {isOwner && !item && (
          <button
            onClick={() =>
              openAddForm(type)
            }
            className="mt-8 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:border-slate-500 hover:text-slate-900"
          >
            + Add {label}
          </button>
        )}
      </div>
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

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/60">
            Education
          </p>

          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Education & Degrees
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
                Academic background, qualifications
                and educational journey.
              </p>
            </div>

            {isOwner && (
              <div className="text-sm text-white/40">
                {education.length}{" "}
                {education.length === 1
                  ? "qualification"
                  : "qualifications"}
              </div>
            )}

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
          EDUCATION CARDS
          ====================================== */}

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-16">

        <div className="mb-12 text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/40">
            Academic Journey
          </p>

          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            My Education
          </h2>

        </div>


        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">

          {/* GRADUATION */}

          <EducationCard
            item={graduation}
            type="graduation"
            icon="🎓"
            label="Graduation"
          />

          {/* HIGHER SECONDARY */}

          <EducationCard
            item={higherSecondary}
            type="higher_secondary"
            icon="🏫"
            label="Higher Secondary"
          />

          {/* SECONDARY */}

          <EducationCard
            item={secondary}
            type="secondary"
            icon="🏫"
            label="Secondary School"
          />

        </div>

      </section>


      {/* ======================================
          ADD / EDIT MODAL
          ====================================== */}

      {showForm && formType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-8 backdrop-blur-sm">

          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-2xl sm:p-8">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                  Education
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  {editingId
                    ? "Edit Education"
                    : "Add Education"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="text-2xl text-white/40 transition hover:text-white"
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* ================================
                  GRADUATION FORM
                  ================================ */}

              {formType === "graduation" && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white/70">
                      University Name
                    </label>

                    <input
                      type="text"
                      name="institution"
                      value={
                        forms.graduation
                          .institution
                      }
                      onChange={handleChange}
                      placeholder="University Name"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/70">
                        Degree
                      </label>

                      <input
                        type="text"
                        name="degree"
                        value={
                          forms.graduation
                            .degree
                        }
                        onChange={handleChange}
                        placeholder="Degree"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/70">
                        Specialization
                      </label>

                      <input
                        type="text"
                        name="specialization"
                        value={
                          forms.graduation
                            .specialization
                        }
                        onChange={handleChange}
                        placeholder="Specialization"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                      />
                    </div>

                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/70">
                        Start Year
                      </label>

                      <input
                        type="number"
                        name="startYear"
                        value={
                          forms.graduation
                            .startYear
                        }
                        onChange={handleChange}
                        placeholder="Start Year"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/70">
                        End Year
                      </label>

                      <input
                        type="number"
                        name="endYear"
                        value={
                          forms.graduation
                            .endYear
                        }
                        onChange={handleChange}
                        placeholder="End Year"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/70">
                        CGPA
                      </label>

                      <input
                        type="text"
                        name="score"
                        value={
                          forms.graduation
                            .score
                        }
                        onChange={handleChange}
                        placeholder="CGPA"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                      />
                    </div>

                  </div>
                </>
              )}


              {/* ================================
                  HIGHER SECONDARY
                  ================================ */}

              {formType ===
                "higher_secondary" && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white/70">
                      School Name
                    </label>

                    <input
                      type="text"
                      name="institution"
                      value={
                        forms
                          .higher_secondary
                          .institution
                      }
                      onChange={handleChange}
                      placeholder="School Name"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/70">
                        Year
                      </label>

                      <input
                        type="number"
                        name="year"
                        value={
                          forms
                            .higher_secondary
                            .year
                        }
                        onChange={handleChange}
                        placeholder="Year"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/70">
                        Percentage
                      </label>

                      <input
                        type="text"
                        name="score"
                        value={
                          forms
                            .higher_secondary
                            .score
                        }
                        onChange={handleChange}
                        placeholder="Percentage"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                      />
                    </div>

                  </div>
                </>
              )}


              {/* ================================
                  SECONDARY
                  ================================ */}

              {formType === "secondary" && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white/70">
                      School Name
                    </label>

                    <input
                      type="text"
                      name="institution"
                      value={
                        forms.secondary
                          .institution
                      }
                      onChange={handleChange}
                      placeholder="School Name"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/70">
                        Year
                      </label>

                      <input
                        type="number"
                        name="year"
                        value={
                          forms.secondary.year
                        }
                        onChange={handleChange}
                        placeholder="Year"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/70">
                        Percentage
                      </label>

                      <input
                        type="text"
                        name="score"
                        value={
                          forms.secondary.score
                        }
                        onChange={handleChange}
                        placeholder="Percentage"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-blue-500"
                      />
                    </div>

                  </div>
                </>
              )}


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-white/10 pt-6">

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
                    : editingId
                    ? "Save Changes"
                    : "Add Education"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}


      {/* ======================================
          FOOTER
          ====================================== */}

      <section className="border-t border-white/10 px-5 py-10 text-center">

        <p className="text-xs uppercase tracking-[0.3em] text-white/30">
          SkillStack • Education
        </p>

      </section>

    </main>
  );
}

export default Education;
