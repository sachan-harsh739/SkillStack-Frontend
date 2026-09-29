import AdminCertifications from "./pages/AdminCertifications";
import AdminExpertise from "./pages/AdminProjects";
import AdminEducation from "./pages/AdminEducation";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Education from "./pages/Education";
import Expertise from "./pages/Projects";
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
          path="/admin/history"
          element={<AdminEducation />}
        />

        <Route
          path="/admin/education"
          element={<Navigate to="/admin/history" replace />}
        />

        <Route
          path="/admin/expertise"
          element={<AdminExpertise />}
        />

        <Route
          path="/admin/projects"
          element={<Navigate to="/admin/expertise" replace />}
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


        {/* HISTORY */}

        <Route
          path="/history"
          element={<Education />}
        />

        <Route
          path="/education"
          element={<Navigate to="/history" replace />}
        />


        {/* EXPERTISE */}

        <Route
          path="/expertise"
          element={<Expertise />}
        />

        <Route
          path="/projects"
          element={<Navigate to="/expertise" replace />}
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
