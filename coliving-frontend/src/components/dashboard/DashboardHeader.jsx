import React from "react";

const DashboardHeader = ({ dashboard }) => {
  const convertToCSV = (rows) => {
    if (!rows || rows.length === 0) return "";

    const headers = Object.keys(rows[0]);

    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        headers.map((header) => `"${row[header] ?? ""}"`).join(",")
      ),
    ];

    return csvRows.join("\n");
  };

  const exportCSV = () => {
    const sections = [
      { name: "kpis", data: [dashboard.kpis] },
      { name: "properties", data: dashboard.analytics.propertyAnalytics },
      { name: "rooms", data: dashboard.analytics.roomAnalytics },
      { name: "tenants", data: dashboard.analytics.tenantAnalytics },
    ];

    sections.forEach((section) => {
      const csv = convertToCSV(section.data);
      if (!csv) return;

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `owner-dashboard-${section.name}.csv`;
      link.click();

      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="rounded-3xl bg-linear-to-r from-gray-900 to-gray-700 p-6 md:p-8 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <p className="text-sm text-gray-300">Coliving Owner Panel</p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Owner Analytics Dashboard
          </h1>

          <p className="text-gray-300 mt-2 max-w-2xl">
            Track occupancy, tenants, revenue, bookings, rooms and property
            performance from one place.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="bg-white text-gray-900 px-5 py-3 rounded-2xl font-semibold shadow hover:bg-gray-100 transition"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;