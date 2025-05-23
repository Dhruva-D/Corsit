import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../Header/Header";
import config from "../../config";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${config.apiBaseUrl}/login`, {
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
      login({ loggedIn: true });
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="flex h-[100vh] flex-col items-center justify-center bg-gray-900 text-gray-200 relative">
        <div className="card-wrapper h-[600px] w-[350px] md:min-w-[500px] mt-20">
          <div className="card-content flex items-center justify-center text-lg bg-gray-800 p-8 rounded-lg shadow-md border border-gray-700">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center px-12 space-y-8 w-full max-w-lg">
              <h1 className="text-4xl font-bold mb-20 text-[#ed5a2d]">LOGIN</h1>
              {error && <p className="text-red-500 text-center bg-red-500/10 p-3 rounded-lg w-full">{error}</p>}
              <div className="w-full">
                <label className="block text-2xl font-medium mb-3 text-gray-300">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 border rounded-lg border-gray-600 text-xl bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] shadow-md"
                />
              </div>
              <div className="w-full">
                <label className="block text-2xl font-medium mb-3 text-gray-300">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 border rounded-lg border-gray-600 text-xl bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] shadow-md"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 my-7 py-4 bg-[#ed5a2d] rounded-lg text-xl font-semibold text-center transition text-white shadow-md hover:bg-[#d54a1d] active:scale-95 cursor-pointer"
              >
                Login
              </button>

              <p className="text-center text-gray-400">
                Don't have an account?{' '}
                <NavLink to="/signup" className="text-[#ed5a2d] hover:text-[#ff6b3d] font-bold">
                  Sign up here
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
