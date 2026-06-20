import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import toast from "react-hot-toast";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activeMenu, setActiveMenu] = useState("profile");
  const [securityMode, setSecurityMode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    dob: "",
    gender: "",
    smoking: "",
    sleep: "",
    food: "",
    cleanliness: "",
    country: "",
    city: "",
    zipCode: "",
    currency: "",
    language: "",
  });

  const [reviews, setReviews] = useState([]);

  const [securityForm, setSecurityForm] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchProfile();
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await API.get("/reviews/my-reviews");
      setReviews(res.data);
    } catch (err) {
      console.log("Reviews route not found:", err.response?.status);
      setReviews([]);
    }
  };

  const BACKEND_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "https://coliving-backend.onrender.com";

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");
      console.log("Profile pic:", res.data.profilePic);

      setUser(res.data);
      setPreview(res.data.profilePic || "");

      setSecurityForm({
        email: res.data.email || "",
        currentPassword: "",
        newPassword: "",
      });

      setForm({
        name: res.data.name || "",
        mobile: res.data.mobile || "",
        dob: res.data.dob ? res.data.dob.split("T")[0] : "",
        gender: res.data.gender || "",
        smoking: res.data.smoking || "",
        sleep: res.data.sleep || "",
        food: res.data.food || "",
        cleanliness: res.data.cleanliness || "",
        country: res.data.country || "",
        city: res.data.city || "",
        zipCode: res.data.zipCode || "",
        currency: res.data.currency || "",
        language: res.data.language || "",
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to load profile");
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const handleEdit = () => {
    setEditing(true);

    setTimeout(() => {
      const section = document.getElementById("edit-profile");

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSecurityChange = (e) => {
    setSecurityForm({
      ...securityForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      await API.put("/users/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated");
      setEditing(false);
      fetchProfile();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.log("PROFILE UPDATE ERROR:", err.response?.data || err);
      toast.error("Update failed");
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();

    try {
      await API.put("/users/me/email", {
        email: securityForm.email,
        password: securityForm.currentPassword,
      });

      toast.success("Email updated");
      setSecurityMode("");
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update email");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    try {
      await API.put("/users/me/password", {
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword,
      });

      toast.success("Password updated");

      setSecurityMode("");

      setSecurityForm({
        ...securityForm,
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/feedback", {
        message: feedback,
      });

      toast.success("Feedback sent");
      setFeedback("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send feedback");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out");
    navigate("/login");
  };

  const value = (item) => item || "Not provided";

  const address =
    user?.city || user?.country || user?.zipCode
      ? [user.city, user.country, user.zipCode].filter(Boolean).join(", ")
      : "Not provided";

  if (!user) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure? This will permanently delete your account.",
    );

    if (!confirmed) return;

    try {
      await API.delete("/users/me");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Account deleted");

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="grid lg:grid-cols-[330px_1fr] gap-8 px-4 md:px-15 py-5 lg:py-8">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden bg-blue-950 text-white px-4 py-3 rounded-xl font-semibold w-fit mb-4"
        >
          ☰ Menu
        </button>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/50"
            />

            <aside className="absolute left-0 top-0 h-full w-70 bg-gray-900 p-4 space-y-3 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-[20px] font-bold">Hi, {user.name}</h1>
                  <p className="text-[12px] text-white/80">{user.email}</p>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl"
                >
                  ×
                </button>
              </div>

              <MobileMenuButton
                active={activeMenu === "profile"}
                icon="♙"
                title="Profile"
                onClick={() => {
                  handleMenuClick("profile");
                  setMobileMenuOpen(false);
                }}
              />

              <MobileMenuButton
                active={activeMenu === "reviews"}
                icon="▢"
                title="Reviews"
                onClick={() => {
                  handleMenuClick("reviews");
                  setMobileMenuOpen(false);
                }}
              />

              <MobileMenuButton
                active={activeMenu === "security"}
                icon="⚙"
                title="Security"
                onClick={() => {
                  handleMenuClick("security");
                  setMobileMenuOpen(false);
                }}
              />

              <MobileMenuButton
                active={activeMenu === "help"}
                icon="💬"
                title="Help"
                onClick={() => {
                  handleMenuClick("help");
                  setMobileMenuOpen(false);
                }}
              />
              <button
                onClick={handleLogout}
                className="w-full rounded-2xl border border-red-200 text-red-500 px-4 py-3 font-bold"
              >
                Signout
              </button>
            </aside>
          </div>
        )}

        {/* Desktop Sidebar - same as before */}
        <aside className="hidden lg:block space-y-5">
          <div className="px-4">
            <h1 className="text-[28px] font-bold">Hi, {user.name}</h1>
            <p className="text-[14px] font-normal mt-1">{user.email}</p>
          </div>

          <MenuButton
            active={activeMenu === "profile"}
            icon="♙"
            title="Profile"
            text="Provide your personal and contact details"
            onClick={() => handleMenuClick("profile")}
          />
          <MenuButton
            active={activeMenu === "reviews"}
            icon="▢"
            title="Reviews"
            text="Read reviews you've shared"
            onClick={() => handleMenuClick("reviews")}
          />
          <MenuButton
            active={activeMenu === "security"}
            icon="⚙"
            title="Security and settings"
            text="Update your email or password"
            onClick={() => handleMenuClick("security")}
          />

          <MenuButton
            active={activeMenu === "help"}
            icon="💬"
            title="Help and feedback"
            text="Get customer support"
            onClick={() => handleMenuClick("help")}
          />

          <button
            onClick={handleLogout}
            className="w-full rounded-2xl border border-red-200 text-red-600 px-5 py-4 font-bold hover:bg-red-50"
          >
            Signout
          </button>
        </aside>

        <main className="rounded-2xl lg:rounded-3xl border text-black bg-white border-gray-200 px-4 sm:px-6 md:px-16 py-6 md:py-14 mb-10">
          {activeMenu === "profile" && (
            <section>
              <div className="flex items-center gap-3 mb-10">
                <img
                  src={
                    preview
                      ? preview.startsWith("blob:")
                        ? preview
                        : preview.startsWith("/uploads")
                        ? `${BACKEND_URL}${preview}`
                        : `${BACKEND_URL}/uploads/${preview}`
                      : "/default-avatar.png"
                  }
                  alt="Profile preview"
                  className="w-14 h-14 lg:w-20 lg:h-20 rounded-full object-cover border"
                />

                <div>
                  <h1 className="text-[22px] lg:text-[28px] font-serif font-medium leading-7 lg:leading-8.5">
                    {user.name}
                  </h1>

                  <p className="text-[14px]">{user.email}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h2 className="text-[22px] lg:text-[28px] font-serif font-medium">
                      Basic information
                    </h2>

                    <p className="text-[14px]">
                      Make sure this information matches your travel ID, like
                      your passport or licence.
                    </p>
                  </div>

                  <button onClick={handleEdit} className="font-bold text-lg">
                    Edit
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-x-32 gap-y-2 text-[14px] mt-2 leading-5">
                  <Info label="Name" value={value(user.name)} />
                  <Info label="Bio" value="Not provided" />
                  <Info
                    label="Date of birth"
                    value={
                      user.dob
                        ? new Date(user.dob).toLocaleDateString()
                        : "Not provided"
                    }
                  />
                  <Info label="Gender" value={value(user.gender)} />
                  <Info label="Accessibility needs" value="Not provided" />
                </div>
              </div>

              <div className="mt-12 lg:mt-20">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h2 className="text-[22px] lg:text-[28px] font-serif font-medium">
                      Contact
                    </h2>

                    <p className="text-[14px]">
                      Receive account activity alerts and trip updates by
                      sharing this information.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-x-32 gap-y-2 text-[14px] mt-2 leading-5">
                  <Info label="Mobile number" value={value(user.mobile)} />
                  <Info label="Email" value={value(user.email)} />
                  <Info label="Emergency contact" value="Not provided" />
                  <Info label="Address" value={address} />
                </div>
              </div>

              <div className="mt-12 lg:mt-20">
                <div className="flex justify-between items-start">
                  <h2 className="text-[22px] lg:text-[28px] font-serif font-medium">
                    Preferences
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-x-32 gap-y-2 text-[14px] mt-2 leading-5">
                  <Info label="Smoking" value={value(user.smoking)} />
                  <Info label="Sleep habit" value={value(user.sleep)} />
                  <Info label="Food preference" value={value(user.food)} />
                  <Info label="Cleanliness" value={value(user.cleanliness)} />
                  <Info label="Currency" value={value(user.currency)} />
                  <Info label="Language" value={value(user.language)} />
                </div>
              </div>
            </section>
          )}

          {activeMenu === "reviews" && (
            <section>
              <h2 className="text-[22px] lg:text-[28px] font-serif font-medium">
                Reviews
              </h2>

              {reviews.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold">No reviews yet</h3>

                  <p className="mt-2">
                    After you complete a booking, your reviews will appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-8 space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border rounded-2xl p-5">
                      <p className="font-bold">⭐ {review.rating}/5</p>

                      <p className="mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeMenu === "security" && (
            <section>
              <h2 className="text-[22px] lg:text-[28px] font-serif font-medium leading-8">
                Sign-in and security
              </h2>

              <p className="text-[13px]">
                Keep your account safe with a secure password and by signing out
                of devices you're not actively using.
              </p>

              <div className="mt-10 space-y-3 max-w-70">
                <SecurityCard
                  title="Update Email"
                  onClick={() => setSecurityMode("email")}
                />

                <SecurityCard
                  title="Change password"
                  onClick={() => setSecurityMode("password")}
                />
              </div>

              <div>
                <h2 className="text-[22px] lg:text-[28px] font-serif font-medium leading-8">
                  Account management
                </h2>

                <p className="text-[15px] font-normal mb-10">
                  Control other options to manage your data, like deleting your
                  account.
                </p>

                <button
                  onClick={handleDeleteAccount}
                  className="text-[15px] underline text-red-600 hover:text-red-800"
                >
                  Delete account
                </button>
                <h2 className="text-[15px]">
                  Permanently delete your account and data.
                </h2>
              </div>

              {securityMode === "email" && (
                <form
                  onSubmit={handleUpdateEmail}
                  className="mt-8 max-w-xl rounded-2xl border border-gray-200 p-6 space-y-4"
                >
                  <h3 className="text-xl font-bold">Update email</h3>

                  <input
                    type="email"
                    name="email"
                    value={securityForm.email}
                    onChange={handleSecurityChange}
                    className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:border-[#000b3f]"
                    required
                  />

                  <input
                    type="password"
                    name="currentPassword"
                    value={securityForm.currentPassword}
                    onChange={handleSecurityChange}
                    className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:border-[#000b3f]"
                    placeholder="Confirm password"
                    required
                  />

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="rounded-full bg-[#000b3f] text-white px-7 py-3 font-bold"
                    >
                      Save email
                    </button>

                    <button
                      type="button"
                      onClick={() => setSecurityMode("")}
                      className="rounded-full border px-7 py-3 font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {securityMode === "password" && (
                <form
                  onSubmit={handleUpdatePassword}
                  className="mt-8 max-w-xl rounded-2xl border border-gray-200 p-6 space-y-4"
                >
                  <h3 className="text-xl font-bold">Change password</h3>

                  <input
                    type="password"
                    name="currentPassword"
                    value={securityForm.currentPassword}
                    onChange={handleSecurityChange}
                    className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:border-[#000b3f]"
                    placeholder="Current password"
                    required
                  />

                  <input
                    type="password"
                    name="newPassword"
                    value={securityForm.newPassword}
                    onChange={handleSecurityChange}
                    className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:border-[#000b3f]"
                    placeholder="New password"
                    required
                  />

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="rounded-full bg-[#000b3f] text-white px-7 py-3 font-bold"
                    >
                      Save password
                    </button>

                    <button
                      type="button"
                      onClick={() => setSecurityMode("")}
                      className="rounded-full border px-7 py-3 font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}
          {activeMenu === "help" && (
            <section>
              <h2 className="text-[22px] lg:text-[28px] font-serif font-medium leading-8">
                Help and feedback
              </h2>

              <p className="text-[15px] mt-2">
                Send feedback or ask for support.
              </p>

              <form
                onSubmit={handleFeedbackSubmit}
                className="mt-8 rounded-2xl border border-gray-200 p-6 space-y-4 max-w-xl"
              >
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:border-[#000b3f] min-h-36"
                  placeholder="Write your feedback..."
                  required
                />

                <button
                  type="submit"
                  className="rounded-full bg-[#000b3f] text-white px-7 py-3 font-bold"
                >
                  Send feedback
                </button>
              </form>
            </section>
          )}

          {editing && (
            <form
              id="edit-profile"
              onSubmit={handleSubmit}
              className="mt-20 rounded-3xl border border-gray-200 p-8 space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif font-bold">Edit profile</h2>

                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="font-bold"
                >
                  Cancel
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                />

                <Input
                  name="mobile"
                  placeholder="Mobile Number"
                  value={form.mobile}
                  onChange={handleChange}
                />

                <Input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                />

                <Select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  placeholder="Select Gender"
                  options={["male", "female"]}
                />

                <Select
                  name="smoking"
                  value={form.smoking}
                  onChange={handleChange}
                  placeholder="Smoking"
                  options={["yes", "no"]}
                />

                <Select
                  name="sleep"
                  value={form.sleep}
                  onChange={handleChange}
                  placeholder="Sleep Habit"
                  options={["early", "late"]}
                />

                <Select
                  name="food"
                  value={form.food}
                  onChange={handleChange}
                  placeholder="Food Preference"
                  options={["veg", "non-veg", "both"]}
                />

                <Select
                  name="cleanliness"
                  value={form.cleanliness}
                  onChange={handleChange}
                  placeholder="Cleanliness"
                  options={["low", "medium", "high"]}
                />

                <Input
                  name="country"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleChange}
                />

                <Input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                />

                <Input
                  name="zipCode"
                  placeholder="Zip Code"
                  value={form.zipCode}
                  onChange={handleChange}
                />

                <Select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  placeholder="Currency"
                  options={["INR", "USD", "EUR"]}
                />

                <Input
                  name="language"
                  placeholder="Language"
                  value={form.language}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#000b3f] text-white py-4 font-bold text-lg"
              >
                Save changes
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
function MenuButton({ active, icon, title, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-2xl px-5 py-2  ${
        active
          ? "bg-blue-800 border border-blue-500"
          : "bg-blue-950 border border-blue-900"
      }`}
    >
      <div className="flex items-center gap-5 text-left">
        <span className="text-3xl">{icon}</span>

        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>

          <p className="text-base text-gray-400">{text}</p>
        </div>
      </div>

      <span className="text-4xl leading-none text-black">›</span>
    </button>
  );
}

function SecurityCard({ title, value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-gray-200 px-5 py-5 flex items-center justify-between text-left hover:border-[#000b3f]"
    >
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        {value && <p className="text-[15px]">{value}</p>}
      </div>

      <span className="text-3xl font-light">›</span>
    </button>
  );
}

function MobileMenuButton({ active, icon, title, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-xl px-3 py-3 ${
        active
          ? "bg-blue-800 border border-blue-500"
          : "bg-blue-950 border border-blue-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>

        <span className="font-semibold text-white">{title}</span>
      </div>

      <span className="text-white">›</span>
    </button>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <h3 className="font-bold">{label}</h3>
      <p className="capitalize">{value}</p>
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`border border-gray-300 p-4 rounded-2xl outline-none focus:border-[#000b3f] ${className}`}
    />
  );
}

function Select({ name, value, onChange, options, placeholder }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 p-4 rounded-2xl capitalize outline-none focus:border-[#000b3f]"
    >
      <option value="">{placeholder}</option>

      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
