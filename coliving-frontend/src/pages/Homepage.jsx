import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const featuredRooms = [
  {
    title: "Urban Nest Residency",
    location: "Bangalore, India",
    rent: "₹8,000/month",
    type: "Shared Room",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Green View Co-Living",
    location: "Hyderabad, India",
    rent: "₹10,500/month",
    type: "Private Room",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "City Comfort Stay",
    location: "Chennai, India",
    rent: "₹7,500/month",
    type: "Shared Room",
    rating: "4.6",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1400&auto=format&fit=crop",
  },
];

const features = [
  {
    icon: "🏠",
    title: "Verified Homes",
    text: "Explore trusted rooms and co-living spaces added by verified property owners.",
  },
  {
    icon: "🤝",
    title: "Find Roommates",
    text: "Match with roommates based on lifestyle, habits, food preference, and comfort.",
  },
  {
    icon: "💬",
    title: "Chat Instantly",
    text: "Talk directly with owners and potential roommates before making a booking.",
  },
  {
    icon: "📅",
    title: "Easy Booking",
    text: "Send booking requests and manage your stay without complicated paperwork.",
  },
];

const reviews = [
  {
    name: "Ayesha Khan",
    text: "I found a clean shared room near my college and connected with the owner directly. The process was simple and fast.",
    rating: "5.0",
  },
  {
    name: "Rahul Sharma",
    text: "The roommate matching helped me avoid random sharing. I found someone with similar habits and routine.",
    rating: "4.8",
  },
  {
    name: "Priya Nair",
    text: "As a property owner, listing rooms and managing booking requests became much easier.",
    rating: "4.9",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black font-recoleta">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_35%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-gray-400">
              Smart Co-Living Made Simple
            </p>

            <h1 className="mb-6 text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
              Find Your Next Room
              <span className="block text-gray-300">And The Right Roommate</span>
            </h1>

            <p className="mb-8 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
              Discover verified rooms, connect with compatible roommates, chat
              with owners, and book your stay with confidence.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/properties"
                className="rounded-2xl bg-white px-8 py-4 text-center font-bold text-black transition hover:scale-105"
              >
                Explore Rooms
              </Link>

              <Link
                to="/register"
                className="rounded-2xl border border-white px-8 py-4 text-center font-bold transition hover:bg-white hover:text-black"
              >
                List Your Property
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4">
              <div>
                <h2 className="text-3xl font-black">500+</h2>
                <p className="text-sm text-gray-400">Rooms Listed</p>
              </div>
              <div>
                <h2 className="text-3xl font-black">300+</h2>
                <p className="text-sm text-gray-400">Happy Tenants</p>
              </div>
              <div>
                <h2 className="text-3xl font-black">4.8</h2>
                <p className="text-sm text-gray-400">Average Rating</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-5 text-black shadow-2xl sm:p-8">
            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop"
              alt="Co-living room"
              className="h-64 w-full rounded-3xl object-cover sm:h-80"
            />

            <div className="mt-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Featured Stay</p>
                  <h2 className="text-2xl font-black">Urban Nest Residency</h2>
                  <p className="mt-1 text-gray-600">Bangalore, India</p>
                </div>

                <span className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-gray-100 p-4 text-center">
                  <h3 className="font-black">₹8K</h3>
                  <p className="text-xs text-gray-500">Rent</p>
                </div>
                <div className="rounded-2xl bg-gray-100 p-4 text-center">
                  <h3 className="font-black">4.8</h3>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="rounded-2xl bg-gray-100 p-4 text-center">
                  <h3 className="font-black">Shared</h3>
                  <p className="text-xs text-gray-500">Type</p>
                </div>
              </div>

              <Link
                to="/properties"
                className="mt-6 block rounded-2xl bg-black py-4 text-center font-bold text-white"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28 ">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">
            Why Choose Us
          </p>
          <h2 className="text-3xl font-black sm:text-5xl">
            A Better Way To Rent Rooms
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-gray-950 px-8 py-2 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 text-5xl">{item.icon}</div>
              <h3 className="mb-3 text-xl font-black">{item.title}</h3>
              <p className="leading-relaxed text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="bg-gray-50 py-10 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">
                Featured Listings
              </p>
              <h2 className="text-3xl font-black sm:text-5xl">
                Popular Rooms Near You
              </h2>
            </div>

            <Link to="/properties" className="font-bold underline">
              View All
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredRooms.map((room) => (
              <div
                key={room.title}
                className="overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <img
                  src={room.image}
                  alt={room.title}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold">
                      {room.type}
                    </span>
                    <span className="font-bold">⭐ {room.rating}</span>
                  </div>

                  <h3 className="text-2xl font-black">{room.title}</h3>
                  <p className="mt-2 text-gray-600">{room.location}</p>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-lg font-black">{room.rent}</p>
                    <Link
                      to="/properties"
                      className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28  text-white">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">
            Simple Process
          </p>
          <h2 className="text-3xl font-black sm:text-5xl">
            Book Your Room In 3 Steps
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3 bg-black">
          <Step
            number="01"
            title="Search Rooms"
            text="Choose your preferred location, budget, room type, and available properties."
          />
          <Step
            number="02"
            title="Match & Chat"
            text="Check roommate compatibility and talk directly with owners or tenants."
          />
          <Step
            number="03"
            title="Send Booking"
            text="Request a booking and move into a comfortable verified co-living space."
          />
        </div>
      </section>


      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-black p-8 text-center text-white sm:p-12 lg:p-16">
          <h2 className="text-3xl font-black sm:text-5xl lg:text-6xl">
            Ready To Find Your Next Home?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-gray-300">
            Browse verified rooms, connect with roommates, and make your
            co-living experience easier from day one.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/properties"
              className="rounded-2xl bg-white px-10 py-4 font-black text-black"
            >
              Explore Rooms
            </Link>

            <Link
              to="/register"
              className="rounded-2xl border border-white px-10 py-4 font-black hover:bg-white hover:text-black"
            >
              List Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="rounded-3xl bg-gray-50 p-8 shadow-sm">
      <p className="mb-6 text-6xl font-black text-gray-300">{number}</p>
      <h3 className="mb-4 text-2xl font-black">{title}</h3>
      <p className="leading-relaxed text-gray-600">{text}</p>
    </div>
  );
}