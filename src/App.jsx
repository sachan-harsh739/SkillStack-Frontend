import AdminCertifications from "./pages/AdminCertifications";
import AdminProjects from "./pages/AdminProjects";
import AdminEducation from "./pages/AdminEducation";
import AdminProfile from "./pages/AdminProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Education from "./pages/Education";
import Projects from "./pages/Projects";
import LeetCode from "./pages/LeetCode";
import Certification from "./pages/Certification";

function App() {
  return (
    <BrowserRouter>

      {/* =====================================
          NAVBAR
      ===================================== */}

      <Navbar />

      {/* =====================================
          ROUTES
      ===================================== */}

      <Routes>
<Route
  path="/admin-login"
  element={<AdminLogin />}
/>
<Route
  path="/admin"
  element={<AdminDashboard />}
/>
<Route
  path="/admin/profile"
  element={<AdminProfile />}
/>
<Route
  path="/admin/education"
  element={<AdminEducation />}
/>
<Route
  path="/admin/projects"
  element={<AdminProjects />}
/>
<Route
  path="/admin/certifications"
  element={<AdminCertifications />}
/>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* PROFILE */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* EDUCATION */}

        <Route
          path="/education"
          element={<Education />}
        />


        {/* PROJECTS */}

        <Route
          path="/projects"
          element={<Projects />}
        />


        {/* LEETCODE */}

        <Route
          path="/leetcode"
          element={<LeetCode />}
        />


        {/* CERTIFICATIONS */}

        <Route
          path="/certification"
          element={<Certification />}
        />


        {/* FALLBACK */}

        <Route
          path="*"
          element={<Home />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
