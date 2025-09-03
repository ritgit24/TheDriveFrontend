"use client";
import { useState } from "react";
import { HardDrive } from "lucide-react";
import {useRouter} from "next/navigation";

const BACKEND_URL = "http://127.0.0.1:8001";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      alert("Login successful!");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left half - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
        <img
          src="/beautiful-pink-flower-stickers-Graphics-44159975-1-580x387.png" 
          alt="Login Illustration"
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Right half - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-md">
          <div className="flex items-center justify-center mb-6 gap-3">
            <HardDrive className="text-indigo-600" size={28} />
            <h2 className="text-3xl font-extrabold text-gray-800">Login</h2>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 text-black"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 text-black"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white py-3 rounded-xl shadow-lg hover:scale-105 transform transition duration-300"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-indigo-600 font-semibold hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
