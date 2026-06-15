import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const RatingChart = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      <h2 className="text-lg font-semibold mb-4">
        Rating Distribution
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="rating" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RatingChart;
