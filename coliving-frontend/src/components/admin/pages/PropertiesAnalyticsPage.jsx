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

const PropertiesAnalyticsPage = () => {
  const [properties, setProperties] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await adminAnalyticsApi.getProperties();
      setProperties(res.data);
    } catch (error) {
      console.error("Failed to load property analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  if (loading) return <p>Loading property analytics...</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Property Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Analyze approval status, location distribution, gender preference,
          amenities popularity, ratings, and reviews.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Property Approval Status</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={properties?.approvalStatus || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Properties by Gender Preference</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={properties?.genderPreference || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Properties by State</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={properties?.propertiesByState || []}
              xKey="_id"
              yKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Properties by District</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={properties?.propertiesByDistrict || []}
              xKey="_id"
              yKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Properties by Area</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={properties?.propertiesByArea || []}
              xKey="_id"
              yKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Amenities Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={properties?.amenitiesPopularity || []}
              xKey="_id"
              yKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Property Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[350px] items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold">
                  {Number(properties?.averageRating || 0).toFixed(1)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Based on {properties?.totalPropertyReviews || 0} reviews
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default PropertiesAnalyticsPage;