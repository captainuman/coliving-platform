import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#facc15", "#22c55e", "#ef4444"];

const BookingChart = ({ data = [] }) => {
  const chartData = data.filter((item) => Number(item.value) > 0);

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">
          Booking Status
        </h2>
        <p className="text-sm text-gray-500">
          Pending, approved and rejected bookings
        </p>
      </div>

      {chartData.length === 0 ? (
        <p className="text-sm text-gray-500">No booking data available yet.</p>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={55}
                paddingAngle={3}
                label
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default BookingChart;