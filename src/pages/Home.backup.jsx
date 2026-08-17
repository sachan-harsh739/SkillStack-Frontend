import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [leetcode, setLeetcode] = useState(null);

  const [loading, setLoading] = useState(true);

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  // ==========================================
  // FETCH USER DATA
  // ==========================================

  useEffect(() => {
    const fetchHomeData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          profileResponse,
          projectsResponse,
          educationResponse,
          certificationResponse,
          leetcodeResponse,
        ] = await Promise.all([
          fetch("http://localhost:5001/api/profile", {
            headers,
          }),

          fetch("http://localhost:5001/api/projects", {
            headers,
          }),

          fetch("http://localhost:5001/api/education", {
            headers,
          }),

          fetch(
            "http://localhost:5001/api/certifications",
            {
              headers,
            }
          ),

          fetch("http://localhost:5001/api/leetcode", {
            headers,
          }),
        ]);

        const profileData =
          await profileResponse.json();

        const projectsData =
          await projectsResponse.json();

        const educationData =
          await educationResponse.json();

        const certificationData =
          await certificationResponse.json();

        const leetcodeData =
          await leetcodeResponse.json();

        if (profileResponse.ok) {
          setProfile(profileData);
        }

        if (projectsResponse.ok) {
          setProjects(
            Array.isArray(projectsData)
              ? projectsData
              : []
          );
        }

        if (educationResponse.ok) {
          setEducation(
            Array.isArray(educationData)
              ? educationData
              : []
          );
        }

        if (certificationResponse.ok) {
          setCertifications(
            Array.isArray(certificationData)
              ? certificationData
              : []
          );
        }

        if (leetcodeResponse.ok) {
          setLeetcode(leetcodeData);
        }

      } catch (error) {
        console.error(
          "Home data error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [token]);

  // ==========================================
  // FEATURES
  // ==========================================

  const features = [
    {
      icon: "👤",
      title: "Profile",
      description:
        "Manage your professional identity and social links.",
      path: "/profile",
    },
    {
      icon: "🎓",
      title: "Education",
      description:
        "Showcase your academic background.",
      path: "/education",
    },
    {
      icon: "</>",
      title: "Projects",
      description:
        "Showcase your projects, demos and source code.",
      path: "/projects",
    },
    {
      icon: "🧩",
      title: "LeetCode",
      description:
        "Connect and showcase your LeetCode profile.",
      path: "/leetcode",
    },
    {
      icon: "🏆",
      title: "Certifications",
      description:
        "Store and showcase your certifications.",
      path: "/certification",
    },
  ];

  // ==========================================
  // LOADING
  // ==========================================

  if (loading && token) {
    return (
      <main className="min-h-screen bg-slate-50">

        <div className="flex min-h-[70vh] items-center justify-center">

          <p className="text-slate-500">
            Loading your SkillStack...
          </p>

        </div>

      </main>
    );
  }

  // ==========================================
  // LOGGED IN HOME
  // ==========================================

  if (token && profile) {
    return (
      <main className="min-h-screen bg-slate-50">

        {/* =====================================
            HERO
            ===================================== */}

        <section className="overflow-hidden bg-white">

          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-20">

            {/* LEFT */}

            <div>

              <p className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                Developer Profile
              </p>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">

                Hi, I'm{" "}

                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {profile.name}
                </span>

                {" "}👋

              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">

                {profile.university
                  ? `${profile.university}`
                  : "Computer Science & Engineering Student"}

                {profile.graduationYear
                  ? ` • Graduation ${profile.graduationYear}`
                  : ""}

              </p>

              <p className="mt-4 max-w-xl leading-7 text-slate-500">
                Welcome to my SkillStack profile.
                Explore my projects, education,
                certifications and coding profile.
              </p>


              {/* BUTTONS */}

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  to="/projects"
                  className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  View My Projects →
                </Link>

                <Link
                  to="/profile"
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
                >
                  View Profile
                </Link>

              </div>


              {/* SOCIAL LINKS */}

              <div className="mt-7 flex flex-wrap gap-3">

                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
                  >
                    LinkedIn
                  </a>
                )}

                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
                  >
                    GitHub
                  </a>
                )}

                {profile.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-purple-300 hover:text-purple-600"
                  >
                    Portfolio
                  </a>
                )}

                {leetcode && (
                  <a
                    href={leetcode.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-orange-300 hover:text-orange-600"
                  >
                    LeetCode
                  </a>
                )}

              </div>

            </div>


            {/* RIGHT */}

            <div className="relative mx-auto w-full max-w-[500px]">

              <div className="absolute inset-10 rounded-full bg-blue-200/30 blur-3xl" />

              <img
                src={heroImage}
                alt="Developer profile"
                className="relative z-10 mx-auto w-full object-contain"
              />

            </div>

          </div>

        </section>


        {/* =====================================
            QUICK STATS
            ===================================== */}

        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Projects
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {projects.length}
              </p>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Education
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {education.length}
              </p>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Certifications
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {certifications.length}
              </p>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                LeetCode
              </p>

              <p className="mt-2 text-lg font-bold text-slate-900">
                {leetcode
                  ? "Connected ✓"
                  : "Not Connected"}
              </p>

            </div>

          </div>

        </section>


        {/* =====================================
            PROJECTS
            ===================================== */}

        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                My Work
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Featured Projects
              </h2>

            </div>

            <Link
              to="/projects"
              className="hidden text-sm font-semibold text-blue-600 hover:text-blue-800 sm:block"
            >
              View All →
            </Link>

          </div>


          {projects.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

              <p className="text-slate-500">
                No projects added yet.
              </p>

              <Link
                to="/projects"
                className="mt-4 inline-block font-semibold text-blue-600"
              >
                Add Your First Project →
              </Link>

            </div>

          ) : (

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {projects.slice(0, 3).map((project) => (

                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <h3 className="text-lg font-bold text-slate-900">
                    {project.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                    {project.description ||
                      "No description available."}
                  </p>

                  {project.technologies && (
                    <p className="mt-4 text-xs font-medium text-blue-600">
                      {project.technologies}
                    </p>
                  )}

                  <div className="mt-5 flex gap-4">

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-slate-700 hover:text-blue-600"
                      >
                        GitHub →
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Live Demo →
                      </a>
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* =====================================
            EDUCATION
            ===================================== */}

        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Academic Journey
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Education
                </h2>

              </div>

              <Link
                to="/education"
                className="text-sm font-semibold text-blue-600"
              >
                View All →
              </Link>

            </div>


            <div className="mt-6 space-y-4">

              {education.length === 0 ? (

                <p className="text-sm text-slate-500">
                  No education details added yet.
                </p>

              ) : (

                education.slice(0, 3).map((item) => (

                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-5"
                  >

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <h3 className="font-bold text-slate-900">
                          {item.degree ||
                            item.type ||
                            "Education"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {item.institution ||
                            item.university ||
                            "Institution"}
                        </p>

                      </div>

                      <div className="text-sm text-slate-500">

                        {item.startYear &&
                          item.endYear
                          ? `${item.startYear} - ${item.endYear}`
                          : item.year || ""}

                      </div>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </section>


        {/* =====================================
            CERTIFICATIONS + LEETCODE
            ===================================== */}

        <section className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:px-8 lg:grid-cols-2">

          {/* CERTIFICATIONS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
              Achievements
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Certifications
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {certifications.length > 0
                ? `You have ${certifications.length} certification${certifications.length > 1 ? "s" : ""} in your SkillStack profile.`
                : "No certifications added yet."}
            </p>

            <Link
              to="/certification"
              className="mt-5 inline-block text-sm font-semibold text-purple-600"
            >
              View Certifications →
            </Link>

          </div>


          {/* LEETCODE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
              Coding
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              LeetCode
            </h2>

            {leetcode ? (

              <>
                <p className="mt-3 text-sm text-slate-500">
                  Connected profile:
                  {" "}
                  <span className="font-semibold text-slate-800">
                    {leetcode.username}
                  </span>
                </p>

                <a
                  href={leetcode.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block text-sm font-semibold text-orange-500"
                >
                  View LeetCode Profile →
                </a>
              </>

            ) : (

              <>
                <p className="mt-3 text-sm text-slate-500">
                  Connect your LeetCode profile
                  to showcase your coding journey.
                </p>

                <Link
                  to="/leetcode"
                  className="mt-5 inline-block text-sm font-semibold text-orange-500"
                >
                  Connect LeetCode →
                </Link>
              </>

            )}

          </div>

        </section>


        {/* =====================================
            FOOTER CTA
            ===================================== */}

        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">

          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-12 text-center">

            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Keep building your developer profile.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-blue-100">
              Manage your projects, education,
              certifications and coding profile
              from one place.
            </p>

            <Link
              to="/profile"
              className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-md transition hover:bg-slate-50"
            >
              Manage My Profile →
            </Link>

          </div>

        </section>

      </main>
    );
  }

  // ==========================================
  // LOGGED OUT HOME
  // ==========================================

  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}

      <section className="overflow-hidden bg-gradient-to-br from-white via-slate-50 to-indigo-50/60">

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:px-8 lg:py-20">

          <div className="max-w-xl">

            <div className="mb-5 inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
              ✨ All-in-One Developer Platform
            </div>

            <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-[52px]">

              Build your

              <br />

              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                developer profile.
              </span>

            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">

              SkillStack helps you organize and
              showcase your{" "}

              <span className="font-medium text-slate-800">
                skills, projects, education,
                certifications and LeetCode profile
              </span>{" "}

              in one place.

            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
              >
                Get Started Free →
              </Link>

              <a
                href="#features"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
              >
                Explore Features
              </a>

            </div>

          </div>


          <div className="relative mx-auto w-full max-w-[520px]">

            <div className="absolute inset-10 rounded-full bg-purple-200/30 blur-3xl" />

            <img
              src={heroImage}
              alt="SkillStack developer platform"
              className="relative z-10 mx-auto w-full object-contain"
            />

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section
        id="features"
        className="px-6 py-16 lg:px-8"
      >

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Powerful Features
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Everything in one place
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Keep your complete developer journey
              organized, professional and easy to share.
            </p>

          </div>


          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {features.map((feature) => (

              <Link
                key={feature.title}
                to={feature.path}
                className="group rounded-xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-lg font-semibold text-blue-600">
                  {feature.icon}
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-5 text-slate-500">
                  {feature.description}
                </p>

                <p className="mt-4 text-sm font-semibold text-blue-600 transition group-hover:translate-x-1">
                  Learn More →
                </p>

              </Link>

            ))}

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="px-6 pb-16 lg:px-8">

        <div className="mx-auto max-w-6xl rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-12 text-center">

          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Ready to build your SkillStack?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-blue-100">
            Create your developer profile and keep
            everything important about your career
            in one place.
          </p>

          <Link
            to="/register"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-md transition hover:bg-slate-50"
          >
            Create Your Profile →
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Home;
