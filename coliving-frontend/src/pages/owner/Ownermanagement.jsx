import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import API from "../../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";      

export default function Ownermanagement() {
  const [properties, setProperties] = useState([]);

  const [form, setForm] = useState({
  title: "",
  streetAddress: "",
  area: "",
  district: "",
  state: "",
  pincode: "",
  amenities: "",
});

  const [areas, setAreas] = useState([]);


  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
  try {
    const res = await API.get("/properties");

    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    const ownerProperties = res.data.filter(
      (property) =>
        property.owner?._id === storedUser?._id ||
        property.owner === storedUser?._id
    );

    setProperties(ownerProperties);
  } catch (err) {
    console.log(err);
    toast.error("Failed to load properties");
  }
};

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

 const handleCreateProperty = async (e) => {
  e.preventDefault();
  if (
  !form.title ||
  !form.streetAddress ||
  !form.area ||
  !form.district ||
  !form.state ||
  !form.pincode
) {
  return toast.error("Please fill all property address fields");
}

  try {

    const payload = {
      title: form.title,

      address: {
        streetAddress: form.streetAddress,
        area: form.area,
        district: form.district,
        state: form.state,
        pincode: form.pincode,
      },

      amenities: form.amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    };

    const res = await API.post("/properties", payload);

    toast.success("Property created");

    setProperties((prev) => [
      ...prev,
      res.data
    ]);

    setForm({
      title: "",
      streetAddress: "",
      area: "",
      district: "",
      state: "",
      pincode: "",
      amenities: "",
    });
    setAreas([]);

    fetchProperties();

  } catch (err) {
    toast.error("Failed to create property");
  }
};

  const handlePincodeChange = async (e) => {
 const pincode = e.target.value.replace(/\D/g, "");
 
  setForm((prev) => ({
    ...prev,
    pincode,
  }));

  if (pincode.length === 6) {
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      const data = await res.json();

      if (
        data[0].Status === "Success" &&
        data[0].PostOffice?.length
      ) {
        const postOffice = data[0].PostOffice[0];

        setForm((prev) => ({
          ...prev,
          district: postOffice.District,
          state: postOffice.State,
        }));

        setAreas(data[0].PostOffice);
      }
    } catch (err) {
      console.error(err);
    }
  }
};


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-8">


  {/* QUICK ACTIONS */}
  <div className="grid md:grid-cols-3 gap-6 mb-10">

    <Link
      to="/owner/rooms"
      className="bg-blue-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition"
    >
      <h2 className="text-2xl font-bold mb-2">
        Room Management
      </h2>

      <p>
        Add, edit and delete rooms
      </p>
    </Link>

    <Link
      to="/owner/tenants"
      className="bg-green-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition"
    >
      <h2 className="text-2xl font-bold mb-2">
        Tenant Management
      </h2>

      <p>
        View and remove tenants
      </p>
    </Link>

    <Link
      to="/owner/bookings"
      className="bg-purple-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition"
    >
      <h2 className="text-2xl font-bold mb-2">
        Booking Requests
      </h2>

      <p>
        Approve or reject bookings
      </p>
    </Link>

  </div>

  {/* CREATE PROPERTY */}


        {/* CREATE PROPERTY */}
        <form
          onSubmit={handleCreateProperty}
          className="bg-white p-6 rounded-2xl shadow-md mb-10"
        >
          <h2 className="text-2xl font-bold mb-4">
            Add Property
          </h2>

          <input
            type="text"
            name="title"
             required
            placeholder="Property Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <textarea
  name="streetAddress"
   required
  placeholder="Street Address"
  value={form.streetAddress}
  onChange={handleChange}
  className="w-full border p-3 rounded-lg mb-4"
/>

<input
  type="text"
   required
  placeholder="Pincode"
  value={form.pincode}
  maxLength={6} 
  onChange={handlePincodeChange}
  className="w-full border p-3 rounded-lg mb-4"
/>

<input
  type="text"
  value={form.state}
  readOnly
  placeholder="State"
  className="w-full border p-3 rounded-lg mb-4 bg-gray-100"
/>

<input
  type="text"
  value={form.district}
  readOnly
  placeholder="District"
  className="w-full border p-3 rounded-lg mb-4 bg-gray-100"
/>

<select
  value={form.area}
  onChange={(e) =>
    setForm({
      ...form,
      area: e.target.value,
    })
  }
   required
  className="w-full border p-3 rounded-lg mb-4"
>
  <option value="">Select Area</option>

  {areas.map((area) => (
    <option
      key={area.Name}
      value={area.Name}
    >
      {area.Name}
    </option>
  ))}
</select>

          <input
            type="text"
            name="amenities"
             required
            placeholder="Amenities (comma separated)"
            value={form.amenities}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            Create Property
          </button>
        </form>

        {/* PROPERTY LIST */}
{/* PROPERTIES CREATED */}
<div className="mb-6">
  <h2 className="text-3xl font-bold text-gray-800">
    Properties Created
  </h2>
  <p className="text-gray-500 mt-1">
    List of all properties added by you
  </p>
</div>

<div className="grid md:grid-cols-3 gap-6">
  {properties.map((property) => (
    <div
      key={property._id}
      className="bg-white p-5 rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-bold mb-2">
        {property.title}
      </h2>

      <p className="mb-3">
        📍 {property.address
          ? [
            property.address.streetAddress,
            property.address.area,
            property.address.district,
            property.address.state,
            property.address.pincode
          ]
            .filter(Boolean)
            .join(", ")
                    : "Location unavailable"}
      </p>

      <div className="flex flex-wrap gap-2">
        {property.amenities?.map((item, index) => (
          <span
            key={index}
            className="bg-gray-200 px-3 py-1 rounded-full text-sm"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  ))}
</div>
      </div>
    </div>
  );
}