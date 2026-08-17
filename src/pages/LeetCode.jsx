import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5001";

function LeetCode() {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    username: "",
    profileUrl: "",
  });

  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  const isOwner = Boolean(getToken());

  // ==========================================
  // FETCH PUBLIC LEETCODE PROFILE
  // ==========================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/public/leetcode`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch LeetCode profile"
        );
      }

      setProfile(data);

      if (data) {
        setForm({
          username: data.username || "",
          profileUrl: data.profileUrl || "",
        });
      }

    } catch (error) {
      console.error(
        "Public LeetCode error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
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
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setForm({
      username: "",
      profileUrl: "",
    });

    setEditing(true);
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

  const openEditForm = () => {
    if (!profile) return;

    setForm({
      username: profile.username || "",
      profileUrl: profile.profileUrl || "",
    });

    setEditing(true);
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
    setEditing(false);

    setError("");

    if (profile) {
      setForm({
        username: profile.username || "",
        profileUrl: profile.profileUrl || "",
      });
    }
  };

  // ==========================================
  // ADD / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      setError(
        "Owner login is required to manage the LeetCode profile."
      );
      return;
    }

    if (!form.username.trim()) {
      setError("LeetCode username is required.");
      return;
    }

    if (!form.profileUrl.trim()) {
      setError("LeetCode profile URL is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = profile
        ? `${API_BASE}/api/leetcode/${profile.id}`
        : `${API_BASE}/api/leetcode`;

      const method = profile
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          username: form.username.trim(),
          profileUrl: form.profileUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save LeetCode profile"
        );
      }

      setSuccess(
        profile
          ? "LeetCode profile updated successfully!"
          : "LeetCode profile added successfully!"
      );

      setEditing(false);

      await fetchProfile();

    } catch (error) {
      console.error(
        "LeetCode save error:",
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

  const handleDelete = async () => {
    if (!profile) return;

    const token = getToken();

    if (!token) {
      setError(
        "Owner login is required to delete the profile."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete your LeetCode profile?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE}/api/leetcode/${profile.id}`,
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
            "Failed to delete LeetCode profile"
        );
      }

      setProfile(null);

      setForm({
        username: "",
        profileUrl: "",
      });

      setSuccess(
        "LeetCode profile deleted successfully!"
      );

    } catch (error) {
      console.error(
        "LeetCode delete error:",
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

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-orange-500" />

          <p className="mt-5 text-sm tracking-wide text-white/50">
            Loading LeetCode profile...
          </p>

        </div>

      </main>
    );
  }

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

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">
            Coding Profile
          </p>

          <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                LeetCode
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
                Explore the LeetCode profile and coding
                journey showcased through SkillStack.
              </p>

            </div>

            {/* OWNER ADD / EDIT BUTTON */}

            {isOwner && (
              <button
                onClick={
                  editing
                    ? closeForm
                    : profile
                    ? openEditForm
                    : openAddForm
                }
                className="w-fit rounded-lg bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-white/90"
              >
                {editing
                  ? "Close Form"
                  : profile
                  ? "Edit Profile"
                  : "+ Add LeetCode"}
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

      {editing && isOwner && (

        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-2xl sm:p-8"
          >

            <div className="mb-8">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
                Profile Manager
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                {profile
                  ? "Edit LeetCode Profile"
                  : "Add LeetCode Profile"}
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Add your public LeetCode username and
                profile URL.
              </p>

            </div>


            <div className="grid gap-5 md:grid-cols-2">

              {/* USERNAME */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-white/70">
                  LeetCode Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Harsh_sachan"
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-orange-500"
                />

              </div>


              {/* PROFILE URL */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-white/70">
                  LeetCode Profile URL
                </label>

                <input
                  type="url"
                  name="profileUrl"
                  value={form.profileUrl}
                  onChange={handleChange}
                  placeholder="https://leetcode.com/u/username/"
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-orange-500"
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
                className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : profile
                  ? "Save Changes"
                  : "Add LeetCode"}
              </button>

            </div>

          </form>

        </section>

      )}


      {/* ======================================
          PROFILE
      ====================================== */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">

        {profile ? (

          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#f7f7f5] text-slate-900 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">

            {/* PROFILE HEADER */}

            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 px-7 py-12 sm:px-10">

              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-orange-500/20 blur-3xl" />

              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-5">

                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/20 bg-orange-500 text-3xl font-black text-white shadow-xl">
                    LC
                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-300">
                      LeetCode Profile
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-white">
                      {profile.username}
                    </h2>

                    <p className="mt-2 text-sm text-white/50">
                      Coding profile connected to SkillStack
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* PROFILE CONTENT */}

            <div className="p-7 sm:p-10">

              <div className="grid gap-5 sm:grid-cols-2">

                {/* USERNAME */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Username
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {profile.username}
                  </p>

                </div>


                {/* STATUS */}

                <div className="rounded-xl border border-green-200 bg-green-50 p-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                    Profile Status
                  </p>

                  <p className="mt-2 text-lg font-bold text-green-700">
                    Connected ✓
                  </p>

                </div>

              </div>


              {/* PROFILE URL */}

              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Public Profile
                </p>

                <p className="mt-2 break-all text-sm text-slate-500">
                  {profile.profileUrl}
                </p>

              </div>


              {/* ACTIONS */}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg bg-orange-500 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  View LeetCode Profile →
                </a>

                {isOwner && (
                  <>
                    <button
                      type="button"
                      onClick={openEditForm}
                      className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={handleDelete}
                      className="rounded-lg border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </>
                )}

              </div>

            </div>

          </div>

        ) : (

          /* ====================================
             NO PROFILE
             ==================================== */

          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/10 text-2xl font-black text-orange-500">
              LC
            </div>

            <h2 className="mt-6 text-2xl font-bold text-white">
              LeetCode Profile
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/40">
              No LeetCode profile has been connected
              yet.
            </p>

            {isOwner && (
              <button
                onClick={openAddForm}
                className="mt-6 rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                + Add LeetCode Profile
              </button>
            )}

          </div>

        )}

      </section>


      {/* ======================================
          FOOTER
      ====================================== */}

      <section className="border-t border-white/10 px-5 py-10 text-center">

        <p className="text-xs uppercase tracking-[0.3em] text-white/30">
          SkillStack • LeetCode
        </p>

      </section>

    </main>
  );
}

export default LeetCode;