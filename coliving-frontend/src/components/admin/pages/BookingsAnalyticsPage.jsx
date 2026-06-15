import { useEffect, useState } from "react";

import { adminAnalyticsApi } from "../../../services/adminAnalyticsApi";
import {
  AnalyticsPieChart,
  AnalyticsBarChart,
} from "../AnalyticsCharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

const BookingsAnalyticsPage = () => {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await adminAnalyticsApi.getBookings();
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to load booking analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  if (loading) return <p>Loading booking analytics...</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Booking Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Analyze booking status, trends, hidden bookings, expiring bookings, and conversion rate.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bookings by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={bookings?.bookingsByStatus || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Trends by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={bookings?.bookingTrendsByMonth || []}
              xKey="_id"
              yKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Trends by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={bookings?.bookingTrendsByDay || []}
              xKey="_id"
              yKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hidden Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={[
                {
                  _id: "Hidden for User",
                  count: bookings?.hiddenBookings?.hiddenForUser || 0,
                },
                {
                  _id: "Hidden for Owner",
                  count: bookings?.hiddenBookings?.hiddenForOwner || 0,
                },
              ]}
              xKey="_id"
              yKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[350px] items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold">
                  {bookings?.conversionRate || 0}%
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Approved bookings / total bookings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default BookingsAnalyticsPage;