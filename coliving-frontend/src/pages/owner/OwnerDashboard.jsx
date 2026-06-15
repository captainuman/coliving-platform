import React, { useEffect, useState } from "react";
import API from "../../services/api";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import KPICards from "../../components/dashboard/KPICards";
import OccupancyCard from "../../components/dashboard/OccupancyCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import BookingChart from "../../components/dashboard/BookingChart";
import PropertyTable from "../../components/dashboard/PropertyTable";
import RoomTable from "../../components/dashboard/RoomTable";
import TenantTable from "../../components/dashboard/TenantTable";
import RecentBookings from "../../components/dashboard/RecentBookings";
import Navbar from "@/components/Navbar";

const OwnerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const res = await API.get("/owner/dashboard/stats");
      setDashboard(res.data);
    } catch (error) {
      console.log(error.response?.data || error);
      setError("Failed to load owner dashboard");
    }
  };

  fetchDashboard();
}, []);


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="rounded-2xl border bg-white p-6 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-5">
          <div className="h-10 w-72 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-32 bg-gray-200 rounded-3xl" />
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <div className="p-4 md:p-8 space-y-8">
        
        <DashboardHeader dashboard={dashboard} />

        <KPICards kpis={dashboard.kpis} />  

        <OccupancyCard occupancyRate={dashboard.kpis.occupancyRate} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RevenueChart data={dashboard.charts.revenueByProperty} />
          <BookingChart data={dashboard.charts.bookingChart} />
        </div>

        <TenantTable data={dashboard.analytics.tenantAnalytics} />

        <RoomTable data={dashboard.analytics.roomAnalytics} />

        <PropertyTable data={dashboard.analytics.propertyAnalytics} />

        <RecentBookings data={dashboard.recentBookings} />
      </div>
    </div>
  );
};

export default OwnerDashboard;    
