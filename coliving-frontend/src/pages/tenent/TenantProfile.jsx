import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function TenantProfile() {
  const { id } = useParams();
  const [tenant, setTenant] = useState(null);

  const API_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "https://coliving-backend.onrender.com";

  useEffect(() => {
    fetchTenant();
  }, [id]);

  const fetchTenant = async () => {
    try {
      const res = await API.get(`/users/${id}`);
      setTenant(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const profileImage = tenant?.profilePic
    ? tenant.profilePic.startsWith("/uploads")
      ? `${API_URL}${tenant.profilePic}`
      : `${API_URL}/uploads/${tenant.profilePic}`
    : `https://ui-avatars.com/api/?name=${tenant?.name}&background=111827&color=fff`;

  const infoItems = [
    ["Date of Birth", tenant?.dob ? new Date(tenant.dob).toLocaleDateString() : "Not set"],
    ["Gender", tenant?.gender || "Not set"],
    ["Smoking", tenant?.smoking || "Not set"],
    ["Sleep Habit", tenant?.sleep || "Not set"],
    ["Food Preference", tenant?.food || "Not set"],
    ["Cleanliness", tenant?.cleanliness || "Not set"],
    ["City", tenant?.city || "Not set"],
    ["Country", tenant?.country || "Not set"],
    ["Language", tenant?.language || "Not set"],
  ];

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="bg-white px-8 py-5 rounded-3xl shadow-xl text-lg font-semibold">
          Loading Profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <section className="bg-white rounded-3xl sm:rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="relative bg-gradient-to-r from-gray-950 via-gray-900 to-black h-56 sm:h-64">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_35%)]" />

            <div className="absolute left-1/2 sm:left-10 -bottom-24 sm:-bottom-16 -translate-x-1/2 sm:translate-x-0 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 w-full px-4 sm:px-0">
              <img
                src={profileImage}
                alt="profile"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-2xl bg-white"
              />

              <div className="text-center sm:text-left sm:mb-7">
                <h1 className="text-3xl sm:text-5xl font-black text-white drop-shadow">
                  {tenant.name}
                </h1>
                <p className="text-sm sm:text-lg text-gray-300 mt-1 break-all">
                  {tenant.email}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-32 sm:pt-24 px-4 sm:px-8 lg:px-10 pb-8 sm:pb-10">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                Tenant Details
              </h2>
              <p className="text-gray-500 mt-1">
                Personal and lifestyle information
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {infoItems.map(([label, value]) => (
                <div
                  key={label}
                  className="group bg-slate-50 hover:bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition"
                >
                  <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {label}
                  </p>
                  <p className="text-lg sm:text-xl font-black text-gray-900 capitalize break-words">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}