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

    return [area, district, state, pincode]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">
          My Bookings
        </h1>

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-5 rounded-2xl shadow-md"
              >
                <h2 className="text-2xl font-bold mb-2">
                  {booking.room?.property?.title || "Property unavailable"}
                </h2>

                <p className="mb-2">
                  📍 {getAddress(booking.room?.property)}
                </p>

                <p className="mb-2 capitalize">
                  🛏️ {booking.room?.type || "Room unavailable"}
                </p>

                <p className="mb-2">
                  💰 ₹{booking.room?.rent || 0}/month
                </p>

                <p className="font-semibold">
                  Status:
                  <span className="ml-2 capitalize">
                    {booking.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}