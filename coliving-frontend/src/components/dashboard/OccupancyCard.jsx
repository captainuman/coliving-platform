import React from "react";

const OccupancyCard = ({ occupancyRate }) => {
  const safeRate = Math.min(Number(occupancyRate || 0), 100);

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Occupancy Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Percentage of occupied beds across your properties
          </p>
        </div>

        <div className="text-4xl font-bold text-gray-900">
          {safeRate}%
        </div>
      </div>

      <div className="mt-6 h-4 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-linear-to-r from-green-500 to-emerald-600 transition-all"
          style={{ width: `${safeRate}%` }}
        />
      </div>

      <div className="mt-4 flex justify-between text-xs text-gray-400">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default OccupancyCard;