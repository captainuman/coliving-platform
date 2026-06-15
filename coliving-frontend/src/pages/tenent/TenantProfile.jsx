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
  }, []);

  const fetchTenant = async () => {
    try {
      const res = await API.get(`/users/${id}`);
      setTenant(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white px-10 py-6 rounded-3xl shadow-lg text-xl font-semibold">
          Loading Profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 lg:p-10">
        {/* PROFILE CARD */}

        <div className="bg-white rounded-[35px] shadow-xl overflow-hidden">
          {/* TOP BANNER */}

          <div className="h-52 bg-black relative">
            <div className="absolute -bottom-16 left-10 flex items-end gap-6">
              <img
                src={
                  tenant.profilePic
                    ? tenant.profilePic.startsWith("/uploads")
                      ? `${API_URL}${tenant.profilePic}`
                      : `${API_URL}/uploads/${tenant.profilePic}`
                    : `https://ui-avatars.com/api/?name=${tenant.name}`
                }
                alt="profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl"
              />

              <div className="mb-8 text-white">
                <h1 className="text-4xl font-black">{tenant.name}</h1>

                <p className="text-black text-2xl mt-1">{tenant.email}</p>
              </div>
            </div>
          </div>

          {/* DETAILS SECTION */}

          <div className="pt-24 p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* DOB */}

              <div className="bg-gray-50 hover:bg-gray-100 transition p-6 rounded-3xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Date of Birth</p>

                <p className="text-xl font-bold">
                  {tenant.dob
                    ? new Date(tenant.dob).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>

              {/* GENDER */}

              <div className="bg-gray-50 hover:bg-gray-100 transition p-6 rounded-3xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Gender</p>

                <p className="text-xl font-bold capitalize">
                  {tenant.gender || "Not set"}
                </p>
              </div>

              {/* SMOKING */}

              <div className="bg-gray-50 hover:bg-gray-100 transition p-6 rounded-3xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Smoking</p>

                <p className="text-xl font-bold capitalize">
                  {tenant.smoking || "Not set"}
                </p>
              </div>

              {/* SLEEP */}

              <div className="bg-gray-50 hover:bg-gray-100 transition p-6 rounded-3xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Sleep Habit</p>

                <p className="text-xl font-bold capitalize">
                  {tenant.sleep || "Not set"}
                </p>
              </div>

              {/* FOOD */}

              <div className="bg-gray-50 hover:bg-gray-100 transition p-6 rounded-3xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Food Preference</p>

                <p className="text-xl font-bold capitalize">
                  {tenant.food || "Not set"}
                </p>
              </div>

              {/* CLEANLINESS */}

              <div className="bg-gray-50 hover:bg-gray-100 transition p-6 rounded-3xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Cleanliness</p>

                <p className="text-xl font-bold capitalize">
                  {tenant.cleanliness || "Not set"}
                </p>
              </div>

              {/* CITY */}

              <div className="bg-gray-50 hover:bg-gray-100 transition p-6 rounded-3xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">City</p>

                <p className="text-xl font-bold">{tenant.city || "Not set"}</p>
              </div>

              {/* COUNTRY */}

              <div className="bg-gray-50 hover:bg-gray-100 transition p-6 rounded-3xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Country</p>

                <p className="text-xl font-bold">
                  {tenant.country || "Not set"}
                </p>
              </div>

              {/* LANGUAGE */}

              <div className="bg-gray-50 hover:bg-gray-100 transition p-6 rounded-3xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Language</p>

                <p className="text-xl font-bold">
                  {tenant.language || "Not set"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
