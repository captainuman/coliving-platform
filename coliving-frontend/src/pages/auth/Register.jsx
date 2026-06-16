import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [otpLoading, setOtpLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [govtId, setGovtId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    dob: "",
    role: "tenant",
    gender: "",
    smoking: "no",
    sleep: "early",
    cleanliness: "medium",
    food: "veg",
    country: "",
    city: "",
    zipCode: "",
    currency: "INR",
    language: "English",
    otp: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOtp = async () => {
    if (!form.email) return toast.error("Enter email first");

    try {
      setOtpLoading(true);

      const res = await API.post("/auth/send-otp", {
        email: form.email,
      });

      setOtpSent(true);
      toast.success(res.data?.message || "OTP sent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.otp) return toast.error("Enter OTP");

    try {
      setRegisterLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (govtId) {
        formData.append("govtId", govtId);
      }

      await API.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Registration successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setRegisterLoading(false);
    }
  };

  const inputClass =
    "w-full h-12 sm:h-14 rounded-full bg-white/20 backdrop-blur-md px-4 sm:px-5 text-white placeholder-white/60 outline-none";

  const selectClass =
    "w-full h-12 sm:h-14 rounded-full bg-white/20 backdrop-blur-md px-4 sm:px-5 text-white outline-none";

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main className="min-h-screen bg-linear-to-br from-black via-[#111827] to-[#1f2937] flex items-center justify-center px-3 sm:px-6 py-6 sm:py-10 font-recoleta">
        <form
          onSubmit={handleRegister}
          className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto hide-scrollbar rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10"
        >
          <div className="absolute inset-0 bg-linear-to-br from-[#7a7383]/60 via-[#1d1e25] to-[#31383a]" />
          <div className="absolute bottom-0 left-0 w-full h-[55%] bg-linear-to-tr from-[#7a7383]/60 via-[#8b8588]/40 to-transparent blur-2xl" />

          <div className="relative z-10">
            <h1 className="text-center text-3xl sm:text-4xl font-light text-white mb-2">
              Create Account
            </h1>

            <p className="text-center text-white/50 mb-8 sm:mb-10 text-sm sm:text-base">
              Join HomeTown Hub
            </p>

            <div className="mb-8">
              <h2 className="text-lg sm:text-xl text-white mb-5">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full sm:flex-1 min-w-0 h-12 sm:h-14 rounded-full bg-white/20 backdrop-blur-md px-4 sm:px-5 text-white placeholder-white/60 outline-none"
                    required
                  />

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="w-full sm:w-auto h-12 sm:h-14 px-5 rounded-full bg-[#d9dfef] text-[#4b5265] font-medium hover:bg-white transition disabled:opacity-50"
                  >
                    {otpLoading ? "Sending..." : "OTP"}
                  </button>
                </div>

                <input
                  type="tel"
                  name="mobile"
                  pattern="[0-9]{10}"
                  placeholder="Mobile Number"
                  value={form.mobile}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={6}
                  className={inputClass}
                  required
                />

                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={selectClass}
                  required
                >
                  <option className="text-black" value="">
                    Select Gender
                  </option>
                  <option className="text-black" value="male">
                    Male
                  </option>
                  <option className="text-black" value="female">
                    Female
                  </option>
                  <option className="text-black" value="other">
                    Other
                  </option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg sm:text-xl text-white mb-5">
                Account Type
              </h2>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className={selectClass}
              >
                <option className="text-black" value="tenant">
                  Tenant
                </option>
                <option className="text-black" value="owner">
                  Owner
                </option>
              </select>
            </div>

            <div className="mb-8">
              <h2 className="text-lg sm:text-xl text-white mb-5">
                Lifestyle Preferences
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <select name="smoking" value={form.smoking} onChange={handleChange} className={selectClass}>
                  <option className="text-black" value="no">Non-Smoker</option>
                  <option className="text-black" value="yes">Smoker</option>
                  <option className="text-black" value="occasionally">Occasionally</option>
                </select>

                <select name="sleep" value={form.sleep} onChange={handleChange} className={selectClass}>
                  <option className="text-black" value="early">Sleeps Early</option>
                  <option className="text-black" value="late">Sleeps Late</option>
                  <option className="text-black" value="flexible">Flexible</option>
                </select>

                <select name="cleanliness" value={form.cleanliness} onChange={handleChange} className={selectClass}>
                  <option className="text-black" value="low">Low Cleanliness</option>
                  <option className="text-black" value="medium">Medium Cleanliness</option>
                  <option className="text-black" value="high">High Cleanliness</option>
                </select>

                <select name="food" value={form.food} onChange={handleChange} className={selectClass}>
                  <option className="text-black" value="veg">Vegetarian</option>
                  <option className="text-black" value="non-veg">Non Vegetarian</option>
                  <option className="text-black" value="both">Both</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg sm:text-xl text-white mb-5">
                Location & Preferences
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <input name="country" placeholder="Country" value={form.country} onChange={handleChange} className={inputClass} required />
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} className={inputClass} required />
                <input name="zipCode" placeholder="Zip Code" value={form.zipCode} onChange={handleChange} className={inputClass} required />

                <select name="currency" value={form.currency} onChange={handleChange} className={selectClass}>
                  <option className="text-black" value="INR">INR</option>
                  <option className="text-black" value="USD">USD</option>
                  <option className="text-black" value="EUR">EUR</option>
                </select>

                <select name="language" value={form.language} onChange={handleChange} className={selectClass}>
                  <option className="text-black" value="English">English</option>
                  <option className="text-black" value="Hindi">Hindi</option>
                  <option className="text-black" value="Malayalam">Malayalam</option>
                  <option className="text-black" value="Tamil">Tamil</option>
                </select>
              </div>
            </div>

            {otpSent && (
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={handleChange}
                className={`mb-6 ${inputClass}`}
                required
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setGovtId(e.target.files[0])}
              className="mb-6 w-full rounded-2xl sm:rounded-full bg-white/20 px-4 sm:px-5 py-4 text-white text-sm file:mr-4 file:rounded-full file:border-0 file:bg-[#d9dfef] file:px-4 file:py-2 file:text-[#4b5265]"
            />

            <button
              type="submit"
              disabled={!otpSent || registerLoading}
              className="w-full h-12 sm:h-16 rounded-full bg-[#d9dfef] text-[#4b5265] text-base sm:text-xl font-medium hover:bg-white transition disabled:opacity-50"
            >
              {registerLoading ? "Creating..." : "Create Account"}
            </button>

            <p className="mt-6 sm:mt-8 text-center text-white/50 text-sm sm:text-base">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white font-semibold hover:text-blue-300 transition"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </main>
    </motion.div>
  );
}