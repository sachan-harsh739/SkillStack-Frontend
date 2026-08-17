import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [leetcode, setLeetcode] = useState(null);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // PUBLIC DATA
  // ==========================================

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        const [
          profileResponse,
          projectsResponse,
          educationResponse,
          certificationResponse,
          leetcodeResponse,
        ] = await Promise.all([
          fetch(`${API_BASE}/api/public/profile`),
          fetch(`${API_BASE}/api/public/projects`),
          fetch(`${API_BASE}/api/public/education`),
          fetch(`${API_BASE}/api/public/certifications`),
          fetch(`${API_BASE}/api/public/leetcode`),
        ]);

        if (profileResponse.ok) {
          const data = await profileResponse.json();
          setProfile(data);
        }

        if (projectsResponse.ok) {
          const data = await projectsResponse.json();
          setProjects(Array.isArray(data) ? data : []);
        }

        if (educationResponse.ok) {
          const data = await educationResponse.json();
          setEducation(Array.isArray(data) ? data : []);
        }

        if (certificationResponse.ok) {
          const data = await certificationResponse.json();
          setCertifications(Array.isArray(data) ? data : []);
        }

        if (leetcodeResponse.ok) {
          const data = await leetcodeResponse.json();
          setLeetcode(data);
        }
      } catch (error) {
        console.error("Home data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080808] text-white">
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-white" />

            <p className="mt-5 text-sm text-white/40">
              Loading portfolio...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // FALLBACK PROFILE
  // ==========================================

  const name = profile?.name || "Developer";

  const initials = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ==========================================
  // HOME
  // ==========================================

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden border-b border-white/[0.07]">

        {/* Background */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-[-120px] top-[-100px] h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[120px]" />

          <div className="absolute right-[-100px] top-[100px] h-[350px] w-[350px] rounded-full bg-purple-600/15 blur-[120px]" />

          <div className="absolute bottom-[-150px] left-[35%] h-[300px] w-[300px] rounded-full bg-indigo-600/10 blur-[120px]" />

        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-28">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                Available for opportunities
              </span>

            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
              Developer Portfolio
            </p>

            <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">

              Hi, I'm{" "}

              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {name}
              </span>

              <span className="text-white">.</span>

            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/50 sm:text-xl">

              {profile?.university ||
                "Computer Science & Engineering"}

              {profile?.graduationYear && (
                <>
                  <span className="mx-2 text-white/20">
                    •
                  </span>

                  Graduation {profile.graduationYear}
                </>
              )}

            </p>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
              I build modern software applications,
              solve real-world problems and continuously
              improve my skills through projects,
              education and coding.
            </p>

            {/* ACTIONS */}

            <div className="mt-9 flex flex-wrap gap-3">

              <Link
                to="/projects"
                className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-white/10 transition duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                Explore My Work →
              </Link>

              <Link
                to="/profile"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white/80 transition duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                View Profile
              </Link>

            </div>

            {/* SOCIAL */}

            <div className="mt-8 flex flex-wrap gap-3">

              {profile?.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-white/50 transition hover:border-white/20 hover:text-white"
                >
                  GitHub ↗
                </a>
              )}

              {profile?.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-white/50 transition hover:border-blue-400/30 hover:text-blue-400"
                >
                  LinkedIn ↗
                </a>
              )}

              {leetcode?.profileUrl && (
                <a
                  href={leetcode.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-white/50 transition hover:border-orange-400/30 hover:text-orange-400"
                >
                  LeetCode ↗
                </a>
              )}

            </div>

          </div>


          {/* RIGHT */}

          <div className="relative mx-auto w-full max-w-[500px]">

            <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-[100px]" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 shadow-2xl shadow-black/40 backdrop-blur">

              <div className="mb-4 flex items-center gap-2 px-2">

                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />

                <span className="ml-3 text-xs text-white/30">
                  skillstack.dev
                </span>

              </div>

              <div className="overflow-hidden rounded-2xl bg-[#111]">

                <img
                  src={heroImage}
                  alt="Developer"
                  className="w-full object-contain"
                />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          STATS
      ================================================== */}

      <section className="border-b border-white/[0.07]">

        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/[0.07] sm:grid-cols-4">

          <div className="px-5 py-8 text-center sm:py-10">

            <p className="text-3xl font-bold text-white sm:text-4xl">
              {projects.length}
            </p>

            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/30">
              Projects
            </p>

          </div>

          <div className="px-5 py-8 text-center sm:py-10">

            <p className="text-3xl font-bold text-white sm:text-4xl">
              {education.length}
            </p>

            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/30">
              Education
            </p>

          </div>

          <div className="px-5 py-8 text-center sm:py-10">

            <p className="text-3xl font-bold text-white sm:text-4xl">
              {certifications.length}
            </p>

            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/30">
              Certifications
            </p>

          </div>

          <div className="px-5 py-8 text-center sm:py-10">

            <p className="text-3xl font-bold text-white sm:text-4xl">
              {leetcode ? "✓" : "—"}
            </p>

            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/30">
              LeetCode
            </p>

          </div>

        </div>

      </section>


      {/* ==================================================
          PROJECTS
      ================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
              Selected Work
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Featured Projects
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              A selection of projects built using modern
              technologies and practical problem solving.
            </p>

          </div>

          <Link
            to="/projects"
            className="text-sm font-semibold text-white/50 transition hover:text-white"
          >
            View all projects →
          </Link>

        </div>


        {projects.length === 0 ? (

          <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-14 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl">
              &lt;/&gt;
            </div>

            <p className="mt-5 text-sm text-white/40">
              No projects added yet.
            </p>

          </div>

        ) : (

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {projects.slice(0, 3).map((project, index) => {

              const technologies = project.technologies
                ? project.technologies
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                : [];

              return (
                <article
                  key={project.id}
                  className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 transition duration-500 hover:-translate-y-2 hover:border-blue-400/20 hover:bg-white/[0.055] hover:shadow-2xl hover:shadow-blue-950/20"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] font-mono text-sm text-blue-400">
                      0{index + 1}
                    </div>

                    <span className="text-xs text-white/20">
                      PROJECT
                    </span>

                  </div>

                  <h3 className="mt-8 text-2xl font-bold text-white">
                    {project.title}
                  </h3>

                  <p className="mt-4 flex-1 text-sm leading-7 text-white/40">
                    {project.description ||
                      "No project description available."}
                  </p>

                  {technologies.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">

                      {technologies.slice(0, 5).map(
                        (technology, techIndex) => (
                          <span
                            key={`${technology}-${techIndex}`}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/50"
                          >
                            {technology}
                          </span>
                        )
                      )}

                    </div>
                  )}

                  <div className="mt-7 flex gap-5 border-t border-white/[0.07] pt-5">

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-white/60 transition hover:text-white"
                      >
                        GitHub ↗
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                      >
                        Live Demo ↗
                      </a>
                    )}

                  </div>

                </article>
              );
            })}

          </div>

        )}

      </section>


      {/* ==================================================
          EDUCATION
      ================================================== */}

      <section className="border-y border-white/[0.07] bg-white/[0.015]">

        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-400">
                Academic Journey
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Education
              </h2>

            </div>

            <Link
              to="/education"
              className="text-sm font-semibold text-white/50 hover:text-white"
            >
              View all →
            </Link>

          </div>


          {education.length === 0 ? (

            <div className="mt-10 rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-white/40">
              No education details added yet.
            </div>

          ) : (

            <div className="relative mt-12">

              <div className="absolute bottom-0 left-[19px] top-0 w-px bg-gradient-to-b from-blue-500/60 via-purple-500/30 to-transparent" />

              <div className="space-y-8">

                {education.slice(0, 3).map((item) => (

                  <div
                    key={item.id}
                    className="relative flex gap-6"
                  >

                    <div className="relative z-10 mt-1 h-10 w-10 shrink-0 rounded-full border border-blue-400/20 bg-[#080808] p-2">

                      <div className="h-full w-full rounded-full bg-blue-500/20" />

                    </div>

                    <div className="flex-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition hover:border-white/15">

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <h3 className="text-lg font-bold text-white">
                            {item.degree ||
                              item.type ||
                              "Education"}
                          </h3>

                          <p className="mt-1 text-sm text-white/40">
                            {item.institution ||
                              item.university ||
                              "Institution"}
                          </p>

                        </div>

                        {(item.startYear ||
                          item.endYear ||
                          item.year) && (

                          <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/40">

                            {item.startYear &&
                            item.endYear
                              ? `${item.startYear} - ${item.endYear}`
                              : item.year || ""}

                          </span>

                        )}

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      </section>


      {/* ==================================================
          CERTIFICATION + LEETCODE
      ================================================== */}

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-12">

        {/* CERTIFICATIONS */}

        <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 transition duration-300 hover:border-purple-400/20">

          <div className="flex items-center justify-between">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
              🏆
            </div>

            <span className="text-xs font-semibold uppercase tracking-widest text-white/25">
              Achievements
            </span>

          </div>

          <h2 className="mt-8 text-2xl font-bold text-white">
            Certifications
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/40">

            {certifications.length > 0
              ? `${certifications.length} certification${
                  certifications.length > 1
                    ? "s"
                    : ""
                } added to the portfolio.`
              : "No certifications added yet."}

          </p>

          {certifications.length > 0 && (
            <div className="mt-6 space-y-3">

              {certifications.slice(0, 2).map((certificate) => (

                <div
                  key={certificate.id}
                  className="rounded-xl border border-white/[0.07] bg-black/20 p-4"
                >

                  <p className="font-semibold text-white">
                    {certificate.certificateName}
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    {certificate.issuingOrganization}
                  </p>

                </div>

              ))}

            </div>
          )}

          <Link
            to="/certification"
            className="mt-7 inline-block text-sm font-semibold text-purple-400 transition hover:text-purple-300"
          >
            View Certifications →
          </Link>

        </div>


        {/* LEETCODE */}

        <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 transition duration-300 hover:border-orange-400/20">

          <div className="flex items-center justify-between">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-xl">
              🧩
            </div>

            <span className="text-xs font-semibold uppercase tracking-widest text-white/25">
              Coding Profile
            </span>

          </div>

          <h2 className="mt-8 text-2xl font-bold text-white">
            LeetCode
          </h2>

          {leetcode ? (

            <>
              <p className="mt-3 text-sm leading-7 text-white/40">
                Coding profile connected as
                <span className="ml-1 font-semibold text-white/80">
                  {leetcode.username}
                </span>
              </p>

              <a
                href={leetcode.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-block text-sm font-semibold text-orange-400 transition hover:text-orange-300"
              >
                View LeetCode Profile →
              </a>
            </>

          ) : (

            <>
              <p className="mt-3 text-sm leading-7 text-white/40">
                No LeetCode profile connected yet.
              </p>

              <Link
                to="/leetcode"
                className="mt-7 inline-block text-sm font-semibold text-orange-400 transition hover:text-orange-300"
              >
                Connect LeetCode →
              </Link>
            </>

          )}

        </div>

      </section>


      {/* ==================================================
          FINAL CTA
      ================================================== */}

      <section className="px-5 pb-20 sm:px-8 lg:px-12">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20 px-6 py-16 text-center sm:px-10">

          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[100px]" />

          <div className="relative">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
              Let's Connect
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Explore my developer journey.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/40">
              Explore my projects, academic background,
              certifications and coding profile.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">

              <Link
                to="/projects"
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90"
              >
                View Projects →
              </Link>

              <Link
                to="/profile"
                className="rounded-xl border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View Profile
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="border-t border-white/[0.07] px-5 py-8 text-center">

        <p className="text-xs uppercase tracking-[0.25em] text-white/25">
          SkillStack • Developer Portfolio
        </p>

      </footer>

    </main>
  );
}

export default Home;