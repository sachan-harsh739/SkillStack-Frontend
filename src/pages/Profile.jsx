import { useEffect, useState } from "react";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET PUBLIC PROFILE
  // ==========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:5001/api/public/profile"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch profile"
          );
        }

        setProfile(data);
      } catch (error) {
        console.error("Public profile error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-5 py-16 text-center">
          <p className="text-slate-500">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
            {error || "Profile not available."}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // PUBLIC PROFILE — VIEW ONLY
  // ==========================================

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ==========================================
          HEADER
          ========================================== */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-5xl px-5 py-8">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Developer Profile
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Professional information and social links.
          </p>

        </div>

      </section>

      {/* ==========================================
          PROFILE CONTENT
          ========================================== */}

      <section className="mx-auto max-w-5xl px-5 py-10">

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* PROFILE TOP */}

          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 px-6 py-10 sm:px-10">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              {/* AVATAR */}

              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 text-3xl font-bold text-white backdrop-blur">

                {profile.name
                  ? profile.name.charAt(0).toUpperCase()
                  : "U"}

              </div>

              {/* NAME */}

              <div>

                <h2 className="text-3xl font-bold text-white">
                  {profile.name || "Developer"}
                </h2>

                <p className="mt-1 text-blue-200">
                  {profile.email || "Email not added"}
                </p>

              </div>

            </div>

          </div>

          {/* PROFILE INFORMATION */}

          <div className="p-6 sm:p-10">

            <div className="grid gap-6 md:grid-cols-2">

              {/* UNIVERSITY */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  University
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {profile.university || "Not added"}
                </p>

              </div>

              {/* GRADUATION */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Graduation Year
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {profile.graduationYear || "Not added"}
                </p>

              </div>

            </div>

            {/* ==========================================
                PROFESSIONAL LINKS
                ========================================== */}

            <div className="mt-8">

              <h3 className="text-lg font-bold text-slate-900">
                Professional Links
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-3">

                {/* LINKEDIN */}

                {profile.linkedinUrl ? (

                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-300 hover:bg-blue-50"
                  >

                    <p className="text-sm font-semibold text-slate-900">
                      LinkedIn
                    </p>

                    <p className="mt-2 truncate text-xs text-slate-500">
                      {profile.linkedinUrl}
                    </p>

                  </a>

                ) : (

                  <div className="rounded-xl border border-slate-200 p-5">

                    <p className="text-sm font-semibold text-slate-900">
                      LinkedIn
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Not added
                    </p>

                  </div>

                )}

                {/* GITHUB */}

                {profile.githubUrl ? (

                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-slate-200 p-5 transition hover:border-slate-400 hover:bg-slate-50"
                  >

                    <p className="text-sm font-semibold text-slate-900">
                      GitHub
                    </p>

                    <p className="mt-2 truncate text-xs text-slate-500">
                      {profile.githubUrl}
                    </p>

                  </a>

                ) : (

                  <div className="rounded-xl border border-slate-200 p-5">

                    <p className="text-sm font-semibold text-slate-900">
                      GitHub
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Not added
                    </p>

                  </div>

                )}

                {/* PORTFOLIO */}

                {profile.portfolioUrl ? (

                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-slate-200 p-5 transition hover:border-purple-300 hover:bg-purple-50"
                  >

                    <p className="text-sm font-semibold text-slate-900">
                      Portfolio
                    </p>

                    <p className="mt-2 truncate text-xs text-slate-500">
                      {profile.portfolioUrl}
                    </p>

                  </a>

                ) : (

                  <div className="rounded-xl border border-slate-200 p-5">

                    <p className="text-sm font-semibold text-slate-900">
                      Portfolio
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Not added
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Profile;