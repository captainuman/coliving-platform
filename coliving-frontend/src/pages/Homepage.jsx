import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const platformStats = [
  { value: "3", label: "User Roles", detail: "Tenant, Owner, Admin" },
  { value: "8", label: "Core Models", detail: "User to Feedback" },
  { value: "24/7", label: "Live Chat", detail: "Socket.IO messaging" },
];

const featureCards = [
  {
    icon: "🏠",
    title: "Property & Room Listings",
    description:
      "Owners can add properties and rooms with rent, capacity, amenities, photos, availability, and approval status.",
  },
  {
    icon: "🤝",
    title: "Roommate Matching",
    description:
      "Tenants can match using lifestyle preferences like food habits, cleanliness, sleep schedule, and gender preference.",
  },
  {
    icon: "📅",
    title: "Booking Management",
    description:
      "Booking requests, room capacity, current tenants, and availability are handled from one organized flow.",
  },
  {
    icon: "💬",
    title: "Real-Time Chat",
    description:
      "Socket.IO based conversations help tenants, owners, and roommates communicate instantly inside the platform.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Create Account",
    description:
      "Register as a tenant, property owner, or admin with secure JWT-based authentication.",
  },
  {
    step: "02",
    title: "Find Compatible Living",
    description:
      "Explore rooms, compare property details, check ratings, and review roommate compatibility before booking.",
  },
  {
    step: "03",
    title: "Book, Chat & Manage",
    description:
      "Send booking requests, chat in real time, manage tenants, and track reviews or feedback after stay.",
  },
];

const projectModules = [
  "User Authentication",
  "Property Management",
  "Room Management",
  "Booking Flow",
  "Review System",
  "Conversation & Messages",
  "Feedback Handling",
  "Admin Approval",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />

      <div className="bg-black px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-gray-300 sm:text-sm md:text-base">
        Co-Living Space Platform • Smart Roommate & Property Management System
      </div>

      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-gray-400 sm:text-sm">
                MERN Stack • JWT • Socket.IO
              </p>

              <h1 className="mb-6 text-4xl font-black leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Find Rooms,
                <span className="block text-gray-300">Roommates & Owners</span>
                In One Platform
              </h1>

              <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg lg:mx-0">
                HomeTown Hub connects tenants, property owners, and admins in a
                single co-living platform with verified listings, roommate
                matching, online booking, reviews, feedback, and real-time chat.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  to="/properties"
                  className="rounded-2xl bg-white px-8 py-4 text-center font-bold text-black shadow-2xl transition-all hover:scale-105"
                >
                  Explore Properties
                </Link>

                <Link
                  to="/register"
                  className="rounded-2xl border border-white px-8 py-4 text-center font-bold transition-all hover:bg-white hover:text-black"
                >
                  Register as Owner
                </Link>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3 lg:mt-16">
                {platformStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center lg:text-left"
                  >
                    <h2 className="text-3xl font-black sm:text-4xl">
                      {stat.value}
                    </h2>
                    <p className="mt-2 font-semibold text-gray-300">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] bg-white p-5 text-black shadow-2xl sm:p-8 lg:rounded-[2.5rem]">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Featured Module</p>
                    <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                      Verified Co-Living Room
                    </h2>
                  </div>

                  <div className="w-fit rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
                    Admin Approved
                  </div>
                </div>

                <div className="mb-6 overflow-hidden rounded-3xl">
                  <img
                    src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop"
                    alt="Modern co-living room"
                    className="h-56 w-full object-cover sm:h-72"
                  />
                </div>

                <div className="mb-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
                  <div className="rounded-2xl bg-gray-100 p-4 text-center">
                    <h3 className="text-2xl font-black">₹8K</h3>
                    <p className="text-sm text-gray-500">Monthly Rent</p>
                  </div>

                  <div className="rounded-2xl bg-gray-100 p-4 text-center">
                    <h3 className="text-2xl font-black">4</h3>
                    <p className="text-sm text-gray-500">Room Capacity</p>
                  </div>

                  <div className="rounded-2xl bg-gray-100 p-4 text-center">
                    <h3 className="text-2xl font-black">92%</h3>
                    <p className="text-sm text-gray-500">Match Score</p>
                  </div>
                </div>

                <div className="mb-6 rounded-3xl bg-gray-50 p-5">
                  <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                    Project Modules
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {projectModules.map((module) => (
                      <span
                        key={module}
                        className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to="/properties"
                  className="block w-full rounded-2xl bg-black py-4 text-center font-bold text-white transition-all hover:scale-[1.02]"
                >
                  View Available Rooms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gray-500 sm:text-sm">
            Platform Features
          </p>

          <h2 className="mb-6 text-3xl font-black sm:text-4xl md:text-5xl">
            Built For Tenants, Owners & Admins
          </h2>

          <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
            The system is designed around your actual project flow: property
            listings, room availability, tenant bookings, roommate matching,
            real-time messaging, reviews, feedback, and admin control.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {featureCards.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-2xl sm:p-8"
            >
              <div className="mb-5 text-4xl sm:text-5xl">{feature.icon}</div>
              <h3 className="mb-4 text-xl font-black sm:text-2xl">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black py-16 text-white sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center sm:mb-16">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gray-400 sm:text-sm">
              Process
            </p>

            <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">
              How HomeTown Hub Works
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 lg:gap-10">
            {workflowSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8 lg:p-10"
              >
                <div className="mb-6 text-5xl font-black text-gray-500 sm:text-6xl">
                  {item.step}
                </div>

                <h3 className="mb-4 text-2xl font-black sm:text-3xl">
                  {item.title}
                </h3>

                <p className="leading-relaxed text-gray-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-black p-8 text-center text-white sm:p-12 lg:rounded-[3rem] lg:p-16">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,white,transparent_35%)]" />

            <div className="relative z-10">
              <h2 className="mb-6 text-3xl font-black sm:text-5xl lg:text-6xl">
                Manage Co-Living
                <span className="block text-gray-400">The Smarter Way</span>
              </h2>

              <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
                Start with a tenant profile, list a property as an owner, or use
                the admin dashboard to approve properties, manage users, and
                monitor platform feedback.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-5">
                <Link
                  to="/register"
                  className="rounded-2xl bg-white px-10 py-5 text-center font-black text-black transition-all hover:scale-105"
                >
                  Get Started
                </Link>

                <Link
                  to="/properties"
                  className="rounded-2xl border border-white px-10 py-5 text-center font-black transition-all hover:bg-white hover:text-black"
                >
                  Explore Rooms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}