import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { API_BASE } from "../config";

function Home() {
  const [profile, setProfile] = useState(null);
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
          leetcodeResponse,
        ] = await Promise.all([
          fetch(`${API_BASE}/api/public/profile`),
          fetch(`${API_BASE}/api/public/leetcode`),
        ]);

        if (profileResponse.ok) {
          const data = await profileResponse.json();
          setProfile(data);
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
      <main className="min-h-screen bg-white text-slate-950">
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />

            <p className="mt-5 text-sm text-slate-500">
              Loading portfolio...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // HOME
  // ==========================================

  return (
    <main className="min-h-screen bg-white text-slate-950">

      {/* ==================================================
          HERO
      ================================================== */}

      <section
        id="home"
        className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-[#fafbfc]"
      >

        {/* Decorative wavy line background */}

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
        >
          <g fill="none" stroke="#d9d9d9" strokeWidth="1">
            <path d="M-100 250 C250 300 350 600 700 450 C1050 300 1150 50 1550 150" />
            <path d="M-100 260 C250 310 350 610 700 460 C1050 310 1150 60 1550 160" />
            <path d="M-100 270 C250 320 350 620 700 470 C1050 320 1150 70 1550 170" />
            <path d="M-100 280 C250 330 350 630 700 480 C1050 330 1150 80 1550 180" />
            <path d="M-100 290 C250 340 350 640 700 490 C1050 340 1150 90 1550 190" />
            <path d="M-100 300 C250 350 350 650 700 500 C1050 350 1150 100 1550 200" />
            <path d="M-100 310 C250 360 350 660 700 510 C1050 360 1150 110 1550 210" />
            <path d="M-100 320 C250 370 350 670 700 520 C1050 370 1150 120 1550 220" />
            <path d="M-100 330 C250 380 350 680 700 530 C1050 380 1150 130 1550 230" />
            <path d="M-100 340 C250 390 350 690 700 540 C1050 390 1150 140 1550 240" />
            <path d="M-100 350 C250 400 350 700 700 550 C1050 400 1150 150 1550 250" />
            <path d="M-100 360 C250 410 350 710 700 560 C1050 410 1150 160 1550 260" />
            <path d="M-100 370 C250 420 350 720 700 570 C1050 420 1150 170 1550 270" />
            <path d="M-100 380 C250 430 350 730 700 580 C1050 430 1150 180 1550 280" />
            <path d="M-100 390 C250 440 350 740 700 590 C1050 440 1150 190 1550 290" />
            <path d="M-100 400 C250 450 350 750 700 600 C1050 450 1150 200 1550 300" />
            <path d="M-100 410 C250 460 350 760 700 610 C1050 460 1150 210 1550 310" />
            <path d="M-100 420 C250 470 350 770 700 620 C1050 470 1150 220 1550 320" />
            <path d="M-100 430 C250 480 350 780 700 630 C1050 480 1150 230 1550 330" />
            <path d="M-100 440 C250 490 350 790 700 640 C1050 490 1150 240 1550 340" />
            <path d="M-100 450 C250 500 350 800 700 650 C1050 500 1150 250 1550 350" />
            <path d="M-100 460 C250 510 350 810 700 660 C1050 510 1150 260 1550 360" />
            <path d="M-100 470 C250 520 350 820 700 670 C1050 520 1150 270 1550 370" />
          </g>
        </svg>

        {/* Hero content */}

        <div className="relative z-10 mx-auto w-[970px] max-w-[calc(100%-80px)] pt-[120px] pb-24 sm:pt-[188px]">

          {/* SOCIAL ICONS */}

          <div className="mt-10 mb-[10px] flex items-center gap-2">

            {(
              <a
                href={profile?.linkedinUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center text-slate-950 transition-transform hover:-translate-y-1"
              >
                <svg viewBox="0 0 24 24" className="h-[35px] w-[35px] fill-current">
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4V24h-4V8ZM8 8h3.83v2.19h.05c.53-1 1.83-2.57 3.76-2.57 4.02 0 4.76 2.65 4.76 6.1V24h-4v-9.12c0-2.18-.04-4.98-3.04-4.98-3.04 0-3.5 2.37-3.5 4.82V24H8V8Z" />
                </svg>
              </a>
            )}

            {(
              <a
                href={profile?.githubUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center text-slate-950 transition-transform hover:-translate-y-1"
              >
                <svg viewBox="0 0 24 24" className="h-[35px] w-[35px] fill-current">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.85 10.91.57.1.78-.25.78-.55v-2.16c-3.19.69-3.86-1.54-3.86-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.03 1.75 2.7 1.24 3.36.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17A10.9 10.9 0 0 1 12 6.1c.97 0 1.95.13 2.86.38 2.18-1.48 3.14-1.17 3.14-1.17.63 1.57.24 2.73.12 3.02.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.08.78 2.18v3.23c0 .3.2.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </a>
            )}

            {profile?.portfolioUrl && (
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Resume"
                className="flex h-9 w-9 items-center justify-center text-slate-950 transition-transform hover:-translate-y-1"
              >
                <svg viewBox="0 0 24 24" className="h-[35px] w-[35px]">
                  <rect x="4" y="2" width="16" height="20" rx="1" fill="currentColor" />
                  <rect x="7" y="6" width="10" height="2" fill="white" />
                  <rect x="7" y="10" width="10" height="2" fill="white" />
                  <rect x="7" y="14" width="7" height="2" fill="white" />
                </svg>
              </a>
            )}

          </div>

          {/* NAME */}

          <h1 className="text-[64px] font-extrabold leading-[0.99] tracking-[-2px] text-[#050505] sm:text-[92px] sm:tracking-[-4px] lg:text-[132px] lg:tracking-[-6px]">
            {profile?.name || "Harsh Sachan"}
          </h1>

          {/* ROLE */}

          <p className="mt-[38px] text-xl font-normal leading-[1.2] text-[#151515] sm:text-[28px]">
            Full Stack Developer
          </p>

          {/* EDUCATION */}

          {(profile?.university || profile?.graduationYear) && (
            <p className="mt-[17px] text-base text-[#61758a] sm:text-[18px]">
              {[profile?.university, profile?.graduationYear ? `Class of ${profile.graduationYear}` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}

          {/* ACTIONS */}

          <div className="mt-10 flex flex-wrap items-center gap-4">

            <Link
              to="/expertise"
              className="rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Explore My Work →
            </Link>

            {leetcode?.profileUrl && (
              <a
                href={leetcode.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
              >
                LeetCode ↗
              </a>
            )}

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;
