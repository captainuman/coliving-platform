import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";

export default function AdminRoomRequests() {
  const [rooms, setRooms] = useState([]);

  const fetchPendingRooms = async () => {
    try {
      const res = await API.get("/rooms/admin/pending");
      setRooms(res.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to load room requests"
      );
    }
  };

  const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

  useEffect(() => {
    fetchPendingRooms();
  }, []);

  const approveRoom = async (id) => {
    try {
      await API.patch(`/rooms/admin/${id}/approve`);
      toast.success("Room approved");
      fetchPendingRooms();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to approve room"
      );
    }
  };

  const rejectRoom = async (id) => {
    try {
      await API.patch(`/rooms/admin/${id}/reject`);
      toast.success("Room rejected");
      fetchPendingRooms();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to reject room"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          Room Approval Requests
        </h1>

        {rooms.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center text-gray-500">
            No pending room requests
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <div key={room._id} className="bg-white rounded-2xl shadow p-5">
                {room.images?.[0] && (
                  <img
                    src={
                      room.images[0]?.startsWith("/uploads")
                        ? `${BACKEND_URL}${room.images[0]}`
                        : `${BACKEND_URL}/uploads/rooms/${room.images[0]}`
                    }
                    alt="Room"
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}

                <h2 className="text-xl font-bold mb-2">
                  {room.property?.title}
                </h2>

                <p className="text-sm text-gray-500">
                  Owner: {room.property?.owner?.name}
                </p>

                <p>Type: {room.type}</p>
                <p>Capacity: {room.capacity}</p>
                <p>Rent: ₹{room.rent}</p>
                <p>Deposit: ₹{room.deposit}</p>
                <p>Gender: {room.genderPreference}</p>

                <p className="mt-2 text-yellow-600 font-semibold">
                  Status: {room.approvalStatus}
                </p>

                <p className="mt-2 inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {room.approvalStatus}
                </p>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => approveRoom(room._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectRoom(room._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}