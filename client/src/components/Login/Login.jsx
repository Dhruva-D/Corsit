import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext
import "./Login.css";

const Login = ({ setShowHeader }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Use login() instead of setUser

  useEffect(() => {
    if (setShowHeader) setShowHeader(false);
    return () => { if (setShowHeader) setShowHeader(true); };
  }, [setShowHeader]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("https://corsit-backend.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and update auth state
      localStorage.setItem("token", data.token);
      login({ loggedIn: true }); // ✅ Use login() from AuthContext
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-[100vh] flex-col items-center justify-center bg-[#272829] text-[#f7ffff] relative">
      <NavLink to="/" className="absolute top-6 right-10 text-xl font-semibold hover:text-[rgba(173,216,230,0.8)]">
        Home
      </NavLink>
      <div className="card-wrapper h-[600px] w-[500px] mt-20">
        <div className="card-content flex items-center justify-center text-lg">
          <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center px-12 space-y-8 w-full max-w-lg">
            <h1 className="text-4xl font-bold mb-20">SIGN IN</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="w-full">
              <label className="block text-2xl font-medium mb-3">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-xl focus:bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md"
              />
            </div>
            <div className="w-full">
              <label className="block text-2xl font-medium mb-3">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-xl focus:bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 my-7 py-4 border-[0.25px] border-slate-400 rounded-4xl text-xl font-semibold text-center transition text-white shadow-md hover:scale-105 active:scale-95 cursor-pointer bg-[rgba(209,213,219,0.1)]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
