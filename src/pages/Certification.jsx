import { useEffect, useState } from "react";

import { API_BASE } from "../config";

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
    return localStorage.getItem("adminToken");
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
      <main className="min-h-screen bg-white px-5 py-20 text-slate-950">

        <div className="mx-auto max-w-7xl text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />

          <p className="mt-5 text-sm tracking-wide text-slate-500">
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

        <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-slate-200 bg-slate-100">

          <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white text-3xl shadow-sm">
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

          <p className="mt-2 text-sm font-semibold text-slate-600">
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
                Certifications
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
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
                className="w-fit rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
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
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
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
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >

            <div className="mb-8">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Certification Manager
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                {editingCertification
                  ? "Edit Certification"
                  : "Add New Certification"}
              </h2>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* CERTIFICATE NAME */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Certificate Name
                </label>

                <input
                  type="text"
                  name="certificateName"
                  value={form.certificateName}
                  onChange={handleChange}
                  placeholder="e.g. Java Programming Certificate"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />

              </div>

              {/* ORGANIZATION */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />

              </div>

              {/* ISSUE DATE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Issue Date
                </label>

                <input
                  type="date"
                  name="issueDate"
                  value={form.issueDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />

              </div>

              {/* CREDENTIAL ID */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Credential ID
                </label>

                <input
                  type="text"
                  name="credentialId"
                  value={form.credentialId}
                  onChange={handleChange}
                  placeholder="Credential ID"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />

              </div>

              {/* CREDENTIAL URL */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Credential / Verification URL
                </label>

                <input
                  type="url"
                  name="credentialUrl"
                  value={form.credentialUrl}
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

          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            Credentials
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-950">
            My Certifications
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Explore certifications and professional
            credentials earned throughout my journey.
          </p>

        </div>

        {certifications.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-14 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              🏆
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-950">
              No certifications yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Certifications will appear here once
              they are added.
            </p>

            {isOwner && (
              <button
                onClick={openAddForm}
                className="mt-6 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
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

      <section className="border-t border-slate-200 px-5 py-10 text-center">

        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          SkillStack • Certifications
        </p>

      </section>

    </main>
  );
}

export default Certification;