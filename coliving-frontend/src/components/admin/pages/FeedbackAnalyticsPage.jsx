import { useEffect, useState } from "react";

import { adminAnalyticsApi } from "../../../services/adminAnalyticsApi";
import { AnalyticsBarChart } from "../AnalyticsCharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

const FeedbackAnalyticsPage = () => {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const res = await adminAnalyticsApi.getFeedback();
      setFeedback(res.data);
    } catch (error) {
      console.error("Failed to load feedback analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  if (loading) return <p>Loading feedback analytics...</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Feedback Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Analyze total feedback messages, recent feedback, and feedback volume by date.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Feedback Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[350px] items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold">
                  {feedback?.totalFeedback || 0}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Messages submitted by users
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback Volume by Date</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={feedback?.feedbackByDate || []}
              xKey="_id"
              yKey="count"
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default FeedbackAnalyticsPage;   
