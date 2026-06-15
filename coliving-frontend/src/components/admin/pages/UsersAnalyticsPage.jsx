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

const UsersAnalyticsPage = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAnalyticsApi.getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load user analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <p>Loading user analytics...</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">User Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Analyze users by role, registration, verification, online status, city,
          gender, occupation, and preferences.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={users?.usersByRole || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Registrations by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={users?.registrationsByMonth || []}
              xKey="_id"
              yKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verified vs Unverified Users</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={users?.verifiedUsers || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Online vs Offline Users</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={users?.onlineUsers || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users by City</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={users?.usersByCity || []}
              xKey="_id"
              yKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users by Occupation</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={users?.usersByOccupation || []}
              xKey="_id"
              yKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users by Gender</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={users?.usersByGender || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Food Preference</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={users?.preferences?.food || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Smoking Preference</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={users?.preferences?.smoking || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cleanliness Preference</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={users?.preferences?.cleanliness || []} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default UsersAnalyticsPage;
