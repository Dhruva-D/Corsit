import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout.jsx";
import About from "./components/About/About.jsx";
import Alumni from "./components/Alumni/Alumni.jsx";
import Contact from "./components/Contact/Contact.jsx";
import Events from "./components/Events/Events.jsx";
import Home from "./components/Home/Home.jsx";
import Projects from "./components/Projects/Projects.jsx";
import Register from "./components/Register/Register.jsx";
import RoboExpoRegister from "./components/Register/RoboExpoRegister.jsx";
import Recruitments25 from "./components/Register/Recruitments25.jsx";
import Team from "./components/Team/Team.jsx";
import Login from "./components/Login/Login.jsx";
import Signup from "./components/Login/Signup.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Editprofile from "./components/Profile/Editprofile.jsx";
import Changepassword from "./components/Profile/Changepassword.jsx";
import Admin from "./components/Profile/Admin.jsx";
import WorkshopReg25 from "./components/Profile/WorkshopReg25.jsx";
import RoboExpoReg25 from "./components/Profile/RoboExpoReg25.jsx";
import RecruitmentsReg25 from "./components/Profile/RecruitmentsReg25.jsx";
import Expo25FeedbackReg from "./components/Profile/Expo25FeedbackReg.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Expo25Feedback from "./components/Feedback/Expo25Feedback.jsx";
import Round1Results from "./components/Results/Round1Results.jsx";

// Global image error handler to ensure default images are shown when loading fails
import defaultProfileImage from './assets/default-profile.svg';
import defaultProjectImage from './assets/default-project.svg';

// Set up global error handler for images
window.addEventListener('error', (e) => {
  // Check if the error is from an image
  if (e.target.tagName === 'IMG') {
    console.log(`Image failed to load: ${e.target.src}`);
    
    // Set appropriate default based on context clues
    if (e.target.alt && e.target.alt.toLowerCase().includes('profile')) {
      e.target.src = defaultProfileImage;
    } else if (e.target.alt && e.target.alt.toLowerCase().includes('project')) {
      e.target.src = defaultProjectImage;
    } else {
      // Default to profile image if context is unclear
      e.target.src = defaultProfileImage;
    }
    
    // Prevent the same error from occurring again
    e.target.onerror = null;
  }
}, true);

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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth routes outside of Layout */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* Main layout with nested routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="projects" element={<Projects />} />
            <Route path="alumni" element={<Alumni />} />
            <Route path="contact" element={<Contact />} />
            <Route path="events" element={<Events />} />
            <Route path="register" element={<Register />} />
            <Route path="roboexpo-register" element={<RoboExpoRegister />} />
            <Route path="recruitments25" element={<Recruitments25 />} />
            <Route path="team" element={<Team />} />
            <Route path="expo25-feedback" element={<Expo25Feedback />} />
            <Route path="round1-res" element={<Round1Results />} />
            
            {/* Protected Routes */}
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="edit-profile" element={<ProtectedRoute><Editprofile /></ProtectedRoute>} />
            <Route path="change-password" element={<ProtectedRoute><Changepassword /></ProtectedRoute>} />
            <Route path="admin" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />
            <Route path="workshop-reg-25" element={<AdminProtectedRoute><WorkshopReg25 /></AdminProtectedRoute>} />
            <Route path="roboexpo-reg-25" element={<AdminProtectedRoute><RoboExpoReg25 /></AdminProtectedRoute>} />
            <Route path="recruitments-reg-25" element={<AdminProtectedRoute><RecruitmentsReg25 /></AdminProtectedRoute>} />
            <Route path="expo25-feedback-reg" element={<AdminProtectedRoute><Expo25FeedbackReg /></AdminProtectedRoute>} />
          </Route>
          
          {/* Catch all unmatched routes */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);