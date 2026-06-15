import React, { useState } from "react";

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const RecentBookings = ({ data }) => {
  const [status, setStatus] = useState("all");

  const filteredBookings =
    status === "all"
      ? data
      : data?.filter((booking) => booking.status === status);

  return (
    <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
          <p className="text-sm text-gray-500">
            Latest booking requests from tenants
          </p>
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="text-left p-4">Tenant</th>
              <th className="text-left p-4">Room</th>
              <th className="text-left p-4">Rent</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Booked On</th>
              <th className="text-left p-4">Expires</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings?.map((booking) => (
              <tr key={booking._id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-semibold text-gray-900">
                    {booking.user?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {booking.user?.email || "N/A"}
                  </p>
                </td>

                <td className="p-4 capitalize">
                  {booking.room?.type || "N/A"}
                </td>

                <td className="p-4 font-semibold">
                  ₹{booking.room?.rent || 0}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      booking.status === "approved"
                        ? "bg-green-50 text-green-700"
                        : booking.status === "rejected"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>

                <td className="p-4">{formatDate(booking.createdAt)}</td>

                <td className="p-4">{formatDate(booking.expiresAt)}</td>
              </tr>
            ))}

            {filteredBookings?.length === 0 && (
              <tr>
                <td className="p-6 text-gray-500" colSpan="6">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;
