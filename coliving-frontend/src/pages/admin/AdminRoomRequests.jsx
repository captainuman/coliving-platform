import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";

export default function AdminRoomRequests() {
  const [rooms, setRooms] = useState([]);

  const BACKEND_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "https://coliving-backend.onrender.com";

  const fetchPendingRooms = async () => {
    try {
      const res = await API.get("/rooms/admin/pending");
      setRooms(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load room requests");
    }
  };

  useEffect(() => {
    fetchPendingRooms();
  }, []);

  const approveRoom = async (id) => {
    try {
      await API.patch(`/rooms/admin/${id}/approve`);
      toast.success("Room approved");
      fetchPendingRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve room");
    }
  };

  const rejectRoom = async (id) => {
    try {
      await API.patch(`/rooms/admin/${id}/reject`);
      toast.success("Room rejected");
      fetchPendingRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject room");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8">
          Room Approval Requests
        </h1>

        {rooms.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center text-gray-500">
            No pending room requests
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-3xl shadow-md overflow-hidden"
              >
                {room.images?.[0] && (
                  <img
                    src={
                      room.images[0].startsWith("/uploads")
                        ? `${BACKEND_URL}${room.images[0]}`
                        : `${BACKEND_URL}/uploads/rooms/${room.images[0]}`
                    }
                    alt="Room"
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-1">
                        {room.property?.title}
                      </h2>

                      <p className="text-sm text-gray-500">
                        Owner: {room.property?.owner?.name || "N/A"}
                      </p>
                    </div>

                    <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                      {room.approvalStatus}
                    </span>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <h3 className="font-bold mb-2">🏠 Property Details</h3>

                    <p className="font-medium">
                      {room.property?.title || "Property unavailable"}
                    </p>

                    <p className="text-sm text-gray-500">
                      Owner: {room.property?.owner?.name || "N/A"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h3 className="font-bold mb-3">🛏 Room Details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <p>
                        Type:{" "}
                        <span className="font-medium capitalize">
                          {room.type}
                        </span>
                      </p>

                      <p>
                        Capacity:{" "}
                        <span className="font-medium">{room.capacity}</span>
                      </p>

                      <p>
                        Rent:{" "}
                        <span className="font-medium">₹{room.rent}</span>
                      </p>

                      <p>
                        Deposit:{" "}
                        <span className="font-medium">₹{room.deposit}</span>
                      </p>

                      <p>
                        Gender:{" "}
                        <span className="font-medium capitalize">
                          {room.genderPreference}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => approveRoom(room._id)}
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectRoom(room._id)}
                      className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                    >
                      Reject
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