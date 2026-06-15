import React, { useState } from "react";

const PropertyTable = ({ data }) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filteredProperties = data?.filter((property) => {
    const matchesSearch = property.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      status === "all" ||
      (status === "approved" && property.approved) ||
      (status === "pending" && !property.approved);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Property Performance</h2>
          <p className="text-sm text-gray-500">
            Overview of your listed properties
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search properties..."
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
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="text-left p-4">Property</th>
              <th className="text-left p-4">Rating</th>
              <th className="text-left p-4">Reviews</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredProperties?.map((property) => (
              <tr key={property.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-semibold text-gray-900">
                  {property.title}
                </td>

                <td className="p-4">
                  <span className="font-medium">⭐ {property.rating || 0}</span>
                </td>

                <td className="p-4">{property.reviews || 0}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      property.approved
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {property.approved ? "Approved" : "Pending"}
                  </span>
                </td>
              </tr>
))}

            {filteredProperties?.length === 0 && (
              <tr>
                <td className="p-6 text-gray-500" colSpan="4">
                  No properties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyTable;
