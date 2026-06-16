import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Hotels() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = searchParams.get("location") || "";
  const gender = searchParams.get("gender") || "";
  const maxRent = searchParams.get("maxRent") || "";
  const roomType = searchParams.get("roomType") || "";

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchHotels();
  }, [location, gender, maxRent, roomType]);

  const BACKEND_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "https://coliving-backend.onrender.com";

  const getRoomImage = (room) => {
    if (!room.images?.length) {
      return "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85";
    }

    const img = room.images[0];

    if (img.startsWith("http")) return img;

    return img.startsWith("/uploads")
      ? `${BACKEND_URL}${img}`
      : `${BACKEND_URL}/uploads/rooms/${img}`;
  };

  const fetchHotels = async () => {
    try {
      const query = new URLSearchParams({
        location,
        gender,
        maxRent,
        roomType,
      }).toString();

      const res = await API.get(`/rooms/search/all?${query}`);
      setProperties(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getRating = (score = 0) => {
    const rating = score * 2;

    if (rating >= 9.5) return "Perfect";
    if (rating >= 9.0) return "Exceptional";
    if (rating >= 8.5) return "Outstanding";
    if (rating >= 8.0) return "Excellent";
    if (rating >= 7.0) return "Very Good";
    if (rating >= 6.0) return "Good";
    if (rating >= 5.0) return "Fair";

    return "Bad";
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <Navbar />

      {/* HEADER */}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-black">
          {properties.length} Properties Found
        </h1>

        {location && (
          <p className="text-gray-600 mt-2">
            Showing results for &quot;{location}&quot;
          </p>
        )}
      </div>

      {/* PROPERTY LIST */}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 pb-10 space-y-4">
        {properties.length === 0 ? (
          <div className="text-center text-xl font-semibold py-10">
            No Properties Found in {location}
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property._id}
              className="bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* IMAGE */}
                <div className="lg:col-span-3 p-3 lg:p-6 relative">
                  <div className="relative">
                    <img
                      src={getRoomImage(property)}
                      alt={property.property?.title || "Room"}
                      className="w-full h-48 sm:h-56 lg:h-60 object-cover rounded-md"
                    />

                    <button className="absolute top-3 right-3 bg-white/90 w-9 h-9 rounded-full text-2xl flex items-center justify-center">
                      ♡
                    </button>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="lg:col-span-6 p-3 lg:p-6">
                  <h2 className="text-[18px] lg:text-[20px] font-black mb-2">
                    {property.property?.title}
                  </h2>

                  <p className="text-[14px] mb-4">
                    <span className="text-[13px] lg:text-[14px] mb-4">
                      📍{" "}
                      {[
                        property.property?.address?.streetAddress,
                        property.property?.address?.area,
                        property.property?.address?.district,
                        property.property?.address?.state,
                        property.property?.address?.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                    <span className="text-gray-800">
                      {" "}
                      |{" "}
                      {property.property?.address?.district ||
                        "Nearby city centre"}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-2 lg:gap-10">
                    <span className="border border-gray-400 px-2 lg:px-3 py-1 rounded-md text-[11px] lg:text-[12px] font-semibold text-gray-600">
                      Room Type : {property.type}
                    </span>
                    <span className="border border-gray-400 px-2 lg:px-3 py-1 rounded-md text-[11px] lg:text-[12px] font-semibold text-gray-600">
                      Capacity : {property.capacity}
                    </span>
                  </div>

                  <p className="text-teal-700 text-[14px] mt-6">
                    ✓ Book with ₹0 Payment
                  </p>

                  <div className="flex flex-wrap gap-2 mt-5">
                    {property.property?.amenities
                      ?.slice(0, 4)
                      .map((item, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                  </div>
                </div>

                {/* PRICE */}

                <div
                  className="
                    lg:col-span-3
                    border-t lg:border-t-0
                    lg:border-l border-gray-300
                    p-4 lg:p-6
                    flex flex-col justify-between
                  "
                >
                  <div className="flex justify-between items-start lg:block">

                    {/* Price Left */}
                    <div>
                      <h2 className="text-[20px] font-black">
                        ₹ {property.rent}
                      </h2>

                      <p className="text-gray-600 text-[12px]">
                        Per Month
                      </p>

                      <p className="text-gray-600 text-[12px]">
                        + ₹{property.deposit} Deposit
                      </p>
                    </div>

                    {/* Rating Right */}
                    <div className="flex items-start gap-2">
                      <div className="text-right">
                        <h3 className="text-blue-700 font-medium">
                          {getRating(property.property?.rating)}
                        </h3>

                        <p className="text-[12px] text-gray-700">
                          ({property.property?.reviewCount || 0} Ratings)
                        </p>
                      </div>

                      <span className="bg-blue-700 text-white px-2 py-1 rounded-md font-black">
                        {property.property?.rating || 0}
                      </span>
                    </div>

                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/rooms/${property.property?._id}`)}
                    className="text-blue-600 text-[14px] lg:text-[16px] font-medium text-left lg:text-end mt-4"
                  >
                    Book Now & Pay Later!
                  </button>
                </div>
              </div>
          ))
        )}
      </div>
    </div>
  );
}
