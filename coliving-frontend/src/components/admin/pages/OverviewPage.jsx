import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Building2,
  BedDouble,
  CalendarCheck,
  Star,
  MessageSquare,
  Activity,
} from "lucide-react";

import KpiCard from "../KpiCard";
import { adminAnalyticsApi } from "../../../services/adminAnalyticsApi";

const OverviewPage = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await adminAnalyticsApi.getOverview();
      setOverview(res.data);
    } catch (error) {
      console.error("Failed to load overview:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  if (loading) return <p>Loading overview...</p>;

  const kpis = [
    { title: "Total Users", value: overview?.totalUsers, icon: <Users size={22} /> },
    { title: "Total Tenants", value: overview?.totalTenants, icon: <Users size={22} /> },
    { title: "Total Owners", value: overview?.totalOwners, icon: <UserCheck size={22} /> },
    { title: "Total Properties", value: overview?.totalProperties, icon: <Building2 size={22} /> },
    { title: "Approved Properties", value: overview?.approvedProperties, icon: <Building2 size={22} /> },
    { title: "Pending Properties", value: overview?.pendingProperties, icon: <Building2 size={22} /> },
    { title: "Total Rooms", value: overview?.totalRooms, icon: <BedDouble size={22} /> },
    { title: "Available Rooms", value: overview?.availableRooms, icon: <BedDouble size={22} /> },
    { title: "Occupied Rooms", value: overview?.occupiedRooms, icon: <BedDouble size={22} /> },
    { title: "Maintenance Rooms", value: overview?.maintenanceRooms, icon: <Activity size={22} /> },
    { title: "Total Bookings", value: overview?.totalBookings, icon: <CalendarCheck size={22} /> },
    { title: "Pending Bookings", value: overview?.pendingBookings, icon: <CalendarCheck size={22} /> },
    { title: "Approved Bookings", value: overview?.approvedBookings, icon: <CalendarCheck size={22} /> },
    { title: "Rejected Bookings", value: overview?.rejectedBookings, icon: <CalendarCheck size={22} /> },
    {
      title: "Average Rating",
      value: Number(overview?.averagePropertyRating || 0).toFixed(1),
      icon: <Star size={22} />,
    },
    { title: "Total Reviews", value: overview?.totalReviews, icon: <Star size={22} /> },
    { title: "Feedback Messages", value: overview?.totalFeedbackMessages, icon: <MessageSquare size={22} /> },
    { title: "Active Online Users", value: overview?.activeOnlineUsers, icon: <Activity size={22} /> },
    {
      title: "Booking Conversion",
      value: `${overview?.bookingConversionRate || 0}%`,
      subtitle: "Approved bookings / total bookings",
      icon: <CalendarCheck size={22} />,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Platform-wide KPI summary.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </section>
    </div>
  );
};

export default OverviewPage;