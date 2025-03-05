import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import About from "./components/About/About.jsx";
import Alumni from "./components/Alumni/Alumni.jsx";
import Contact from "./components/Contact/Contact.jsx";
import Events from "./components/Events/Events.jsx";
import Home from "./components/Home/Home.jsx";
import Projects from "./components/Projects/Projects.jsx";
import Register from "./components/Register/Register.jsx";
import Team from "./components/Team/Team.jsx";
import Login from "./components/Login/Login.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Editprofile from "./components/Profile/Editprofile.jsx";
import Changepassword from "./components/Profile/Changepassword.jsx";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider

// Error Component
const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-[#080514] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold text-[#ed5a2d] mb-4">Page Not Found</h1>
        <p className="text-gray-300 mb-8">Sorry, we couldn't find the page you're looking for.</p>
        <a
          href="/"
          className="inline-block bg-[#ed5a2d] text-white px-6 py-3 rounded-lg hover:bg-[#ff6b3d] transition-colors"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <AuthProvider>
          <Layout />
        </AuthProvider>
      }
      errorElement={<ErrorPage />}
    >
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="projects" element={<Projects />} />
      <Route path="alumni" element={<Alumni />} />
      <Route path="contact" element={<Contact />} />
      <Route path="events" element={<Events />} />
      <Route path="register" element={<Register />} />
      <Route path="team" element={<Team />} />
      <Route path="login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="profile" element={<Profile />} />
      <Route path="edit-profile" element={<Editprofile />} />
      <Route path="change-password" element={<Changepassword />} />

      {/* Catch all unmatched routes */}
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
