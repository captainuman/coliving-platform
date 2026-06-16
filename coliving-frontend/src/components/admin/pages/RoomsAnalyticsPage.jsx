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

const RoomsAnalyticsPage = () => {
  const [rooms, setRooms] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const res = await adminAnalyticsApi.getRooms();
      setRooms(res.data);
    } catch (error) {
      console.error("Failed to load room analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  if (loading) return <p>Loading room analytics...</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Room Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Analyze room type, status, gender preference, utilization, rent, and deposit.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rooms by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={rooms?.roomsByType || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rooms by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={rooms?.roomsByStatus || []}
              xKey="_id"
              yKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Gender Preference</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={rooms?.genderPreference || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Rent by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={(rooms?.rentByLocation || []).map((item) => ({
                location: `${item._id?.area || ""}, ${item._id?.district || ""}`,
                averageRent: Math.round(item.averageRent || 0),
              }))}
              xKey="location"
              yKey="averageRent"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Rent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-87.65 items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold">
                  ₹{Math.round(rooms?.rentStats?.averageRent || 0)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Min ₹{rooms?.rentStats?.minRent || 0} / Max ₹{rooms?.rentStats?.maxRent || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-87.5 items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold">
                  ₹{Math.round(rooms?.rentStats?.averageDeposit || 0)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Average room security deposit
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default RoomsAnalyticsPage;
