import { useEffect, useState } from "react";

import { adminAnalyticsApi } from "../../../services/adminAnalyticsApi";
import { AnalyticsBarChart } from "../AnalyticsCharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

const ReviewsAnalyticsPage = () => {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await adminAnalyticsApi.getReviews();
      setReviews(res.data);
    } catch (error) {
      console.error("Failed to load review analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  if (loading) return <p>Loading review analytics...</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Review Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Analyze rating distribution, average rating, most reviewed properties,
          recent reviews, and low-rated properties.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={reviews?.ratingDistribution || []}
              xKey="_id"
              yKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Review Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[350px] items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold">
                  {Number(reviews?.averageRating || 0).toFixed(1)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Overall platform review rating
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Reviewed Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={(reviews?.mostReviewedProperties || []).map((item) => ({
                _id: item.title || "Unknown",
                count: item.reviewCount || 0,
              }))}
              xKey="_id"
              yKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Rated Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={(reviews?.lowRatedProperties || []).map((item) => ({
                _id: item.title || "Unknown",
                averageRating: Number(item.averageRating || 0).toFixed(1),
              }))}
              xKey="_id"
              yKey="averageRating"
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ReviewsAnalyticsPage;