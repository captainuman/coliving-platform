import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const BACKEND_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "https://coliving-backend.onrender.com";

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my");
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "expired":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const approvedCount = bookings.filter((b) => b.status === "approved").length;

  const filters = [
    {
      key: "all",
      label: `All (${bookings.length})`,
      activeClass: "bg-black text-white",
    },
    {
      key: "pending",
      label: `Pending (${pendingCount})`,
      activeClass: "bg-yellow-500 text-white",
    },
    {
      key: "approved",
      label: `Approved (${approvedCount})`,
      activeClass: "bg-green-600 text-white",
    },
  ];

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    try {
      await API.delete(`/bookings/${bookingId}`);

      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId),
      );

      toast.success("Booking deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete booking");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8">
          My Bookings
        </h1>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {filters.map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`whitespace-nowrap px-5 py-2 rounded-xl font-medium ${
                filter === item.key ? item.activeClass : "bg-white border"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center">
            No {filter} bookings found
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-3xl shadow-md overflow-hidden"
              >
                {booking.room?.images?.length > 0 && (
                  <img
                    src={
                      booking.room.images[0].startsWith("/uploads")
                        ? `${BACKEND_URL}${booking.room.images[0]}`
                        : `${BACKEND_URL}/uploads/rooms/${booking.room.images[0]}`
                    }
                    alt="room"
                    className="w-full h-40 object-cover"
                  />
                )}

                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
                    {console.log(booking.user)}
                    <img
                      src={
                        booking.user?.profilePic
                          ? booking.user.profilePic.startsWith("/uploads")
                            ? `${BACKEND_URL}${booking.user.profilePic}`
                            : `${BACKEND_URL}/uploads/${booking.user.profilePic}`
                          : "/default-user.png"
                      }
                      alt={booking.user?.name || "User"}
                      className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover"
                    />

                    <div>
                      <h2 className="font-bold text-xl">
                        {booking.user?.name}
                      </h2>

                      <p className="text-gray-500 text-xs sm:text-sm break-all">
                        {booking.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <h3 className="font-bold mb-2">🏠 Property Details</h3>

                    <p>{booking.room?.property?.title}</p>

                    <p className="text-gray-600 text-sm">
                      📍 {booking.room?.property?.address?.area},{" "}
                      {booking.room?.property?.address?.district},{" "}
                      {booking.room?.property?.address?.state},{" "}
                      {booking.room?.property?.address?.pincode}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h3 className="font-bold mb-3">🛏 Room Details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <p>
                        Type:{" "}
                        <span className="font-medium capitalize">
                          {booking.room?.type}
                        </span>
                      </p>

                      <p>
                        Capacity:{" "}
                        <span className="font-medium">
                          {booking.room?.capacity}
                        </span>
                      </p>

                      <p>
                        Rent:{" "}
                        <span className="font-medium">
                          ₹{booking.room?.rent}
                        </span>
                      </p>

                      <p>
                        Deposit:{" "}
                        <span className="font-medium">
                          ₹{booking.room?.deposit}
                        </span>
                      </p>

                      <p>
                        Gender:{" "}
                        <span className="font-medium capitalize">
                          {booking.room?.genderPreference}
                        </span>
                      </p>

                      <p>
                        Status:{" "}
                        <span className="font-medium capitalize">
                          {booking.room?.status || "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm">
                    Requested on{" "}
                    {booking.createdAt
                      ? new Date(booking.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
                    >
                      Delete Booking
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/rooms/${booking.room?.property?._id}`)
                      }
                      className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl"
                    >
                      View Room
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
