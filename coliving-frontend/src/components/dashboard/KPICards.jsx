import React from "react";

const KPICards = ({ kpis }) => {
  const cards = [
    ["Properties", kpis.totalProperties, "Total listed properties"],
    ["Rooms", kpis.totalCapacity, "Total rooms managed"],
    ["Occupancy", `${kpis.occupancyRate}%`, "Current occupancy rate"],
    ["Revenue", `₹${kpis.expectedMonthlyRevenue}`, "Expected monthly revenue"],
    ["Available", kpis.availableRooms, "Rooms available"],
    ["Occupied", kpis.occupiedRooms, "Rooms occupied"],
    ["Bookings", kpis.totalBookings, "Total booking requests"],
    ["Reviews", kpis.totalReviews, "Total tenant reviews"],
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map(([title, value, desc]) => (
        <div
          key={title}
          className="rounded-3xl border bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-3xl font-bold mt-2 text-gray-900">{value}</h2>
          <p className="text-xs text-gray-400 mt-2">{desc}</p>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
