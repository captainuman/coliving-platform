import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",  
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const redirectByRole = (user) => {
  if (user.role === "admin") {
    navigate("/admin/analytics");
  } else if (user.role === "owner") {
    navigate("/owner/dashboard");
  } else {
    navigate("/properties");
  }
};

const handleLogin = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    return toast.error("All fields required");
  }

  try {
    setLoading(true);

    const res = await API.post("/auth/login", form);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    toast.success("Login successful");

    redirectByRole(res.data.user);

  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Login failed"
    );
  } finally {
    setLoading(false);
  }
};

const handleGoogleLogin = () => {
  const baseURL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "https://coliving-backend.onrender.com";

  window.location.href =
    `${baseURL}/api/auth/google`;
};

return (
  <motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 100, opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Navbar />

    <main className="min-h-[calc(100vh-80px)] bg-linear-to-br from-black via-[#111827] to-[#1f2937] flex items-center justify-center px-3 sm:px-6 py-6 sm:py-0 font-recoleta">
      <div className="relative w-full max-w-xl min-h-[620px] sm:h-[90vh] my-3 sm:my-5 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
        
        <div className="absolute inset-0 bg-linear-to-br from-[#7a7383]/60 via-[#1d1e25] to-[#31383a]" />
        
        <div className="absolute bottom-0 left-0 w-full h-[55%] bg-linear-to-tr from-[#7a7383]/60 via-[#8b8588]/40 to-transparent blur-2xl" />

        <div className="relative z-10 w-full max-w-sm px-4 sm:px-2">
          
          <h1 className="text-center text-3xl sm:text-4xl font-light text-white my-5 tracking-wide">
            Log In
          </h1>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-5 sm:mb-8 flex items-center rounded-full bg-white/20 backdrop-blur-md overflow-hidden">
              <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-full bg-[#d9dfef] flex items-center justify-center text-[#4b5265] text-lg sm:text-xl">
                ✉
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={form.email}
                onChange={handleChange}
                className="flex-1 min-w-0 h-12 sm:h-16 bg-transparent px-4 sm:px-5 text-white placeholder-white/60 outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-5 sm:mb-8 flex items-center rounded-full bg-white/20 backdrop-blur-md overflow-hidden">
              <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-full bg-[#d9dfef] flex items-center justify-center text-[#4b5265] text-lg sm:text-xl">
                🔒
              </div>

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="flex-1 min-w-0 h-12 sm:h-16 bg-transparent px-4 sm:px-5 text-white placeholder-white/60 outline-none"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 sm:h-16 rounded-full bg-[#d9dfef] text-[#4b5265] text-base sm:text-xl font-medium hover:bg-white transition"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Remember / Forgot */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-white/45 text-sm sm:text-base">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="accent-[#6d7078]"
              />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="italic hover:text-white"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="mt-6 w-full h-12 sm:h-14 rounded-full bg-white/15 border border-white/10 text-white/70 font-medium flex items-center justify-center gap-3 hover:bg-white/25 transition"
          >
            <FcGoogle className="text-xl sm:text-2xl" />
            Continue with Google
          </button>

          {/* Register */}
          <div className="mt-8 text-center">
            <p className="text-white/50 text-sm sm:text-base">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-white font-semibold hover:text-blue-300 transition-colors"
              >
                Register
              </Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  </motion.div>
);
}
