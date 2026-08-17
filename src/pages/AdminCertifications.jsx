import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

const emptyForm = {
  certificateName: "",
  issuingOrganization: "",
  issueDate: "",
  credentialId: "",
  credentialUrl: "",
};

function AdminCertifications() {
  const navigate = useNavigate();

  const [certifications, setCertifications] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // ==========================================
  // LOAD CERTIFICATIONS
  // ==========================================

  const fetchCertifications = async () => {
    const token = getToken();

    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/certifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
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
            "Failed to load certifications"
        );
      }

      setCertifications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Certification fetch error:",
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
  };

  // ==========================================
  // EDIT CERTIFICATION
  // ==========================================

  const handleEdit = (certification) => {
    setEditingId(certification.id);

    setForm({
      certificateName:
        certification.certificateName || "",

      issuingOrganization:
        certification.issuingOrganization || "",

      issueDate:
        certification.issueDate
          ? String(certification.issueDate).slice(0, 10)
          : "",

      credentialId:
        certification.credentialId || "",

      credentialUrl:
        certification.credentialUrl || "",
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
        ? `${API_BASE}/api/certifications/${editingId}`
        : `${API_BASE}/api/certifications`;

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
          certificateName:
            form.certificateName,

          issuingOrganization:
            form.issuingOrganization,

          issueDate:
            form.issueDate || null,

          credentialId:
            form.credentialId,

          credentialUrl:
            form.credentialUrl,
        }),
      });

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
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
            "Failed to save certification"
        );
      }

      setSuccess(
        editingId
          ? "Certification updated successfully! ✅"
          : "Certification added successfully! ✅"
      );

      resetForm();

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

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this certification?"
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
        `${API_BASE}/api/certifications/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
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
            "Failed to delete certification"
        );
      }

      setSuccess(
        "Certification deleted successfully! ✅"
      );

      if (editingId === id) {
        resetForm();
      }

      await fetchCertifications();

    } catch (error) {
      console.error(
        "Certification delete error:",
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
            Loading certifications...
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
              Manage Certifications
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

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* SUCCESS */}

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

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
            {editingId
              ? "Edit Certification"
              : "Add Certification"}
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {editingId
              ? "Update certification"
              : "Add new certification"}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            {/* CERTIFICATE NAME */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-white/70">
                Certificate Name
              </label>

              <input
                type="text"
                name="certificateName"
                value={form.certificateName}
                onChange={handleChange}
                required
                placeholder="AWS Cloud Practitioner"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/50"
              />

            </div>

            {/* ISSUING ORGANIZATION */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-white/70">
                Issuing Organization
              </label>

              <input
                type="text"
                name="issuingOrganization"
                value={form.issuingOrganization}
                onChange={handleChange}
                required
                placeholder="Amazon Web Services"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/50"
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
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-purple-400/50"
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
                placeholder="ABC123456"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/50"
              />

            </div>

            {/* CREDENTIAL URL */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-white/70">
                Credential URL
              </label>

              <input
                type="url"
                name="credentialUrl"
                value={form.credentialUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/50"
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
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Certification"
                : "Add Certification"}
            </button>

          </div>

        </form>

        {/* ==========================================
            CERTIFICATION LIST
            ========================================== */}

        <section className="mt-10">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
                Current Certifications
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Your Certifications
              </h2>

            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/40">
              {certifications.length} certification
              {certifications.length !== 1
                ? "s"
                : ""}
            </span>

          </div>

          {certifications.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">

              <div className="text-3xl">
                🏆
              </div>

              <p className="mt-4 text-sm text-white/40">
                No certifications added yet.
              </p>

            </div>

          ) : (

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {certifications.map(
                (certification) => (

                  <article
                    key={certification.id}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h3 className="text-xl font-bold">
                          {
                            certification.certificateName
                          }
                        </h3>

                        <p className="mt-2 text-sm text-purple-300">
                          {
                            certification.issuingOrganization
                          }
                        </p>

                      </div>

                      <span className="shrink-0 text-xs text-white/20">
                        CERTIFICATION
                      </span>

                    </div>

                    <div className="mt-5 space-y-2 text-sm text-white/40">

                      {certification.issueDate && (
                        <p>
                          <span className="text-white/60">
                            Issued:
                          </span>{" "}
                          {String(
                            certification.issueDate
                          ).slice(0, 10)}
                        </p>
                      )}

                      {certification.credentialId && (
                        <p>
                          <span className="text-white/60">
                            Credential ID:
                          </span>{" "}
                          {
                            certification.credentialId
                          }
                        </p>
                      )}

                    </div>

                    {certification.credentialUrl && (
                      <a
                        href={
                          certification.credentialUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
                      >
                        View Credential ↗
                      </a>
                    )}

                    <div className="mt-6 flex justify-end gap-2 border-t border-white/[0.07] pt-5">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            certification
                          )
                        }
                        className="rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-500/20"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            certification.id
                          )
                        }
                        disabled={
                          deletingId ===
                          certification.id
                        }
                        className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                      >
                        {deletingId ===
                        certification.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      </section>

    </main>
  );
}

export default AdminCertifications;
