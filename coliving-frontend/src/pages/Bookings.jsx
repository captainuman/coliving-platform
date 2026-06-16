import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await API.get("/bookings/my");

      setBookings(res.data);
    } catch (err) {
      console.log("BOOKINGS ERROR:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const getAddress = (property) => {
    if (!property?.address) return "Location unavailable";

    const { area, district, state, pincode } = property.address;

    return [area, district, state, pincode].filter(Boolean).join(", ");
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8">
          My Bookings
        </h1>

        {loading ? (
          <div className="bg-white rounded-3xl p-10 text-center">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center">
            No bookings found.
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-3xl shadow-md overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-2">
                        {booking.room?.property?.title ||
                          "Property unavailable"}
                      </h2>

                      <p className="text-gray-600 text-sm">
                        📍 {getAddress(booking.room?.property)}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                        booking.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : booking.status === "expired"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h3 className="font-bold mb-3">🛏 Room Details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <p>
                        Type:{" "}
                        <span className="font-medium capitalize">
                          {booking.room?.type || "N/A"}
                        </span>
                      </p>

                      <p>
                        Rent:{" "}
                        <span className="font-medium">
                          ₹{booking.room?.rent || 0}/month
                        </span>
                      </p>

                      <p>
                        Deposit:{" "}
                        <span className="font-medium">
                          ₹{booking.room?.deposit || 0}
                        </span>
                      </p>

                      <p>
                        Capacity:{" "}
                        <span className="font-medium">
                          {booking.room?.capacity || "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-bold mb-2">🏠 Property Details</h3>

                    <p className="font-medium">
                      {booking.room?.property?.title || "Property unavailable"}
                    </p>

                    <p className="text-gray-600 text-sm mt-1">
                      📍 {getAddress(booking.room?.property)}
                    </p>
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
