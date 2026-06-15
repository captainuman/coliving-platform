import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const RevenueChart = ({ data = [] }) => {
  const chartData = data.filter((item) => Number(item.revenue) > 0);

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">
          Revenue by Property
        </h2>
        <p className="text-sm text-gray-500">
          Expected monthly revenue from occupied rooms
        </p>
      </div>

      {chartData.length === 0 ? (
        <p className="text-sm text-gray-500">No revenue data available yet.</p>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="property" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill="#111827" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;