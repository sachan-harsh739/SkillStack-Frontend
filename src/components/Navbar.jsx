import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Profile",
      path: "/profile",
    },
    {
      name: "Education",
      path: "/education",
    },
    {
      name: "Projects",
      path: "/projects",
    },
    {
      name: "LeetCode",
      path: "/leetcode",
    },
    {
      name: "Certifications",
      path: "/certification",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#080808]/90 text-white backdrop-blur-xl">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">

        {/* =====================================
            LOGO
        ===================================== */}

        <Link
          to="/"
          className="group flex items-center gap-2"
        >

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition group-hover:scale-105">
            S
          </div>

          <div className="text-xl font-bold tracking-tight">
            Skill<span className="text-blue-400">Stack</span>
          </div>

        </Link>


        {/* =====================================
            DESKTOP NAVIGATION
        ===================================== */}

        <div className="hidden items-center gap-1 md:flex">

          {navItems.map((item) => {

            const isActive =
              location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition duration-200 ${
                  isActive
                    ? "bg-white/[0.08] text-white"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {item.name}

                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-blue-400" />
                )}
              </Link>
            );

          })}

        </div>


        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="hidden items-center gap-3 md:flex">

          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">

            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />

            <span className="text-xs font-medium text-white/50">
              Portfolio
            </span>

          </div>

        </div>


        {/* =====================================
            MOBILE MENU BUTTON
        ===================================== */}

        <div className="md:hidden">

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Open navigation"
            onClick={() => {
              const menu =
                document.getElementById(
                  "mobile-menu"
                );

              menu?.classList.toggle("hidden");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

        </div>

      </div>


      {/* =====================================
          MOBILE NAVIGATION
      ===================================== */}

      <div
        id="mobile-menu"
        className="hidden border-t border-white/[0.07] bg-[#080808] px-5 py-4 md:hidden"
      >

        <div className="space-y-1">

          {navItems.map((item) => {

            const isActive =
              location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white/[0.08] text-white"
                    : "text-white/50 hover:bg-white/[0.05] hover:text-white"
                }`}
                onClick={() => {
                  document
                    .getElementById("mobile-menu")
                    ?.classList.add("hidden");
                }}
              >
                {item.name}
              </Link>
            );

          })}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;