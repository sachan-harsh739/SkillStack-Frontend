import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Education",
      path: "/history",
    },
    {
      name: "Projects",
      path: "/expertise",
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
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 text-slate-950 shadow-sm backdrop-blur-xl">

      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">

        {/* =====================================
            LOGO
        ===================================== */}

        <Link
          to="/"
          className="group flex items-center gap-2"
        >

          <div className="text-sm font-extrabold tracking-tight text-slate-950">
            SkillStack
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
                className={`relative px-3 py-2 text-xs font-medium transition duration-200 ${
                  isActive
                    ? "text-slate-950"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                {item.name}

                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-slate-950" />
                )}
              </Link>
            );

          })}

        </div>


        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="hidden w-[92px] md:block" />


        {/* =====================================
            MOBILE MENU BUTTON
        ===================================== */}

        <div className="md:hidden">

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
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
        className="hidden border-t border-slate-200 bg-white px-5 py-4 md:hidden"
      >

        <div className="space-y-1">

          {navItems.map((item) => {

            const isActive =
              location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
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
