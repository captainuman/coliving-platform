import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Pages
import HomePage from "./pages/Homepage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import GoogleSuccess from "./pages/GoogleSuccess";

import Properties from "./pages/Properties";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Inbox from "./pages/Inbox";
import TenantProfile from "./pages/tenent/TenantProfile";
import BookingHistory from "./pages/tenent/BookingHistory";
import Hotels from "./pages/Hotels";

// Owner
import Ownermanagement from "./pages/owner/Ownermanagement";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerRooms from "./pages/owner/OwnerRooms";
import OwnerTenants from "./pages/owner/OwnerTenants";
import OwnerDashboard from "./pages/owner/OwnerDashboard";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import OverviewPage from "./components/admin/pages/OverviewPage";
import UsersAnalyticsPage from "./components/admin/pages/UsersAnalyticsPage";
import PropertiesAnalyticsPage from "./components/admin/pages/PropertiesAnalyticsPage";
import RoomsAnalyticsPage from "./components/admin/pages/RoomsAnalyticsPage";
import BookingsAnalyticsPage from "./components/admin/pages/BookingsAnalyticsPage";
import ReviewsAnalyticsPage from "./components/admin/pages/ReviewsAnalyticsPage";
import FeedbackAnalyticsPage from "./components/admin/pages/FeedbackAnalyticsPage";
import TablesPage from "./components/admin/pages/TablesPage";
import AdminRoomRequests from "./pages/admin/AdminRoomRequests";

// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google-success" element={<GoogleSuccess />} />

        {/* TENANT */}
        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <Properties />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms/:propertyId"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <RoleProtectedRoute allowedRole="tenant">
              <Bookings />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:userId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking-history"
          element={
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tenant/:id"
          element={
            <ProtectedRoute>
              <TenantProfile />
            </ProtectedRoute>
          }
        />

        <Route path="/hotels" element={<Hotels />} />

        {/* OWNER */}
        <Route
          path="/owner-dashboard"
          element={
            <RoleProtectedRoute allowedRole="owner">
              <Ownermanagement />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/owner/bookings"
          element={
            <RoleProtectedRoute allowedRole="owner">
              <OwnerBookings />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/owner/rooms"
          element={
            <RoleProtectedRoute allowedRole="owner">
              <OwnerRooms />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/owner/tenants"
          element={
            <RoleProtectedRoute allowedRole="owner">
              <OwnerTenants />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/owner/dashboard"
          element={
            <RoleProtectedRoute allowedRole="owner">
              <OwnerDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/*"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout />
            </RoleProtectedRoute>
          }
        >
          <Route path="analytics" element={<OverviewPage />} />
          <Route path="analytics/users" element={<UsersAnalyticsPage />} />
          <Route
            path="analytics/properties"
            element={<PropertiesAnalyticsPage />}
          />
          <Route path="analytics/rooms" element={<RoomsAnalyticsPage />} />
          <Route
            path="analytics/bookings"
            element={<BookingsAnalyticsPage />}
          />
          <Route path="analytics/reviews" element={<ReviewsAnalyticsPage />} />
          <Route
            path="analytics/feedback"
            element={<FeedbackAnalyticsPage />}
          />
          <Route path="analytics/tables" element={<TablesPage />} />
        </Route>

        <Route
          path="/admin/roomrequests"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminRoomRequests />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
