import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import API from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get("/bookings/owner");
      console.log(res.data);
      setBookings(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load bookings");
    }
    finally {
      setLoading(false);
    }
  };

  const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/bookings/${id}`, {
        status,
      });

      toast.success(
        `Request ${status}`
      );

      fetchBookings();
    } catch (err) {
      toast.error("Failed to update booking");
    }
  };

  const getTimeLeft = (expiresAt) => {
    const diff =
      new Date(expiresAt) -
      new Date();

    if (diff <= 0)
      return "Expired";

    const days = Math.floor(
      diff / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) /
      (1000 * 60 * 60)
    );

    return `${days}d ${hours}h`;
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

  switch (filter) {

    case "pending":
      return booking.status === "pending";

    case "approved":
      return booking.status === "approved";

    case "history":
      return [
        "approved",
        "rejected",
        "expired"
      ].includes(booking.status);

    default:
      return true;
  }

});


  const pendingCount = bookings.filter(
    (b) => b.status === "pending"
  ).length;

  const approvedCount = bookings.filter(
    (b) => b.status === "approved"
  ).length;

  const historyCount = bookings.filter(
    (b) =>
      b.status === "approved" ||
      b.status === "expired" ||
      b.status === "rejected"
  ).length;

  const startChat = async (receiverId) => {
  try {
    const res = await API.post("/conversations", {
      receiverId
    });

    navigate("/inbox", {
      state: {
        conversation: res.data
      }
    });
  } catch (err) {
    console.error(err);
    toast.error("Unable to start chat");
  }
};


const handleDeleteBooking = async (bookingId) => {
  if (!window.confirm("Are you sure you want to delete this booking?")) {
    return;
  }

  try {
    await API.delete(`/bookings/owner/${bookingId}`);

    setBookings((prev) =>
      prev.filter((booking) => booking._id !== bookingId)
    );

    toast.success("Booking deleted successfully");
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Failed to delete booking"
    );
  }
};
if (loading) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        Loading bookings...
      </div>
    </>
  );
}

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">
          Booking Requests
        </h1>

        <div className="flex flex-wrap gap-3 mb-8">

  <button
    onClick={() => setFilter("all")}
    className={`px-5 py-2 rounded-xl font-medium ${
      filter === "all"
        ? "bg-black text-white"
        : "bg-white border"
    }`}
  >
    All ({bookings.length})
  </button>

  <button
    onClick={() => setFilter("pending")}
    className={`px-5 py-2 rounded-xl font-medium ${
      filter === "pending"
        ? "bg-yellow-500 text-white"
        : "bg-white border"
    }`}
  >
    Pending ({pendingCount})
  </button>

  <button
    onClick={() => setFilter("approved")}
    className={`px-5 py-2 rounded-xl font-medium ${
      filter === "approved"
        ? "bg-green-600 text-white"
        : "bg-white border"
    }`}
  >
    Approved ({approvedCount})
  </button>

  <button
    onClick={() => setFilter("history")}
    className={`px-5 py-2 rounded-xl font-medium ${
      filter === "history"
        ? "bg-gray-800 text-white"
        : "bg-white border"
    }`}
  >
    History ({historyCount})
  </button>

</div>

        {filteredBookings.length === 0 ? ( 
          
          <div className="bg-white rounded-3xl p-10 text-center">
            {filter === "history"
              ? "No booking history found"
              : `No ${filter} bookings found`}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">

            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-3xl shadow-md overflow-hidden"
              >

                {/* ROOM IMAGE */}
                <img
                  src={
                    booking.room?.images?.length > 0
                      ? booking.room.images[0].startsWith("/uploads")
                        ? `${BACKEND_URL}${booking.room.images[0]}`
                        : `${BACKEND_URL}/uploads/rooms/${booking.room.images[0]}`
                      : "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
                  }
                  alt="room"
                  className="w-full h-40 object-cover"
                />

                <div className="p-6">

                  {/* HEADER */}
                  <div className="flex justify-between items-start mb-5">

                    <div className="flex items-center gap-4">

                     <img
                        src={
                          booking.user?.profilePic
                            ? booking.user.profilePic.startsWith("/uploads")
                              ? `${BACKEND_URL}${booking.user.profilePic}`
                              : `${BACKEND_URL}/uploads/${booking.user.profilePic}`
                            : "/default-user.png"
                        }
                        alt="User"
                        className="w-20 h-20 rounded-full object-cover"
                      />

                      <div>
                        <h2 className="font-bold text-xl">
                          {booking.user?.name}
                        </h2>

                        <p className="text-gray-500 text-sm">
                          {booking.user?.email}
                        </p>
                      </div>

                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                  </div>

                  {/* PROPERTY DETAILS */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-4">

                    <h3 className="font-bold mb-2">
                      🏠 Property Details
                      
                    </h3>

                    <p>
                      {booking.room?.property?.title}
                    </p>

                    <p className="text-gray-600 text-sm">
                      📍 {[
                            booking.room?.property?.address?.streetAddress,
                            booking.room?.property?.address?.area,
                            booking.room?.property?.address?.district,
                            booking.room?.property?.address?.state,
                            booking.room?.property?.address?.pincode
                          ]
                            .filter(Boolean)
                            .join(", ")}
                    </p>

                  </div>

                  {/* ROOM DETAILS */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">

                    <h3 className="font-bold mb-3">
                      🛏 Room Details
                    </h3>

                    <div className="grid grid-cols-2 gap-3 text-sm">

                      <p>
                        Type:
                        {" "}
                        <span className="font-medium capitalize">
                          {booking.room?.type}
                        </span>
                      </p>

                      <p>
                        Capacity:
                        {" "}
                        <span className="font-medium">
                          {booking.room?.capacity}
                        </span>
                      </p>

                      <p>
                        Rent:
                        {" "}
                        <span className="font-medium">
                          ₹{booking.room?.rent}
                        </span>
                      </p>

                      <p>
                        Deposit:
                        {" "}
                        <span className="font-medium">
                          ₹{booking.room?.deposit}
                        </span>
                      </p>

                      <p>
                        Gender:
                        {" "}
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

                  {/* TENANT PREFERENCES */}
                  <div className="bg-green-50 rounded-xl p-4 mb-4">

                    <h3 className="font-bold mb-3">
                      👤 Tenant Preferences
                    </h3>

                    <div className="grid grid-cols-2 gap-3 text-sm">

                      <p>
                        🚻 {booking.user?.gender || "N/A"}
                      </p>

                      <p>
                        🍴 {booking.user?.food || "N/A"}
                      </p>

                      <p>
                        🚭 {booking.user?.smoking || "N/A"}
                      </p>

                      <p>
                        😴 {booking.user?.sleep || "N/A"}
                      </p>

                      <p>
                        🧹 {booking.user?.cleanliness || "N/A"}
                      </p>

                    </div>

                  </div>

                  {/* REQUEST INFO */}
                  <div className="mb-5">

                    <p className="text-red-600 font-semibold">
                      ⏳ Expires in:
                      {" "}
                      {getTimeLeft(
                        booking.expiresAt
                      )}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      Requested on{" "}
                      {new Date(
                        booking.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-3">

                   <button
                      onClick={() =>
                        navigate(
                          `/tenant/${booking.user._id}`
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
                    >
                      View Profile
                    </button>
                    
                    <button
                      onClick={() =>
                        navigate(`/rooms/${booking.room?.property?._id}`)
                      }
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl"
                    >
                      View Room
                    </button>

                    {booking.status === "approved" && (
                      <button
                        onClick={() =>
                          startChat(
                            booking.user._id
                          )
                        }
                        className="bg-black text-white px-4 py-2 rounded-xl"
                      >
                        Chat
                      </button>
                    )}

                    {booking.status ===
                      "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(
                              booking._id,
                              "approved"
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              booking._id,
                              "rejected"
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </>
                    )}

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