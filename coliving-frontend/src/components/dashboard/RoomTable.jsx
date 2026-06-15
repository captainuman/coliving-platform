import React, { useState } from "react";

const RoomTable = ({ data }) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filteredRooms = data?.filter((room) => {
    const text = `
      ${room.property}
      ${room.type}
      ${room.status}
      ${room.rent}
      ${room.deposit}
    `.toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    const matchesStatus = status === "all" || room.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Room Performance</h2>
          <p className="text-sm text-gray-500">
            Track rent, capacity, occupancy and room status
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="text-left p-4">Property</th>
              <th className="text-left p-4">Room Type</th>
              <th className="text-left p-4">Rent</th>
              <th className="text-left p-4">Deposit</th>
              <th className="text-left p-4">Capacity</th>
              <th className="text-left p-4">Occupied</th>
              <th className="text-left p-4">Occupancy</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredRooms?.map((room) => (
              <tr key={room.roomId} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">
                  {room.property}
                </td>

                <td className="p-4 capitalize">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                    {room.type}
                  </span>
                </td>

                <td className="p-4 font-semibold">₹{room.rent}</td>
                <td className="p-4">₹{room.deposit}</td>
                <td className="p-4">{room.capacity}</td>
                <td className="p-4">{room.occupied}</td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900 rounded-full"
                        style={{ width: `${room.occupancy}%` }}
                      />
                    </div>
                    <span>{room.occupancy}%</span>
                  </div>
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      room.status === "occupied"
                        ? "bg-green-50 text-green-700"
                        : room.status === "maintenance"
                        ? "bg-orange-50 text-orange-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {room.status}
                  </span>
                </td>
              </tr>
            ))}

            {filteredRooms?.length === 0 && (
              <tr>
                <td className="p-6 text-gray-500" colSpan="8">
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomTable;
