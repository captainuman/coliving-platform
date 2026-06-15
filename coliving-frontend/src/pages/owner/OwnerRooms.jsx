import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";

export default function OwnerRooms() {
  const [rooms, setRooms] = useState([]);
  const [properties, setProperties] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    property: "",
    type: "shared",
    capacity: "",
    rent: "",
    deposit: "",
    genderPreference: "any",
    status: "available",
  });

  const fetchRooms = async () => {
    try {
      const res = await API.get("/rooms/owner/all");
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

const fetchProperties = async () => {
  try {
    const res = await API.get("/properties");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const ownerProperties = res.data.filter(
      (property) =>
        property.owner?._id === storedUser?._id ||
        property.owner === storedUser?._id
    );

    setProperties(ownerProperties);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load properties");
  }
};

  useEffect(() => {
    fetchRooms();
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      property: "",
      type: "shared",
      capacity: "",
      rent: "",
      deposit: "",
      genderPreference: "any",
      status: "available",
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

if (editingId) {
  await API.patch(`/rooms/${editingId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  toast.success("Room updated successfully");
} else {
  await API.post("/rooms", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  toast.success("Room request sent to admin for approval");
}
    resetForm();
    setImages([]);
    fetchRooms();
  }  catch (err) {
  console.log("ROOM ERROR:", err.response?.data || err);
  toast.error(
    err.response?.data?.message ||
    err.response?.data?.error ||
    "Something went wrong"
  );
}
};

  const handleEdit = (room) => {
    setEditingId(room._id);

    setForm({
      property: room.property?._id || room.property || "",
      type: room.type || "shared",
      capacity: room.capacity || "",
      rent: room.rent || "",
      deposit: room.deposit || "",
      genderPreference: room.genderPreference || "any",
      status: room.status || "available",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

const handleDelete = async (id) => {
  if (!window.confirm("Delete this room?")) return;

  try {
    await API.delete(`/rooms/${id}`);

    setRooms((prev) =>
      prev.filter((room) => room._id !== id)
    );

    toast.success("Room deleted");
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to delete room"
    );
  }
};

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Navbar />

      <div className="flex justify-between items-center mb-6 mt-6">
        <h1 className="text-3xl font-bold">Manage Rooms</h1>
      </div>

      

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Property</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Capacity</th>
              <th className="p-3 text-left">Occupied</th>
              <th className="p-3 text-left">Available</th>
              <th className="p-3 text-left">Rent</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => {
              console.log(room)
              const occupied = room.currentTenants?.length || 0;
              const available = room.capacity - occupied;
              const abc = available <= 0 ? "Not available" : "Available";
              return (
                <tr key={room._id} className="border-t">
                  <td className="p-3">{room.property?.title}</td>
                  <td className="p-3 capitalize">{room.type}</td>
                  <td className="p-3">{room.capacity}</td>
                  <td className="p-3">{occupied}</td>
                  <td className="p-3">{available}</td>
                  <td className="p-3">₹{room.rent}</td>
                  <td className="p-3 capitalize">{abc}</td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(room)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(room._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {rooms.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No rooms found
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 mt-8 "
      >
        <h2 className="text-2xl font-bold mb-4">
          {editingId ? "Edit Room" : "Add Room"}
        </h2>

        <select
          name="property"
          value={form.property}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-3"
          required
        >
          <option value="">Select Property</option>
          {properties.map((property) => (
            <option key={property._id} value={property._id}>
              {property.title}
            </option>
          ))}
        </select>

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-3"
        >
          <option value="shared">Shared</option>
          <option value="private">Private</option>
        </select>

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-3"
          required
        />

        <input
          type="number"
          name="rent"
          placeholder="Rent"
          value={form.rent}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-3"
          required
        />

        <input
          type="number"
          name="deposit"
          placeholder="Deposit"
          value={form.deposit}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-3"
        />

        <select
          name="genderPreference"
          value={form.genderPreference}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-3"
        >
          <option value="any">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        >
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
          className="w-full border p-3 rounded mb-3"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded"
          >
            {editingId ? "Update Room" : "Add Room"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
