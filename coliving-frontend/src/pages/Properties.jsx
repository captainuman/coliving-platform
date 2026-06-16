import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedLocation = searchParams.get("location") || "";
  const [recentlyViewedProperties, setRecentlyViewedProperties] = useState([]);

  const BACKEND_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "https://coliving-backend.onrender.com";

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    location: selectedLocation,
    gender: "",
    maxRent: "",
    roomType: "",
  });

  const popularDestinations = [
    { name: "Bangalore", image: "/images/bangalore2.jpg" },
    { name: "Hyderabad", image: "/images/hyderabad.jpg" },
    { name: "Chennai", image: "/images/chennai.jpg" },
    { name: "Mumbai", image: "/images/mumbai.jpg" },
    { name: "Delhi", image: "/images/delhi.jpg" },
    { name: "Pune", image: "/images/pune.jpg" },
    { name: "Kolkata", image: "/images/pune2.jpg" },
    { name: "Goa", image: "/images/pune3.jpg" },
    { name: "Ahmedabad", image: "/images/pune4.jpg" },
  ];

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchFilteredRooms = async (currentFilters = filters) => {
    try {
      setLoading(true);
      const query = new URLSearchParams(currentFilters).toString();
      const res = await API.get(`/rooms/search/all?${query}`);
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const updatedFilters = {
      ...filters,
      location: selectedLocation,
    };

    setFilters(updatedFilters);
    fetchFilteredRooms(updatedFilters);
  }, [selectedLocation]);

  useEffect(() => {
    const viewedIds = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const viewedProperties = viewedIds
      .map((id) => properties.find((p) => p.property?._id === id))
      .filter(Boolean);

    setRecentlyViewedProperties(viewedProperties);
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (!selectedLocation) return true;
      const searchableLocation = [
        property.property?.location,
        property.property?.address?.area,
        property.property?.address?.district,
        property.property?.address?.state,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableLocation.includes(selectedLocation.toLowerCase());
    });
  }, [properties, selectedLocation]);

  const recentProperties = useMemo(() => {
    return filteredProperties.slice().reverse();
  }, [filteredProperties]);

  const recommendedProperties = useMemo(() => {
    if (!recentlyViewedProperties.length) {
      return filteredProperties
        .slice()
        .sort((a, b) => (b.property?.rating || 0) - (a.property?.rating || 0))
        .slice(0, 8);
    }

    const lastViewed = recentlyViewedProperties[0];

    return filteredProperties
      .filter((property) => {
        const isNotSameProperty =
          property.property?._id !== lastViewed.property?._id;
        const sameCity =
          property.property?.address?.district ===
            lastViewed.property?.address?.district ||
          property.property?.address?.state ===
            lastViewed.property?.address?.state;
        const sameRoomType = property.type === lastViewed.type;
        const similarRent =
          Math.abs((property.rent || 0) - (lastViewed.rent || 0)) <= 3000;
        return isNotSameProperty && (sameCity || sameRoomType || similarRent);
      })
      .sort((a, b) => {
        const aScore =
          (a.property?.rating || 0) +
          (a.type === lastViewed.type ? 2 : 0) +
          (a.property?.address?.district ===
          lastViewed.property?.address?.district
            ? 2
            : 0);
        const bScore =
          (b.property?.rating || 0) +
          (b.type === lastViewed.type ? 2 : 0) +
          (b.property?.address?.district ===
          lastViewed.property?.address?.district
            ? 2
            : 0);
        return bScore - aScore;
      })
      .slice(0, 8);
  }, [filteredProperties, recentlyViewedProperties]);

  const handleLocationClick = (location) => {
    window.open(`/hotels?location=${encodeURIComponent(location)}`);
  };

  const getRating = (score = 0) => {
    const rating = score * 2;
    if (rating >= 9.5) return <div className="rating perfect">Perfect</div>;
    if (rating >= 9.0)
      return <div className="rating exceptional">Exceptional</div>;
    if (rating >= 8.5)
      return <div className="rating outstanding">Outstanding</div>;
    if (rating >= 8.0) return <div className="rating excellent">Excellent</div>;
    if (rating >= 7.0) return <div className="rating very-good">Very Good</div>;
    if (rating >= 6.0) return <div className="rating good">Good</div>;
    if (rating >= 5.0) return <div className="rating fair">Fair</div>;
    return <div className="rating bad">Bad</div>;
  };

  const getRoomImage = (property) => {
    if (!property.images?.length) {
      return "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85";
    }
    return property.images[0].startsWith("/uploads")
      ? `${BACKEND_URL}${property.images[0]}`
      : `${BACKEND_URL}/uploads/rooms/${property.images[0]}`;
  };

  const PropertyCard = ({ property }) => (
    <div
      className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 border border-gray-200 bg-gray-100 cursor-pointer h-auto min-h-97.5"
      onClick={() => {
        if (!property?.property?._id) return;

        const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

        const updated = [
          property.property._id,
          ...viewed.filter((id) => id !== property.property._id),
        ].slice(0, 8);

        localStorage.setItem("recentlyViewed", JSON.stringify(updated));

        const viewedProperties = updated
          .map((id) => properties.find((p) => p.property?._id === id))
          .filter(Boolean);

        setRecentlyViewedProperties(viewedProperties);

        navigate(`/rooms/${property.property._id}`);
      }}
    >
      <div className="h-40 overflow-hidden">
        <img
          src={getRoomImage(property)}
          alt={property.property?.title || "room"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-2 pt-3">
        <h2 className="text-[16px] font-semibold truncate">
          {property.property?.title}
        </h2>

        <p className="mb-1 text-[12px] text-gray-700">
          {property.property?.address
            ? `${property.property.address.area}, ${property.property.address.district} ${property.property.address.state}`
            : "Location unavailable"}
        </p>

        <div className="mb-2">
          <h3 className="text-[16px] font-semibold text-blue-950">
            Rent : ₹{property.rent}/m
          </h3>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <span className="bg-green-900 text-white px-3 rounded font-bold text-[12px]">
            {property.property?.rating || 0}
          </span>

          <span className="text-gray-500 font-normal text-[12px] flex">
            {getRating(property.property?.rating)}(
            {property.property?.reviewCount || 0} reviews)
          </span>
        </div>

        <div className="flex gap-2 mt-2 mb-4 bg-gray-200 rounded justify-around">
          <span className="py-1 rounded-lg font-semibold text-[14px]">
            Capacity : {property.capacity}
          </span>

          <span className="py-1 rounded-lg font-semibold text-[14px]">
            Type : {property.type}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {property.property?.amenities?.slice(0, 10).map((item, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const PropertySection = ({ title, properties }) => {
    if (!properties?.length) return null;

    return (
      <>
        <div className="overflow-hidden px-5 sm:px-8 lg:px-10">
          <Swiper
            modules={[Navigation]}
            navigation
            centeredSlides={false}
            className="py-2"
            spaceBetween={20}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
          >
            {properties.map((property) => (
              <SwiperSlide key={property._id} className="flex justify-center">
                <div className="w-full max-w-sm px-10 lg:px-0">
                  <PropertyCard property={property} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white bg-cover">
      <Navbar />

      <div className="max-w-7xl bg-white mx-auto">
        <div className="space-y-6">
          <div className="max-w-7xl mx-auto shadow-lg bg-black p-5 border-t-2">
            <p className="text-base sm:text-lg lg:text-xl font-semibold font-poppins text-white px-4 py-3 sm:p-5 text-center lg:text-right">
              Find Your Space. Find Your People
            </p>

            {/* Mobile */}
            <div className="block lg:hidden bg-white rounded-xl shadow-lg p-3 font-semibold">
              {/* Location */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">
                  📍 Enter City Name, Location, or Specific hotel
                </p>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Enter Location"
                  className="w-full h-10 px-3 rounded border border-gray-200 text-sm"
                />
              </div>

              {/* Rent + Room Type + Gender */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">💰 Maximum Rent</p>
                  <input
                    type="number"
                    name="maxRent"
                    value={filters.maxRent}
                    onChange={handleFilterChange}
                    placeholder="₹"
                    className="w-full h-10 px-2 rounded border border-gray-200 text-sm"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">🛏 Room Type</p>
                  <select
                    name="roomType"
                    value={filters.roomType}
                    onChange={handleFilterChange}
                    className="w-full h-10 px-2 rounded border border-gray-200 text-sm"
                  >
                    <option value="">All</option>
                    <option value="shared">Shared</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">👤 Gender</p>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className="w-full h-10 px-2 rounded border border-gray-200 text-sm"
                  >
                    <option value="">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="any">Any</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  const query = new URLSearchParams(filters).toString();
                  navigate(`/hotels?${query}`);
                }}
                className="w-full h-11 bg-orange-500 text-white rounded-lg font-semibold"
              >
                SEARCH
              </button>
            </div>

            {/* Desktop - Keep your existing code exactly as it is */}
            <div className="hidden lg:grid lg:grid-cols-[2.5fr_1fr_1fr_1fr_1fr] bg-white overflow-hidden rounded-xl shadow-xl/30 shadow-black/50 font-poppins text-[14px] font-medium">
              <div className="border-b lg:border-b-0 lg:border-r border-gray-300 p-4">
                <p className="text-gray-500 mb-2">
                  📍 Enter City Name, Location, or Specific hotel
                </p>

                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Location"
                  className="w-full h-10 px-3 rounded bg-white shadow-md text-sm font-medium"
                />
              </div>

              <div className="border-b lg:border-b-0 lg:border-r border-gray-300 p-4">
                <p className="text-gray-500 mb-2">💰 Maximum Rent</p>

                <input
                  type="number"
                  name="maxRent"
                  value={filters.maxRent}
                  onChange={handleFilterChange}
                  placeholder="₹ Rent"
                  className="w-full h-10 px-3 rounded bg-white shadow-md text-sm font-medium border border-gray-200"
                />
              </div>

              <div className="border-b lg:border-b-0 lg:border-r border-gray-300 p-4">
                <p className="text-gray-500 mb-2">🛏 Room Type</p>

                <select
                  name="roomType"
                  value={filters.roomType}
                  onChange={handleFilterChange}
                  className="w-full h-10 px-3 rounded bg-white shadow-md text-sm font-medium border border-gray-200 appearance-none text-gray-500"
                >
                  <option value="">Select</option>
                  <option value="shared">Shared</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="border-b lg:border-b-0 lg:border-r border-gray-300 p-4">
                <p className="text-gray-500 mb-2">👤 Gender</p>

                <select
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  className="w-full h-10 px-3 rounded bg-white shadow-md text-sm font-medium border border-gray-200 appearance-none text-gray-500"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="any">Any</option>
                </select>
              </div>

              <button
                onClick={() => {
                  const query = new URLSearchParams(filters).toString();
                  navigate(`/hotels?${query}`);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 lg:py-0"
              >
                SEARCH
              </button>
            </div>
          </div>

          <div className="text-blue-950 mb-10">
            <h1 className="text-[26px] sm:text-[30px] lg:text-[36px] font-medium text-center px-4 sm:px-10 font-recoleta mb-5 text-blue-950">
              {" "}
              Recently Viewed Properties
            </h1>
            <PropertySection properties={recentlyViewedProperties} />
          </div>

          <div className="text-blue-950 mb-10">
            <h1 className="text-[26px] sm:text-[30px] lg:text-[36px] font-medium text-center px-4 sm:px-10 font-recoleta mb-5 text-blue-950">
              {" "}
              Recommended Properties Stays For You
            </h1>
            <PropertySection properties={recommendedProperties} />
          </div>

          <div className="text-blue-950 mb-10">
            <h1 className="text-[26px] sm:text-[30px] lg:text-[36px] font-medium text-center px-4 sm:px-10 font-recoleta mb-5 text-blue-950">
              {" "}
              Recently Created Properties
            </h1>
            <PropertySection properties={recentProperties} />
          </div>

          <div className="font-poppins pb-10">
            <h1 className="text-[26px] sm:text-[30px] lg:text-[36px] font-medium text-center px-4 sm:px-10 font-recoleta mb-5 text-blue-950">
              Trending Destinations
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-10">
              {popularDestinations.map((city, index) => (
                <div
                  key={index}
                  onClick={() => handleLocationClick(city.name)}
                  className="bg-white/60 border border-blue-400 rounded-2xl p-1 hover:shadow-lg transition cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-16 h-16 sm:w-18 sm:h-17 rounded-xl object-cover"
                    />

                    <div>
                      <h2 className="text-3xl mb-2 font-bold text-[18px]">
                        {city.name}
                      </h2>

                      <p className="text-gray-700 text-lg text-[13px] font-normal">
                        PGs, Boys PGs, Girls PGs, Shared rooms, Private rooms
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedLocation && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => navigate("/properties")}
                  className="bg-blue-950 text-white px-3 py-2 rounded-full"
                >
                  Show All Properties
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <h2 className="text-3xl font-bold mb-4">StayNest</h2>

              <p className="text-gray-300 leading-7">
                Find the best PGs, shared rooms, private rooms, coliving spaces
                and rental accommodations across India.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>

              <ul className="space-y-3 text-gray-300">
                <li>
                  <button
                    onClick={() => navigate("/")}
                    className="hover:text-white"
                  >
                    Home
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => navigate("/properties")}
                    className="hover:text-white"
                  >
                    Properties
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => navigate("/about")}
                    className="hover:text-white"
                  >
                    About Us
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => navigate("/contact")}
                    className="hover:text-white"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Popular Cities</h3>

              <ul className="space-y-3 text-gray-300">
                <li>Bangalore</li>
                <li>Hyderabad</li>
                <li>Chennai</li>
                <li>Mumbai</li>
                <li>Delhi</li>
                <li>Pune</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>

              <div className="space-y-3 text-gray-300">
                <p>📍 Bangalore, India</p>
                <p>📧 support@staynest.com</p>
                <p>📞 +91 98765 43210</p>
                <p>🕒 24/7 Customer Support</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2026 StayNest. All rights reserved.
            </p>

            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
