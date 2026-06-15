import React, { useState } from "react";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const TenantTable = ({ data }) => {
  const [search, setSearch] = useState("");

  const filteredTenants = data?.filter((tenant) => {
    const text = `
      ${tenant.name}
      ${tenant.email}
      ${tenant.mobile}
      ${tenant.property}
      ${tenant.roomType}
      ${tenant.occupation}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tenant Analytics</h2>
          <p className="text-sm text-gray-500">
            Active tenants, stay period and room details
          </p>
        </div>

        <input
          type="text"
          placeholder="Search tenant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="text-left p-4">Tenant</th>
              <th className="text-left p-4">Property</th>
              <th className="text-left p-4">Room</th>
              <th className="text-left p-4">Rent</th>
              <th className="text-left p-4">Joined</th>
              <th className="text-left p-4">Leave Date</th>
              <th className="text-left p-4">Verified</th>
            </tr>
          </thead>

          <tbody>
            {filteredTenants?.map((tenant) => (
              <tr key={`${tenant.tenantId}-${tenant.roomId}`} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-semibold text-gray-900">{tenant.name}</p>
                  <p className="text-xs text-gray-500">{tenant.email}</p>
                  <p className="text-xs text-gray-400">{tenant.mobile || "N/A"}</p>
                </td>

                <td className="p-4 font-medium">{tenant.property}</td>

                <td className="p-4 capitalize">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                    {tenant.roomType}
                  </span>
                </td>

                <td className="p-4 font-semibold">₹{tenant.rent}</td>

                <td className="p-4">{formatDate(tenant.joinedDate)}</td>

                <td className="p-4">{formatDate(tenant.leaveDate)}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tenant.isVerified
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {tenant.isVerified ? "Verified" : "Unverified"}
                  </span>
                </td>
              </tr>
            ))}

            {filteredTenants?.length === 0 && (
              <tr>
                <td className="p-6 text-gray-500" colSpan="7">
                  No tenants found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenantTable;