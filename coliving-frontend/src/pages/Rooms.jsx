import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import RoomCardSlider from "../components/RoomCardSlider";
import toast from "react-hot-toast";

export default function Rooms() {
  const { propertyId } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState({});
  const [loading, setLoading] = useState(true);

  const tabs = [
    { name: "Rooms", id: "rooms" },
    { name: "Amenities", id: "amenities" },
    { name: "Location", id: "location" },
    { name: "Review", id: "review" },
  ];

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchRooms();
    fetchReviews();
  }, [propertyId]);

  const fetchRooms = async () => {
    setLoading(true);

    try {
      const res = await API.get(`/rooms/${propertyId}`);
      setRooms(res.data);
      if (res.data.length > 0) {
        setPropertyData(res.data[0].property);
      }

      res.data.forEach((room) => {
        fetchCompatibility(room._id);
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompatibility = async (roomId) => {
    try {
      const res = await API.get(`/rooms/compatibility/${roomId}`);
      setRoomData((prev) => ({
        ...prev,
        [roomId]: res.data,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleBooking = async (roomId) => {
    try {
      await API.post("/bookings", {
        room: roomId,
      });
      toast.success("Booking request sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/property/${propertyId}`);
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
      setTotalReviews(res.data.totalReviews);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reviews", {
        propertyId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      toast.success("Review added successfully");
      setReviewForm({
        rating: 5,
        comment: "",
      });

      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  const getRatingLabel = (rating) => {
    if (rating >= 4.8) return "Perfect";
    if (rating >= 4) return "Best";
    if (rating >= 3) return "Very Good";
    if (rating >= 2) return "Good";
    return "Not Good";
  };

  const BACKEND_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "https://coliving-backend.onrender.com";

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          Loading rooms...
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen font-poppins">
      <Navbar />

      <div className="bg-white rounded-xl shadow px-2 py-2 mb-6 m-5">
        <div className="flex justify-between">
          <div>
            <h1 className="text-[23px] font-semibold">{propertyData?.title}</h1>

            <p className="text-gray-500 text-[14px] font-medum">
              📍 {propertyData?.address?.streetAddress}{" "}
              {propertyData?.address?.area}
              {propertyData?.address?.district} {propertyData?.address?.state}{" "}
              {propertyData?.address?.pincode}
            </p>
          </div>

          <div className="flex items-center gap-3 px-5 ">
            <div className="flex flex-col">
              <span className="text-[14px] font-medium">
                {getRatingLabel(Number(averageRating))}
              </span>

              <span className="text-gray-500 text-[13px] font-normal">
                {totalReviews || 0} Reviews
              </span>
            </div>

            <div className="bg-green-500 text-white px-2 py-1 rounded-lg font-bold">
              {averageRating || 0}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-14 gap-4 mt-3">
          {/* Main Image */}
          <div className="lg:col-span-7 h-85 overflow-hidden">
            <RoomCardSlider images={rooms[0]?.images || []} />
          </div>

          {/* Thumbnail Images */}
          <div className="lg:col-span-3 grid grid-rows-4 gap-2 h-80">
            {rooms[0]?.images?.slice(1, 5).map((img, index) => (
              <img
                key={index}
                src={
                  img.startsWith("/uploads")
                    ? `${BACKEND_URL}${img}`
                    : `${BACKEND_URL}/uploads/rooms/${img}`
                }
                alt={`Room ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ))}
          </div>

          <div className="lg:col-span-4 rounded-xl bg-white shadow-sm flex flex-col">
            <div id="location" className="bg-white rounded-lg px-6 mt-1">
              <div>
                <iframe
                  title="map"
                  className="w-full h-80 rounded-lg"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    [
                      propertyData?.address?.streetAddress,
                      propertyData?.address?.area,
                      propertyData?.address?.district,
                      propertyData?.address?.state,
                      propertyData?.address?.pincode,
                    ]
                      .filter(Boolean)
                      .join(", "),
                  )}&z=13&output=embed`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg mb-5 overflow-hidden m-5 text-[14px] font-semibold">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                document.getElementById(tab.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="px-12 py-3 hover:bg-gray-100"
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div id="rooms" className=" rounded-lg overflow-hidden m-5">
        <div className="grid grid-cols-12 bg-orange-200 px-10 py-2 font-semibold text-[14px] ">
          <div className="col-span-4">Room Type</div>
          <div className="col-span-4">Roommates</div>
          <div className="col-span-4">Price</div>
        </div>

        {rooms.map((room) => {
          const occupied = roomData[room._id]?.currentTenants?.length || 0;
          const capacityLeft = room.capacity - occupied;
          return (
            <div
              key={room._id}
              className="grid grid-cols-12 border border-orange-200"
            >
              {/* Room Image */}
              <div className="col-span-4 p-2 px-4 border-r border-orange-100">
                <h3 className="font-semibold text-[15px] py-2">
                  {room.type} Room
                </h3>
                <div className="h-80">
                  <RoomCardSlider images={room.images} />
                </div>
              </div>

              {/* ROOMMATE DETAILS */}
              <div className="col-span-4 p-4 border-r border-orange-100">
                <h3 className="text-lg font-bold mb-4">
                  Current Roommates Details
                </h3>

                {roomData[room._id]?.currentTenants?.length > 0 ? (
                  <div className="space-y-3 flex flex-wrap gap-5">
                    {roomData[room._id].currentTenants.map((tenant, index) => (
                      <div key={index} className=" p-1 bg-gray-50">
                        <h4 className="font-semibold">{tenant.name}</h4>

                        <p className="text-sm text-gray-500">
                          Compatibility: {tenant.score}%
                        </p>

                        <button
                          onClick={() =>
                            window.open(`/tenant/${tenant._id}`, "_blank")
                          }
                          className="mt-2 text-sm bg-blue-600 text-white px-3 py-2 rounded-lg"
                        >
                          View Profile
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    No roommates currently assigned
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="col-span-4 p-4 flex flex-col items- justify-center">
                <h3 className="text-lg font-bold mb-4">Current Roommates</h3>

                <div className="mb-4 bg-blue-300 p-3 rounded-lg text-center">
                  <p className="text-sm text-blue-600 ">
                    Overall Compatibility Score
                  </p>

                  <p className="text-xl font-bold text-blue-700">
                    {roomData[room._id]?.compatibility || 0}%
                  </p>
                </div>

                <div className="flex  justify-between">
                  <div>
                    <p className="font-semibold">
                      👥 {capacityLeft} / {room.capacity} Spots Available
                    </p>

                    <p className="font-semibold capitalize">
                      {room.genderPreference === "male"
                        ? "👨 Boys Only"
                        : room.genderPreference === "female"
                        ? "👩 Girls Only"
                        : "👥 Boys & Girls"}
                    </p>
                  </div>

                  <div>
                    <div className="text-[24px] font-semibold">
                      ₹ {room.rent}{" "}
                      <span className="text-[12px] font-semibold text-gray-500">
                        (Per Month)
                      </span>
                    </div>

                    <div className="text-[15px] font-semibold text-gray-500">
                      Deposit : ₹{room.deposit}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBooking(room._id)}
                  disabled={capacityLeft <= 0}
                  className={`mt-4 px-8 py-3 rounded-full text-white transition ${
                    capacityLeft <= 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {capacityLeft <= 0 ? "Room Full" : "Book Now"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div id="amenities" className="bg-white rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Amenities</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {propertyData?.amenities?.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div id="review" className="bg-white rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-bold mb-2">Reviews</h2>

        <div className="bg-white rounded-lg mt-2">
          <textarea
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm({
                ...reviewForm,
                comment: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
            rows={1}
            placeholder="Share your experience..."
          />

          <div className="flex gap-2 mb-">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setReviewForm({
                    ...reviewForm,
                    rating: star,
                  })
                }
                className={`text-3xl ${
                  star <= reviewForm.rating ? "text-black" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <button
            onClick={handleReviewSubmit}
            className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg"
          >
            Submit Review
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4 mt-6">Tenant Reviews</h2>

        {reviews?.map((review) => (
          <div key={review._id} className="border-b py-4">
            <div className="flex justify-between">
              <h4 className="font-semibold">{review.tenant.name}</h4>

              <span className="bg-green-600 text-white px-2 py-1 rounded">
                {review.rating} ★
              </span>
            </div>

            <p className="text-gray-600 mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
