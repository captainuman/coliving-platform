import React, { useState } from "react";

const RecentBookings = ({ data }) => {
  const [status, setStatus] = useState("all");

  const filteredBookings =
    status === "all"
      ? data
      : data?.filter((booking) => booking.status === status);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Bookings</h2>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left p-3">Tenant</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Room Type</th>
              <th className="text-left p-3">Rent</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings?.map((booking) => (
              <tr key={booking._id} className="border-b">
                <td className="p-3 font-medium">{booking.user?.name}</td>
                <td className="p-3">{booking.user?.email}</td>
                <td className="p-3 capitalize">{booking.room?.type}</td>
                <td className="p-3">₹{booking.room?.rent}</td>
                <td className="p-3 capitalize">{booking.status}</td>
                <td className="p-3">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {filteredBookings?.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500" colSpan="6">
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