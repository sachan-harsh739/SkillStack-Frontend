import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

function Certification() {
  const [certifications, setCertifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCertification, setEditingCertification] =
    useState(null);

  const [form, setForm] = useState({
    certificateName: "",
    issuingOrganization: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
  });

  // ==========================================
  // TOKEN
  // ==========================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  const isOwner = Boolean(getToken());

  // ==========================================
  // FETCH PUBLIC CERTIFICATIONS
  // ==========================================

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/public/certifications`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch certifications"
        );
      }

      setCertifications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Fetch certifications error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  // ==========================================
  // HANDLE INPUT
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
      certificateName: "",
      issuingOrganization: "",
      issueDate: "",
      credentialId: "",
      credentialUrl: "",
    });
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setEditingCertification(null);

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

  const openEditForm = (certification) => {
    setEditingCertification(certification);

    setForm({
      certificateName:
        certification.certificateName || "",

      issuingOrganization:
        certification.issuingOrganization || "",

      issueDate:
        certification.issueDate
          ? certification.issueDate.slice(0, 10)
          : "",

      credentialId:
        certification.credentialId || "",

      credentialUrl:
        certification.credentialUrl || "",
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
    setEditingCertification(null);
    resetForm();
  };

  // ==========================================
  // ADD / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      setError(
        "You must be logged in to manage certifications."
      );
      return;
    }

    if (!form.certificateName.trim()) {
      setError("Certificate name is required.");
      return;
    }

    if (!form.issuingOrganization.trim()) {
      setError(
        "Issuing organization is required."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editingCertification
        ? `${API_BASE}/api/certifications/${editingCertification.id}`
        : `${API_BASE}/api/certifications`;

      const method = editingCertification
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          certificateName:
            form.certificateName.trim(),

          issuingOrganization:
            form.issuingOrganization.trim(),

          issueDate:
            form.issueDate || null,

          credentialId:
            form.credentialId.trim() || null,

          credentialUrl:
            form.credentialUrl.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save certification"
        );
      }

      setSuccess(
        editingCertification
          ? "Certification updated successfully!"
          : "Certification added successfully!"
      );

      closeForm();

      await fetchCertifications();
    } catch (error) {
      console.error(
        "Certification save error:",
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

  const deleteCertification = async (id) => {
    const token = getToken();

    if (!token) {
      setError(
        "You must be logged in to delete certifications."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this certification?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE}/api/certifications/${id}`,
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
            "Failed to delete certification"
        );
      }

      setSuccess(
        "Certification deleted successfully!"
      );

      await fetchCertifications();
    } catch (error) {
      console.error(
        "Delete certification error:",
        error
      );

      setError(error.message);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not provided";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
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
            Loading certifications...
          </p>

        </div>

      </main>
    );
  }

  // ==========================================
  // CERTIFICATION CARD
  // ==========================================

  const CertificationCard = ({
    certification,
  }) => {
    return (
      <article
        className="
          group relative flex min-h-[430px]
          flex-col overflow-hidden rounded-sm
          bg-[#f7f7f5]
          text-slate-900
          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
          transition duration-500
          hover:-translate-y-2
          hover:shadow-[0_30px_80px_rgba(0,0,0,0.4)]
        "
      >

        {/* ==================================
            CERTIFICATE VISUAL
        ================================== */}

        <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950">

          <div className="absolute inset-0 opacity-20">

            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-purple-500 blur-3xl" />

            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-blue-500 blur-3xl" />

          </div>

          <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-3xl backdrop-blur">
            🏆
          </div>

          {/* OWNER ACTIONS */}

          {isOwner && (
            <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition group-hover:opacity-100">

              <button
                onClick={() =>
                  openEditForm(certification)
                }
                className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteCertification(
                    certification.id
                  )
                }
                className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow"
              >
                Delete
              </button>

            </div>
          )}

        </div>

        {/* ==================================
            CONTENT
        ================================== */}

        <div className="flex flex-1 flex-col p-7">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Professional Certification
          </p>

          <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
            {certification.certificateName}
          </h2>

          <p className="mt-2 text-sm font-semibold text-indigo-600">
            {certification.issuingOrganization}
          </p>

          {/* DATE */}

          <div className="mt-5 rounded-lg bg-slate-100 p-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Issue Date
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {formatDate(
                certification.issueDate
              )}
            </p>

          </div>

          {/* CREDENTIAL ID */}

          {certification.credentialId && (
            <div className="mt-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Credential ID
              </p>

              <p className="mt-1 break-all text-sm font-medium text-slate-700">
                {certification.credentialId}
              </p>

            </div>
          )}

          {/* VERIFY */}

          <div className="mt-auto pt-6">

            {certification.credentialUrl ? (
              <a
                href={certification.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Verify Credential →
              </a>
            ) : (
              <span className="block rounded-lg bg-slate-100 px-4 py-3 text-center text-sm text-slate-300">
                Verification unavailable
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
                Certifications
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
                Professional certifications,
                credentials and achievements
                earned throughout my career journey.
              </p>

            </div>

            {isOwner && (
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
                  : "+ Add Certification"}
              </button>
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
          ADD / EDIT FORM
      ====================================== */}

      {showForm && isOwner && (
        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-2xl sm:p-8"
          >

            <div className="mb-8">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                Certification Manager
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                {editingCertification
                  ? "Edit Certification"
                  : "Add New Certification"}
              </h2>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* CERTIFICATE NAME */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-white/70">
                  Certificate Name
                </label>

                <input
                  type="text"
                  name="certificateName"
                  value={form.certificateName}
                  onChange={handleChange}
                  placeholder="e.g. Java Programming Certificate"
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-500"
                />

              </div>

              {/* ORGANIZATION */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-white/70">
                  Issuing Organization
                </label>

                <input
                  type="text"
                  name="issuingOrganization"
                  value={
                    form.issuingOrganization
                  }
                  onChange={handleChange}
                  placeholder="e.g. Oracle"
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-500"
                />

              </div>

              {/* ISSUE DATE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-white/70">
                  Issue Date
                </label>

                <input
                  type="date"
                  name="issueDate"
                  value={form.issueDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
                />

              </div>

              {/* CREDENTIAL ID */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-white/70">
                  Credential ID
                </label>

                <input
                  type="text"
                  name="credentialId"
                  value={form.credentialId}
                  onChange={handleChange}
                  placeholder="Credential ID"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-500"
                />

              </div>

              {/* CREDENTIAL URL */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-white/70">
                  Credential / Verification URL
                </label>

                <input
                  type="url"
                  name="credentialUrl"
                  value={form.credentialUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-500"
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
                  : editingCertification
                  ? "Save Changes"
                  : "Add Certification"}
              </button>

            </div>

          </form>

        </section>
      )}

      {/* ======================================
          CERTIFICATIONS
      ====================================== */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">

        <div className="mb-10 text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/40">
            Credentials
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            My Certifications
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/40">
            Explore certifications and professional
            credentials earned throughout my journey.
          </p>

        </div>

        {certifications.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-14 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-2xl">
              🏆
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">
              No certifications yet
            </h3>

            <p className="mt-2 text-sm text-white/40">
              Certifications will appear here once
              they are added.
            </p>

            {isOwner && (
              <button
                onClick={openAddForm}
                className="mt-6 rounded-lg bg-white px-5 py-3 text-sm font-bold text-black"
              >
                + Add First Certification
              </button>
            )}

          </div>

        ) : (

          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">

            {certifications.map(
              (certification) => (
                <CertificationCard
                  key={certification.id}
                  certification={certification}
                />
              )
            )}

          </div>

        )}

      </section>

      {/* ======================================
          FOOTER
      ====================================== */}

      <section className="border-t border-white/10 px-5 py-10 text-center">

        <p className="text-xs uppercase tracking-[0.3em] text-white/30">
          SkillStack • Certifications
        </p>

      </section>

    </main>
  );
}

export default Certification;