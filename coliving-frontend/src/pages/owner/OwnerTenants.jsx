import { useEffect, useState } from "react";
import API from "../../services/api"  
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

export default function OwnerTenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTenants = async () => {
    try {
      const res = await API.get("/owner/tenants");
      setTenants(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tenants");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTenant = async (bookingId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this tenant?"
    );

    if (!confirmRemove) return;

    try {
      await API.delete(`/owner/tenants/${bookingId}`);

      setTenants((prev) =>
        prev.filter(
          (tenant) => tenant._id !== bookingId
        )
      );

      toast.success("Tenant removed successfully");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to remove tenant"
      );
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

if (loading) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-medium">
          Loading tenants...
        </p>
      </div>
    </>
  );
}
  return (
    <div className="max-w-7xl mx-auto p-6">
      <Navbar/>

      <div className="mb-6 mt-6">
        <h1 className="text-3xl font-bold">
          Tenant Management
        </h1>

        <p className="text-gray-500 mt-1">
          Manage tenants across all your properties
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        {tenants.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No active tenants found.
          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>
                  <th className="p-4 text-left">
                    Tenant
                  </th>

                  <th className="p-4 text-left">
                    Property
                  </th>

                  <th className="p-4 text-left">
                    Room Type
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Joined
                  </th>

                  <th className="p-4 text-left">
                    Action
                  </th>
                </tr>

              </thead>

              <tbody>

                {tenants.map((booking) => (

                  <tr
                    key={booking._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4">
                      <div>
                        <p className="font-semibold">
                          {booking.user?.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.user?.email}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      {booking.room?.property?.title}
                    </td>

                    <td className="p-4 capitalize">
                      {booking.room?.type}
                    </td>

                    <td className="p-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Approved
                      </span>
                    </td>

                    <td className="p-4">
                      {new Date(
                        booking.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4">

                      <button
                        onClick={() =>
                          handleRemoveTenant(
                            booking._id
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Remove Tenant
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}
