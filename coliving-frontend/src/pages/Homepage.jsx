import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function HomePage() {
  const [stats, setStats] = useState({
    properties: 0,
    rooms: 0,
    bookings: 0,
    reviews: 0,
  });

  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [propertiesRes, roomsRes, bookingsRes, reviewsRes] =
          await Promise.all([
            axios.get(`${API_URL}/api/properties`),
            axios.get(`${API_URL}/api/rooms`),
            axios.get(`${API_URL}/api/bookings`),
            axios.get(`${API_URL}/api/reviews`),
          ]);

        const properties = propertiesRes.data?.properties || propertiesRes.data || [];
        const rooms = roomsRes.data?.rooms || roomsRes.data || [];
        const bookings = bookingsRes.data?.bookings || bookingsRes.data || [];
        const reviewData = reviewsRes.data?.reviews || reviewsRes.data || [];

        setStats({
          properties: properties.length,
          rooms: rooms.length,
          bookings: bookings.length,
          reviews: reviewData.length,
        });

        setFeaturedProperties(properties.slice(0, 3));
        setReviews(reviewData.slice(0, 3));
      } catch (error) {
        console.error("Homepage data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />

      {/* HERO */}
      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-gray-400">
              Smart Co-Living Platform
            </p>

            <h1 className="mb-6 text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
              Find Rooms,
              <span className="block text-gray-300">Roommates & Owners</span>
              In One Place
            </h1>

            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-gray-300">
              A real MERN-based co-living platform where tenants can explore
              rooms, find compatible roommates, send booking requests, chat with
              owners, and review properties.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/properties"
                className="rounded-2xl bg-white px-8 py-4 text-center font-bold text-black"
              >
                Explore Properties
              </Link>

              <Link
                to="/register"
                className="rounded-2xl border border-white px-8 py-4 text-center font-bold hover:bg-white hover:text-black"
              >
                Join Platform
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-5 text-black shadow-2xl sm:p-8">
            <p className="text-sm text-gray-500">Live Platform Data</p>

            <h2 className="mt-2 text-3xl font-black">
              {loading ? "Loading..." : "Project Overview"}
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <StatBox value={stats.properties} label="Properties" />
              <StatBox value={stats.rooms} label="Rooms" />
              <StatBox value={stats.bookings} label="Bookings" />
              <StatBox value={stats.reviews} label="Reviews" />
            </div>
          </div>
        </div>
      </section>

      {/* REAL PROJECT MODULES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">
            Project Features
          </p>

          <h2 className="text-3xl font-black sm:text-5xl">
            Built From Your Actual System
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Feature icon="🏠" title="Property Listings" />
          <Feature icon="🛏️" title="Room Management" />
          <Feature icon="🤝" title="Roommate Matching" />
          <Feature icon="📅" title="Booking Requests" />
          <Feature icon="💬" title="Real-Time Chat" />
          <Feature icon="⭐" title="Reviews & Ratings" />
          <Feature icon="🛡️" title="Admin Approval" />
          <Feature icon="📩" title="Feedback System" />
        </div>
      </section>

      {/* FEATURED PROPERTIES FROM DATABASE */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">
                Real Listings
              </p>
              <h2 className="text-3xl font-black sm:text-5xl">
                Featured Properties
              </h2>
            </div>

            <Link to="/properties" className="font-bold underline">
              View All Properties
            </Link>
          </div>

          {featuredProperties.length === 0 ? (
            <p className="text-gray-500">No properties available yet.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => (
                <div
                  key={property._id}
                  className="overflow-hidden rounded-3xl bg-gray-50 shadow-md"
                >
                  <img
                    src={
                      property.images?.[0] ||
                      property.image ||
                      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop"
                    }
                    alt={property.title || property.name}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-6">
                    <h3 className="text-2xl font-black">
                      {property.title || property.name || "Property"}
                    </h3>

                    <p className="mt-2 text-gray-600">
                      {property.location || property.address || "Location not added"}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <p className="font-black">
                        ₹{property.rent || property.price || "N/A"}
                      </p>

                      <Link
                        to={`/properties/${property._id}`}
                        className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-black py-16 text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-400">
              Process
            </p>
            <h2 className="text-3xl font-black sm:text-5xl">How It Works</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Step
              number="01"
              title="Register"
              text="Create an account as tenant, owner, or admin using secure authentication."
            />
            <Step
              number="02"
              title="Explore & Match"
              text="Tenants explore rooms and find compatible roommates based on preferences."
            />
            <Step
              number="03"
              title="Book & Chat"
              text="Send booking requests, chat in real time, and review the property."
            />
          </div>
        </div>
      </section>

      {/* REVIEWS FROM DATABASE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">
            User Feedback
          </p>
          <h2 className="text-3xl font-black sm:text-5xl">Latest Reviews</h2>
        </div>

        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews available yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {reviews.map((review) => (
              <div key={review._id} className="rounded-3xl bg-white p-8 shadow-md">
                <p className="text-2xl font-black">⭐ {review.rating || 5}/5</p>
                <p className="mt-4 text-gray-600">
                  {review.comment || review.message || "No comment added."}
                </p>
                <p className="mt-6 font-bold">
                  {review.user?.name || review.tenant?.name || "Platform User"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 sm:px-6 lg:pb-24">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-black p-8 text-center text-white sm:p-12 lg:p-16">
          <h2 className="text-3xl font-black sm:text-5xl lg:text-6xl">
            Start Your Co-Living Journey
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-gray-300">
            Whether you are a tenant looking for a room or an owner managing
            properties, this platform brings everything into one system.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="rounded-2xl bg-white px-10 py-4 font-black text-black"
            >
              Create Account
            </Link>

            <Link
              to="/properties"
              className="rounded-2xl border border-white px-10 py-4 font-black hover:bg-white hover:text-black"
            >
              Browse Rooms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatBox({ value, label }) {
  return (
    <div className="rounded-2xl bg-gray-100 p-5 text-center">
      <h3 className="text-3xl font-black">{value}</h3>
      <p className="mt-2 text-sm font-semibold text-gray-500">{label}</p>
    </div>
  );
}

function Feature({ icon, title }) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 text-5xl">{icon}</div>
      <h3 className="text-xl font-black">{title}</h3>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <p className="mb-6 text-6xl font-black text-gray-600">{number}</p>
      <h3 className="mb-4 text-2xl font-black">{title}</h3>
      <p className="text-gray-300">{text}</p>
    </div>
  );
}