import { useEffect, useState } from "react";
import { adminAnalyticsApi } from "../../../services/adminAnalyticsApi";
import AdminDataTable from "../AdminDataTable";

const TablesPage = () => {
  const [loading, setLoading] = useState(true);

  const [usersTable, setUsersTable] = useState([]);
  const [propertiesTable, setPropertiesTable] = useState([]);
  const [roomsTable, setRoomsTable] = useState([]);
  const [bookingsTable, setBookingsTable] = useState([]);
  const [reviewsTable, setReviewsTable] = useState([]);
  const [feedbackTable, setFeedbackTable] = useState([]);

  const loadTables = async () => {
    try {
      setLoading(true);

      const [
        usersRes,
        propertiesRes,
        roomsRes,
        bookingsRes,
        reviewsRes,
        feedbackRes,
      ] = await Promise.all([
        adminAnalyticsApi.getUsersTable(),
        adminAnalyticsApi.getPropertiesTable(),
        adminAnalyticsApi.getRoomsTable(),
        adminAnalyticsApi.getBookingsTable(),
        adminAnalyticsApi.getReviewsTable(),
        adminAnalyticsApi.getFeedbackTable(),
      ]);

      setUsersTable(usersRes.data);
      setPropertiesTable(propertiesRes.data);
      setRoomsTable(roomsRes.data);
      setBookingsTable(bookingsRes.data);
      setReviewsTable(reviewsRes.data);
      setFeedbackTable(feedbackRes.data);
    } catch (error) {
      console.error("Failed to load admin tables:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  if (loading) return <p>Loading tables...</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Admin Tables</h2>
        <p className="text-sm text-muted-foreground">
          Search, sort, paginate, and export platform data.
        </p>
      </div>

      <AdminDataTable
        title="Users"
        data={usersTable}
        searchableFields={["name", "email", "role", "city", "gender", "occupation"]}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "city", label: "City" },
          { key: "gender", label: "Gender" },
          { key: "occupation", label: "Occupation" },
          {
            key: "isVerified",
            label: "Verified",
            render: (row) => (row.isVerified ? "Yes" : "No"),
          },
          {
            key: "isOnline",
            label: "Online",
            render: (row) => (row.isOnline ? "Online" : "Offline"),
          },
          {
            key: "createdAt",
            label: "Joined",
            render: (row) => new Date(row.createdAt).toLocaleDateString(),
          },
        ]}
      />

      <AdminDataTable
        title="Properties"
        data={propertiesTable}
        searchableFields={[
          "title",
          "owner.name",
          "owner.email",
          "address.area",
          "address.district",
          "address.state",
          "genderPreference",
        ]}
        columns={[
          { key: "title", label: "Title" },
          {
            key: "owner.name",
            label: "Owner",
            render: (row) => row.owner?.name || "-",
          },
          {
            key: "address.area",
            label: "Area",
            render: (row) => row.address?.area || "-",
          },
          {
            key: "address.district",
            label: "District",
            render: (row) => row.address?.district || "-",
          },
          {
            key: "address.state",
            label: "State",
            render: (row) => row.address?.state || "-",
          },
          { key: "genderPreference", label: "Gender Preference" },
          {
            key: "isApproved",
            label: "Approved",
            render: (row) => (row.isApproved ? "Yes" : "No"),
          },
          {
            key: "rating",
            label: "Rating",
            render: (row) => Number(row.rating || 0).toFixed(1),
          },
          { key: "reviewCount", label: "Reviews" },
        ]}
      />

      <AdminDataTable
        title="Rooms"
        data={roomsTable}
        searchableFields={[
          "type",
          "status",
          "genderPreference",
          "property.title",
          "property.address.area",
          "property.address.district",
        ]}
        columns={[
          {
            key: "property.title",
            label: "Property",
            render: (row) => row.property?.title || "-",
          },
          { key: "type", label: "Type" },
          { key: "status", label: "Status" },
          { key: "rent", label: "Rent" },
          { key: "deposit", label: "Deposit" },
          { key: "capacity", label: "Capacity" },
          {
            key: "currentTenants",
            label: "Tenants",
            render: (row) => row.currentTenants?.length || 0,
          },
          {
            key: "utilization",
            label: "Utilization",
            render: (row) => {
              const used = row.currentTenants?.length || 0;
              const capacity = row.capacity || 0;
              return capacity > 0 ? `${Math.round((used / capacity) * 100)}%` : "0%";
            },
          },
        ]}
      />

      <AdminDataTable
        title="Bookings"
        data={bookingsTable}
        searchableFields={[
          "user.name",
          "user.email",
          "status",
          "room.type",
          "room.property.title",
        ]}
        columns={[
          {
            key: "user.name",
            label: "User",
            render: (row) => row.user?.name || "-",
          },
          {
            key: "user.email",
            label: "Email",
            render: (row) => row.user?.email || "-",
          },
          {
            key: "room.property.title",
            label: "Property",
            render: (row) => row.room?.property?.title || "-",
          },
          {
            key: "room.type",
            label: "Room Type",
            render: (row) => row.room?.type || "-",
          },
          { key: "status", label: "Status" },
          {
            key: "expiresAt",
            label: "Expires",
            render: (row) =>
              row.expiresAt ? new Date(row.expiresAt).toLocaleDateString() : "-",
          },
        ]}
      />

      <AdminDataTable
        title="Reviews"
        data={reviewsTable}
        searchableFields={["tenant.name", "tenant.email", "property.title", "comment"]}
        columns={[
          {
            key: "tenant.name",
            label: "Tenant",
            render: (row) => row.tenant?.name || "-",
          },
          {
            key: "property.title",
            label: "Property",
            render: (row) => row.property?.title || "-",
          },
          {
            key: "rating",
            label: "Rating",
            render: (row) => `${row.rating || 0}/5`,
          },
          {
            key: "comment",
            label: "Comment",
            render: (row) => row.comment || "-",
          },
        ]}
      />

      <AdminDataTable
        title="Feedback"
        data={feedbackTable}
        searchableFields={["user.name", "user.email", "user.role", "message"]}
        columns={[
          {
            key: "user.name",
            label: "User",
            render: (row) => row.user?.name || "-",
          },
          {
            key: "user.email",
            label: "Email",
            render: (row) => row.user?.email || "-",
          },
          {
            key: "user.role",
            label: "Role",
            render: (row) => row.user?.role || "-",
          },
          {
            key: "message",
            label: "Message",
            render: (row) => row.message || "-",
          },
        ]}
      />
    </div>
  );
};

export default TablesPage;